<script setup lang="ts">
import * as signalR from "@microsoft/signalr";
import base64 from "base64-js";
import { onMounted, ref } from "vue";

import { HttpClient } from "@microsoft/signalr";

var connection = new signalR.HubConnectionBuilder()
  .withUrl("https://localhost:22001/ws", {
    withCredentials: false,
  })
  .build();

// connection.invoke("")
// connection.invoke("ReceiveBuffer", );

const video = ref<HTMLVideoElement>();

// const player = VideoJs("my-video");

let recorder: MediaRecorder | null = null;

const Broadcast = async () => {
  if (navigator.mediaDevices.getUserMedia && video.value != null) {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    var options = { mimeType: "video/webm; codecs=vp9,opus" };

    recorder = new MediaRecorder(stream, options);

    recorder.start(1000);

    // video.value.onpause = () => {
    //   recorder?.pause();
    // };

    // video.value.onplay = () => {
    //   recorder?.resume();
    // };

    const subject = new signalR.Subject();

    connection.send("UploadStream", subject);

    recorder.ondataavailable = async (ev) => {
      const arrayBuffer = await ev.data.arrayBuffer();
      const data = base64.fromByteArray(new Uint8Array(arrayBuffer));

      console.log(data.length);

      subject.next(data);

      // arr.push(arrayBuffer);

      // var blob = new Blob([arrayBuffer]);
      // const url = URL.createObjectURL(blob);
      // const a = document.createElement("a");
      // a.href = url;
      // a.download = `stream-${count++}.webm`;
      // a.click();
    };

    recorder.onstop = (ev) => {
      // var blob = new Blob(arr);
      // const url = URL.createObjectURL(blob);
      // const a = document.createElement("a");
      // a.href = url;
      // a.download = `stream-${count++}.webm`;
      // a.click();
    };

    video.value.srcObject = recorder.stream;
  }
};

// const timeout = setTimeout(() => {
//   video2.value?.pause();
//   console.log(video2.value?.buffered.length);
//   if (video2.value?.currentTime) video2.value.currentTime += 250;
//   video2.value?.play();
// }, 3000);

const webm9MimeCodec = "video/webm; codecs=vp9,opus";

const channelFactory = function () {
  const _arrayBufferBuffer: Array<any | unknown> = [];
  const pullResolveQueue: Array<any | unknown> = [];

  return {
    arrayBuffer: _arrayBufferBuffer,
    push: (ab: ArrayBuffer) => {
      if (pullResolveQueue.length > 0) {
        const pull = pullResolveQueue.pop();
        pull(ab);
      } else {
        _arrayBufferBuffer.push(ab);
      }
    },
    pull: () =>
      new Promise((res, rej) => {
        if (_arrayBufferBuffer.length > 0) {
          res(_arrayBufferBuffer.pop());
        }
        pullResolveQueue.push(res);
      }),
  };
};

const channel = channelFactory();

let sourceBuffer: SourceBuffer | null = null;

if (video.value)
  video.value.onloadedmetadata = (ev) => {
    console.log(ev);
  };

const Join = async () => {
  connection.on("on-data", (item) => {
    if (item !== new String() && item != null) {
      const ab = base64.toByteArray(item);
      channel.push(ab);
    }
  });
};

onMounted(async () => {
  await connection.start();
  const mediaSource = new MediaSource();

  mediaSource.addEventListener("sourceopen", async () => {
    sourceBuffer = mediaSource.addSourceBuffer(webm9MimeCodec);
    sourceBuffer.mode = "sequence";
    sourceBuffer.addEventListener("updateend", async () => {
      // if (video.value?.paused) video.value.play();
      const ab = await channel.pull();
      sourceBuffer?.appendBuffer(<BufferSource>ab);
    });

    const ab = await channel.pull();
    sourceBuffer.appendBuffer(<BufferSource>ab);
  });
  if (video.value) video.value.src = URL.createObjectURL(mediaSource);
  console.log("user media");
});
</script>

<template>
  <button @click="Broadcast">Broadcast</button>
  <button @click="Join">Join</button>
  <video
    width="500"
    height="500"
    ref="video"
    id="video-stream"
    controls
    autoplay
    preload="auto"
  ></video>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
