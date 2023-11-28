<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import * as signalR from "@microsoft/signalr";

var connection = new signalR.HubConnectionBuilder()
  .withUrl("https://192.168.3.65:22001/ws", {
    withCredentials: false,
  })
  .build();

const video = ref<HTMLVideoElement>();
const pcs: Array<{
  id: string;
  connection: RTCPeerConnection;
}> = [];

const config: RTCConfiguration = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302",
    },
  ],
};

const mediaStream = computed(async () => {
  return await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true,
  });
});

connection.on(
  "new-meeting",
  (meeting: {
    id: string;
    name: string;
    mainConnectionId: string;
    pipes: Array<any>;
  }) => {
    alert("New meeting created: " + meeting.id);
    mediaStream.value.then((x) => {
      video.value!.srcObject = x;
    });
  }
);

connection.on("new-client", (clientId) => {
  const pc = new RTCPeerConnection(config);

  mediaStream.value.then((stream) => {
    stream.getTracks().forEach((track) => {
      pc!.addTrack(track, stream);
    });
  });

  pc.createOffer()
    .then((offer) => pc.setLocalDescription(new RTCSessionDescription(offer)))
    .then(() => {
      const id: string = Date.now().toString();
      pcs.push({
        id: id,
        connection: pc,
      });
      connection.send(
        "OfferToClient",
        { id, type: pc.localDescription!.type, sdp: pc.localDescription!.sdp },
        clientId
      );
    });

  // pc.setRemoteDescription(pipe.offer);
});

connection.on("offer", (offer) => {
  const pc = new RTCPeerConnection();
  pc.setRemoteDescription(offer);
});

connection.on("candidate", (candidate, connectionId) => {
  var pc = pcs.find((x) => x.id == connectionId);
  pc!.connection.addIceCandidate(JSON.parse(candidate));
});

connection.on("answered", (pipe) => {
  const pc = pcs.find((x) => x.id == pipe.offer.id);
  console.log(pipe.answer);
  pc!.connection.setRemoteDescription(pipe.answer).then(() => {
    console.log(pc!.connection.localDescription);
    console.log(pc!.connection.remoteDescription);

    pc!.connection.onicecandidate = (ev) => {
      connection.send(
        "OnCandidate",
        ev.candidate,
        pipe.answererId,
        pipe.answer.id
      );
    };

    pc!.connection.ontrack = (ev) => {
      video.value!.srcObject = ev.streams[0];
    };

    connection.send("ClientReady", pipe.answererId, pipe.answer.id);
  });
});

connection.on("ready", (connectionId) => {
  const pc = pcs.find((x) => x.id == connectionId);
  console.log(pc);
});

const CreateMeeting = async () => {
  await connection.send("StartNewMeeting", "xyz");
};

const Join = async () => {
  // const meetingId = prompt("Enter meeting Id: ");
  // let pc = new RTCPeerConnection(config);

  // pc.createOffer()
  //   .then((offer) => pc.setLocalDescription(new RTCSessionDescription(offer)))
  //   .then(() => {
  //     const id: string = Date.now().toString();
  //     pcs.push({
  //       id: id,
  //       connection: pc,
  //     });

  //     return connection.send(
  //       "JoinToMeeting",
  //       {
  //         id: id,
  //         type: pc.localDescription!.type,
  //         sdp: pc.localDescription!.sdp,
  //       },
  //       meetingId
  //     );
  //   });

  await connection.send("JoinToMeeting");
};

onMounted(async () => {
  await connection.start();
});
</script>

<template>
  <button @click="CreateMeeting">Create meeting</button>
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
