import uuid from "uuid";
import { HubConnection } from "@microsoft/signalr";
import { Pipe, Host } from "./Host2Host";

export interface IP2PConfig {
  id: string;
  peerConfig: RTCConfiguration;
  pipe: Pipe;
  type: P2PType;
  stream: MediaStream;
  videoElement: HTMLVideoElement;
}

export interface ISendModel {
  method: string;
  data: any;
  p2pId: string;
}

export type P2PType = "Sender" | "Receiver";

class P2P {
  public Id: string;
  public PC: RTCPeerConnection;
  public pipe: Pipe;
  public type: P2PType;
  public stream: MediaStream;
  public videoElement: HTMLVideoElement;
  /**
   *
   */
  constructor(p2pConfig: IP2PConfig) {
    this.Id = p2pConfig.id;
    this.PC = new RTCPeerConnection(p2pConfig.peerConfig);
    this.pipe = p2pConfig.pipe;
    this.type = p2pConfig.type;
    this.stream = p2pConfig.stream;
    this.videoElement = p2pConfig.videoElement;
  }

  public async SendToSender(data: ISendModel): Promise<void> {
    return await this.pipe.SendToReceiverHost(data);
  }

  public async SendToReceiver(data: ISendModel): Promise<void> {
    return await this.pipe.SendToSenderHost(data);
  }

  public async PCOn() {
    //Candidate handshaking
    this.PC.onicecandidate = async (ev) => {
      const candidate = ev.candidate;
      if (candidate === null) return;

      switch (this.type) {
        case "Sender":
          await this.SendToReceiver({
            method: "candidate",
            data: candidate,
            p2pId: this.Id,
          });
          break;

        case "Receiver":
          await this.SendToSender({
            method: "candidate",
            data: candidate,
            p2pId: this.Id,
          });
          break;

        default:
          break;
      }
    };
  }

  public async Setup() {
    switch (this.type) {
      case "Sender":
        await this.SetupForSender();
        break;

      case "Receiver":
        await this.SetupForReceiver();
        break;

      default:
        break;
    }
  }

  private async SetupForSender() {
    const offer = await this.CreateOffer();

    await this.SetLocalDescription(offer);

    this.stream
      .getTracks()
      .forEach((track) => this.PC.addTrack(track, this.stream));

    await this.SendToReceiver({
      data: offer,
      method: "HandleOffer",
      p2pId: this.Id,
    });
  }

  private async CreateOffer() {
    return await this.PC!.createOffer();
  }

  private async SetLocalDescription(sdp: any) {
    return await this.PC?.setLocalDescription(new RTCSessionDescription(sdp));
  }

  private async SetRemoteDescription(sdp: any) {
    return await this.PC?.setRemoteDescription(new RTCSessionDescription(sdp));
  }

  private async SetupForReceiver() {
    this.PC.ontrack = (ev) => {
      this.videoElement.srcObject = ev.streams[0];
    };
  }

  private async CreateAnswer() {
    return await this.PC.createAnswer();
  }

  private async HandleOffer(offer: RTCSessionDescription) {
    await this.SetRemoteDescription(offer);
    const answer = await this.CreateAnswer();
    await this.SetLocalDescription(answer);
    this.SendToSender({
      data: answer,
      method: "HandleAnswer",
      p2pId: this.Id,
    });
  }

  private async HandleAnswer(answer: RTCSessionDescription) {
    await this.SetRemoteDescription(answer);
  }

  private async HandleCandidate(candidate: RTCIceCandidate) {
    this.PC.addIceCandidate(candidate);
  }
}

export default P2P;
export { P2P };
