import { CachePolicy, prepare } from "https://deno.land/x/plug/plug.ts";
const url =
  "https://github.com/littledivy/picohttpparser_deno/releases/download/0.1.0/";
let opts = {
  name: "ffi",
  urls: {
    darwin: {
      aarch64: url + "ffi_aarch64.dylib",
      x86_64: url + "ffi.dylib",
    },
    linux: url + "ffi.so",
  },
};

if (Deno.env.get("DEV")) {
  let ext = Deno.build.os === "darwin" ? "dylib" : "so";
  delete opts.urls;
  opts.url = (new URL("bin/ffi." + ext, import.meta.url)).toString();
  opts.policy = CachePolicy.NONE;
}

const ffioSys = (await prepare(opts, {
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
})).symbols;

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
