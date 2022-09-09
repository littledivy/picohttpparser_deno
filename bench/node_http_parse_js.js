const { HTTPParser } = require("http-parser-js");

const queueMicrotask = globalThis.queueMicrotask || process.nextTick;
let [total, count] = typeof Deno !== "undefined"
  ? Deno.args
  : [process.argv[2], process.argv[3]];

total = total ? parseInt(total, 0) : 5;
count = count ? parseInt(count, 10) : 1000000;

function bench(fun) {
  const start = Date.now();
  for (let i = 0; i < count; i++) fun();
  const elapsed = Date.now() - start;
  const rate = Math.floor(count / (elapsed / 1000));
  console.log(`time ${elapsed} ms rate ${rate}`);
  if (--total) bench(fun);
}

let h0 = "GET / HTTP/1.1\r\n";
for (let i = 0; i < 100; i++) h0 += `X-Header-1: 1\r\n`;
h0 += "\r\n";
h0 = Buffer.from(h0);
console.log(`${h0.byteLength} bytes`);

bench(() => {
  const parser = new HTTPParser(HTTPParser.REQUEST);
  parser.execute(h0);
  parser.finish();
});
