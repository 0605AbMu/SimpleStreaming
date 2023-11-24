<template>
  <video id="video-stream" controls autoplay></video>
  <button @click="start">play</button>
</template>

<script setup>
import { onMounted } from "vue";

const webm9MimeCodec = 'video/webm; codecs="vp9, opus"';
let video = null;
var count = 0;

const fetchVideoBuffer = () =>
  fetch(`http://localhost:5000/vid0.webm`, {
    mode: "no-cors",
  }).then((res) => res.arrayBuffer());

var started = false;
const start = () => {
  console.log("start");
  if (started) return;
  started = true;

  const mediaSource = new MediaSource();
  var sourceBuffer = null;

  fetchVideoBuffer().then((ab) => {
    mediaSource.addEventListener("sourceopen", () => {
      sourceBuffer = mediaSource.addSourceBuffer(webm9MimeCodec);
      sourceBuffer.mode = "sequence";
      sourceBuffer.appendBuffer(ab);
    });

    // setInterval(() => fetchVideoBuffer()
    //     .then((abb) => sourceBuffer.appendBuffer(abb)), 4000)

    video.src = URL.createObjectURL(mediaSource);
  });
};

onMounted(() => {
  video = document.getElementById("video-stream");
});
</script>
