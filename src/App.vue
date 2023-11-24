<script setup lang="ts">
  import * as signalR from "@microsoft/signalr";
  import { ConsoleLogger } from "@microsoft/signalr/dist/esm/Utils";
  import { BufferReader } from "protobufjs";
  import { OutputFileType } from "typescript";
  import { onBeforeMount, onMounted, ref } from "vue";
  import VideoJs from "video.js";
  import base64 from "base64-js";

  var connection = new signalR.HubConnectionBuilder()
    .withUrl("http://192.168.3.65:22001/ws", {
      withCredentials: false,
    })
    .build();

  // connection.invoke("")
  // connection.invoke("ReceiveBuffer", );

  const video = ref();

  // const player = VideoJs("my-video");

  const encoder = new TextEncoder();
  const Broadcast = async () => {
    if (navigator.mediaDevices.getUserMedia) {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      var options = { mimeType: "video/webm; codecs=vp9,opus" };

      const recorder = new MediaRecorder(stream, options);

      recorder.start(1000);

      video.value.onpause = () => {
        recorder.pause();
      };

      video.value.onplay = () => {
        recorder.resume();
      };

      const subject = new signalR.Subject();

      connection.send("UploadStream", subject);

      recorder.ondataavailable = async (ev) => {
        // subject.next();

        // const item = await ev.data.text();

        const arrayBuffer = await ev.data.arrayBuffer();
        const data = base64.fromByteArray(new Uint8Array(arrayBuffer));

        console.log(data.length);

        subject.next(data);

        // const stream = ev.data.stream();
        // const reader = stream.getReader();

        // while (reader.closed) {
        //   const data = await reader.read();
        //   if (data.done) break;

        //   subject.next(data.value);
        // }

        // const buffer = await reader.read();

        // subject.next(buffer.value);

        // console.log(await ev.data.text())
        // connection.start()
        // .then(async () => connection.invoke("ReceiveBuffer", await ev.data.text()))

        // console.log("sad");
        // ev.data.stream().
      };

      video.value.srcObject = recorder.stream;
    }
  };

  const webm9MimeCodec = "video/webm; codecs=vp9,opus";

  const channelFactory = function () {
    const _arrayBufferBuffer: Array<any | unknown> = [];
    const pullResolveQueue: Array<any | unknown> = [];

    return {
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

  const Join = async () => {
    connection.on("header", (header) => {
      if (header !== new String() && header != null) {
        const ab = base64.toByteArray(header);
        console.log(ab.length);
        channel.push(ab);
      }

      // connection.on("on-data", (item) => {
      //   const ab = base64.toByteArray(item);
      //   console.log(ab.length);
      //   channel.push(ab);
      // });
    });
    await connection.send("GetHeader");

    // connection.stream("GetReader").subscribe({
    //   next: (item: string) => {},
    //   error: (e) => {},
    //   complete: () => {},
    // });
  };

  onMounted(async () => {
    await connection.start();
    const mediaSource = new MediaSource();

    mediaSource.addEventListener("sourceopen", async () => {
      console.log("source opened");
      sourceBuffer = mediaSource.addSourceBuffer(webm9MimeCodec);
      sourceBuffer.mode = "sequence";
      sourceBuffer.addEventListener("updateend", async () => {
        if (video.value.paused) video.value.play();

        const ab = await channel.pull();
        sourceBuffer?.appendBuffer(<BufferSource>ab);
      });

      const ab = await channel.pull();
      sourceBuffer.appendBuffer(<BufferSource>ab);
    });
    video.value.src = URL.createObjectURL(mediaSource);
    console.log("user media");
  });
</script>

<template>
  <div class="">
    <div class="w-screen mt-2 flex items-center justify-center">
      <video
        class="w-[calc(100dvw-30px)] rounded max-h-[calc(100dvh-200px)]"
        ref="video"
        id="video-stream"
        controls
        autoplay
      ></video>
    </div>
    <div class="mt-2 w-screen px-3 font-bold grid grid-cols-2 gap-3">
      <button
        class="border border-2 font-bold bg-green-500 border-white py-4 rounded"
        @click="Broadcast"
      >
        Broadcast
      </button>
      <button
        class="border border-2 font-bold bg-yellow-500 border-white py-4 rounded"
        @click="Join"
      >
        Join
      </button>
    </div>
  </div>
</template>
