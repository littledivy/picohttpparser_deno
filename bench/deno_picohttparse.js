import { parseRequest } from "../mod.ts";

let [total, count] = typeof Deno !== "undefined"
  ? Deno.args
  : [process.argv[2], process.argv[3]];

total = total ? parseInt(total, 0) : 5;
count = count ? parseInt(count, 10) : 1000000;

const now = () => Date.now();
function bench(fun) {
  while (--total) {
    const start = now();
    for (let i = 0; i < count; i++) fun();
    const elapsed = now() - start;
    const rate = Math.floor(count / (elapsed / 1000));
    console.log(`time ${elapsed} ms rate ${rate}`);
  }
}

const { encode } = Deno.core;

let h0 = "GET / HTTP/1.1\r\n";
for (let i = 0; i < 100; i++) h0 += `X-Header-1: 1\r\n`;
h0 += "\r\n";
h0 = encode(h0);
console.log(`${h0.byteLength} bytes`);

bench(() => parseRequest(h0));
