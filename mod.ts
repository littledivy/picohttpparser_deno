const ffioSys = Deno.dlopen("bin/ffi.dylib", {
  ffio_parse_request: {
    parameters: ["buffer", "i32"],
    result: "i32",
  },
  ffio_get_minor_version: {
    parameters: [],
    result: "i32",
  },
  ffio_get_method: {
    parameters: ["buffer"],
    result: "i32",
  },
  ffio_get_url: {
    parameters: ["buffer"],
    result: "i32",
  },
  ffio_get_header: {
    parameters: ["buffer", "buffer"],
    result: "i32",
  },
}).symbols;

const {
  ffio_parse_request,
  ffio_get_minor_version,
  ffio_get_method,
  ffio_get_url,
  ffio_get_header,
} = ffioSys;

const { decode, encode } = Deno.core;
const methodBuf = new Uint8Array(10);
class ParsedRequest {
  hasBody: boolean;
  #method: string | null = null;
  #url: string | null = null;

  constructor(hasBody: boolean) {
    this.hasBody = hasBody;
  }

  get httpVersion() {
    return ffio_get_minor_version();
  }

  get method(): string {
    if (this.#method === null) {
      const len = ffio_get_method(methodBuf);
      this.#method = decode(methodBuf.subarray(0, len));
    }
    return this.#method!;
  }

  get url(): string {
    if (this.#url == null) {
      const len = ffio_get_url(methodBuf);
      this.#url = decode(methodBuf.subarray(0, len));
    }
    return this.#url!;
  }
}

export function parseRequest(u8) {
  const hasBody = ffio_parse_request(u8, u8.byteLength);
  if (hasBody === -1) {
    throw new Error("Failed to parse request");
  }
  return new ParsedRequest(hasBody);
}
