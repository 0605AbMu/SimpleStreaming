/* eslint-disable */
import _m0 from "protobufjs/minimal";

export const protobufPackage = "streaming";

/** The request message containing the user's name. */
export interface StreamRequest {
  buffer: Uint8Array;
}

export interface StreamReply {
  buffer: Uint8Array;
}

/** The response message containing the greetings. */
export interface HelloReply {
  message: string;
}

export interface Empty {
}

function createBaseStreamRequest(): StreamRequest {
  return { buffer: new Uint8Array(0) };
}

export const StreamRequest = {
  encode(message: StreamRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.buffer.length !== 0) {
      writer.uint32(10).bytes(message.buffer);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): StreamRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStreamRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.buffer = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): StreamRequest {
    return { buffer: isSet(object.buffer) ? bytesFromBase64(object.buffer) : new Uint8Array(0) };
  },

  toJSON(message: StreamRequest): unknown {
    const obj: any = {};
    if (message.buffer.length !== 0) {
      obj.buffer = base64FromBytes(message.buffer);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<StreamRequest>, I>>(base?: I): StreamRequest {
    return StreamRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<StreamRequest>, I>>(object: I): StreamRequest {
    const message = createBaseStreamRequest();
    message.buffer = object.buffer ?? new Uint8Array(0);
    return message;
  },
};

function createBaseStreamReply(): StreamReply {
  return { buffer: new Uint8Array(0) };
}

export const StreamReply = {
  encode(message: StreamReply, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.buffer.length !== 0) {
      writer.uint32(10).bytes(message.buffer);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): StreamReply {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStreamReply();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.buffer = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): StreamReply {
    return { buffer: isSet(object.buffer) ? bytesFromBase64(object.buffer) : new Uint8Array(0) };
  },

  toJSON(message: StreamReply): unknown {
    const obj: any = {};
    if (message.buffer.length !== 0) {
      obj.buffer = base64FromBytes(message.buffer);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<StreamReply>, I>>(base?: I): StreamReply {
    return StreamReply.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<StreamReply>, I>>(object: I): StreamReply {
    const message = createBaseStreamReply();
    message.buffer = object.buffer ?? new Uint8Array(0);
    return message;
  },
};

function createBaseHelloReply(): HelloReply {
  return { message: "" };
}

export const HelloReply = {
  encode(message: HelloReply, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.message !== "") {
      writer.uint32(10).string(message.message);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): HelloReply {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseHelloReply();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.message = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): HelloReply {
    return { message: isSet(object.message) ? globalThis.String(object.message) : "" };
  },

  toJSON(message: HelloReply): unknown {
    const obj: any = {};
    if (message.message !== "") {
      obj.message = message.message;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<HelloReply>, I>>(base?: I): HelloReply {
    return HelloReply.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<HelloReply>, I>>(object: I): HelloReply {
    const message = createBaseHelloReply();
    message.message = object.message ?? "";
    return message;
  },
};

function createBaseEmpty(): Empty {
  return {};
}

export const Empty = {
  encode(_: Empty, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Empty {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEmpty();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(_: any): Empty {
    return {};
  },

  toJSON(_: Empty): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<Empty>, I>>(base?: I): Empty {
    return Empty.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Empty>, I>>(_: I): Empty {
    const message = createBaseEmpty();
    return message;
  },
};

/** The greeting service definition. */
export type RemoteStreamDefinition = typeof RemoteStreamDefinition;
export const RemoteStreamDefinition = {
  name: "RemoteStream",
  fullName: "streaming.RemoteStream",
  methods: {
    /** Sends a greeting */
    writeBuffer: {
      name: "WriteBuffer",
      requestType: StreamRequest,
      requestStream: false,
      responseType: Empty,
      responseStream: false,
      options: {},
    },
    readBuffer: {
      name: "ReadBuffer",
      requestType: Empty,
      requestStream: false,
      responseType: StreamReply,
      responseStream: true,
      options: {},
    },
  },
} as const;

function bytesFromBase64(b64: string): Uint8Array {
  if (globalThis.Buffer) {
    return Uint8Array.from(globalThis.Buffer.from(b64, "base64"));
  } else {
    const bin = globalThis.atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; ++i) {
      arr[i] = bin.charCodeAt(i);
    }
    return arr;
  }
}

function base64FromBytes(arr: Uint8Array): string {
  if (globalThis.Buffer) {
    return globalThis.Buffer.from(arr).toString("base64");
  } else {
    const bin: string[] = [];
    arr.forEach((byte) => {
      bin.push(globalThis.String.fromCharCode(byte));
    });
    return globalThis.btoa(bin.join(""));
  }
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends { $case: string } ? { [K in keyof Omit<T, "$case">]?: DeepPartial<T[K]> } & { $case: T["$case"] }
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
