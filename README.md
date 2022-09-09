## `picohttpparser` in Deno

```typescript
import { parseRequest } from "https://deno.land/x/picohttpparser/mod.ts";

let h0 = encode(`HTTP/1.1 200 OK\r\nContent-Length: 13\r\n\r\nHello, World!`);
let req = parseRequest(h0);

while (req.isPartial) {
  // Read more bytes from _somewhere_
  h0 = read();
  req = parseRequest(h0);
}

req.method; // "GET"
req.url; // "/"
req.body; // null
```

![image](https://user-images.githubusercontent.com/34997667/189287994-7ab35925-f118-4110-a035-22dceaf95c6b.png)
