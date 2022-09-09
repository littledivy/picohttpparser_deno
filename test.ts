import { assert, assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { parseRequest } from "./mod.ts";

const { encode } = Deno.core;
Deno.test("parse", () => {
  const req =
    `GET / HTTP/1.1\r\nHost: localhost:8080\r\nUser-Agent: curl/7.64.1\r\nAccept: */*\r\n\r\n`;
  const u8 = encode(req);
  const parsed = parseRequest(u8);
  assert(!parsed.hasBody);
  assertEquals(parsed.method, "GET");
  assertEquals(parsed.url, "/");
});
