import { HubConnection } from "@microsoft/signalr";
import P2P, { ISendModel } from "./P2P";
import uuid from "uuid";
class Host {
  /**
   *
   */
  private initialized: boolean = false;
  public connectionId: string | null = null;
  public connection: HubConnection;
  constructor(connection: HubConnection) {
    this.connection = connection;
  }

  public async Initialize() {
    await this.connection.start();
    this.connectionId = this.connection.connectionId;

    this.initialized = true;
  }

  public async Send(clientId: string, data: any) {
    if (this.initialized) {
      await this.connection.send("send", clientId, JSON.stringify(data));
    } else {
      throw new Error("Host hasn't been initialized yet");
    }
  }
}

type EventAction = (data: any) => Promise<void>;

class Pipe {
  public SenderHost: Host;
  public ReceiverHost: Host;
  private connection: HubConnection;

  private p2pCollection: Map<string, P2P>;

  /**
   *
   */
  constructor(connection: HubConnection) {
    this.SenderHost = new Host(connection);
    this.ReceiverHost = new Host(connection);
    this.connection = connection;

    this.p2pCollection = new Map();
  }

  public async Initialize() {
    await this.SenderHost.Initialize();
    await this.ReceiverHost.Initialize();

    this.connection.on("message", async (rawData) => {
      const data: ISendModel = JSON.parse(rawData);

      if (this.p2pCollection.has(data.p2pId)) {
        const p2p: any = this.p2pCollection.get(data.p2pId);
        if (p2p[data.method]) await (<EventAction>p2p[data.method])(data.data);
        else
          throw new Error(
            `${data.method} named method not found in ${data.p2pId}`
          );
      } else {
        throw new Error(`${data.p2pId} Peer-To-Peer not found`);
      }
    });
  }

  public async SendToSenderHost(data: any) {
    await this.SenderHost.Send(this.ReceiverHost.connectionId!, data);
  }

  public async SendToReceiverHost(data: any) {
    await this.SenderHost.Send(this.SenderHost.connectionId!, data);
  }

  public async SetupSenderPeer(
    peerConfig: RTCConfiguration,
    stream: MediaStream,
    videoElement: HTMLVideoElement
  ) {
    const id = uuid.v4();
    const p2p = new P2P({
      id: id,
      peerConfig: peerConfig,
      pipe: this,
      stream: stream,
      type: "Sender",
      videoElement: videoElement,
    });

    this.p2pCollection.set(id, p2p);

    await p2p.Setup();
  }

  public async SetupReceiverPeer(
    peerConfig: RTCConfiguration,
    stream: MediaStream,
    videoElement: HTMLVideoElement
  ) {
    const id = uuid.v4();
    const p2p = new P2P({
      id: id,
      peerConfig: peerConfig,
      pipe: this,
      stream: stream,
      type: "Receiver",
      videoElement: videoElement,
    });

    this.p2pCollection.set(id, p2p);

    await p2p.Setup();
  }
}

export default Pipe;

export { Pipe, Host };
