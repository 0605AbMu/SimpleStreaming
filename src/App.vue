<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import * as signalR from "@microsoft/signalr";
import P2P from "./Services/P2P";
import { Pipe } from "./Services/Host2Host";
const video = ref<HTMLVideoElement>();

var connection = new signalR.HubConnectionBuilder()
  .withUrl("http://192.168.3.65:22001/ws-peer", {
    withCredentials: false,
  })
  .build();

const config: RTCConfiguration = {
  iceServers: [
    {
      urls: "turn:numb.viagenie.ca",
      credential: "muazkh",
      username: "webrtc@live.com",
    },
    {
      urls: "turn:192.158.29.39:3478?transport=udp",
      credential: "JZEOEt2V3Qb0y27GRntt2u2PAYA=",
      username: "28224511:1379330808",
    },
    {
      urls: "turn:192.158.29.39:3478?transport=tcp",
      credential: "JZEOEt2V3Qb0y27GRntt2u2PAYA=",
      username: "28224511:1379330808",
    },
    {
      urls: "turn:turn.bistri.com:80",
      credential: "homeo",
      username: "homeo",
    },
    {
      urls: "turn:turn.anyfirewall.com:443?transport=tcp",
      credential: "webrtc",
      username: "webrtc",
    },
  ],
  iceCandidatePoolSize: 100,
};

const GetStream = async () => {
  return await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true,
  });
};

onMounted(async () => {
  const pipe = new Pipe(connection);
  pipe.SetupSenderPeer(config, await GetStream(), video.value!);
  // await connection.start();
});
</script>

<template>
  <button @click="StartBroadcast">Create meeting</button>
  <button @click="Join">Join meeting</button>
  <video
    width="500"
    height="500"
    ref="video"
    id="video-stream"
    controls
    autoplay
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
