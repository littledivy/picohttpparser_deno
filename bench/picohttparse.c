#include "../picohttpparser/picohttpparser.h"
#include <string.h>
#include <stdio.h>
#include <time.h>
#include <stdlib.h>
#include <dlfcn.h>

int total = 5;
int count = 1000000;

int (*parse)(char* buf, ssize_t rret);

void bench (char* buf, ssize_t rret) {
  float start, end;
  start = (float)clock() / (CLOCKS_PER_SEC / 1000);
  for (int i = 0; i < count; i++) {
    if (parse(buf, rret) == -1) {
        printf("error");
    }
  }
  end = (float)clock() / (CLOCKS_PER_SEC / 1000);
  printf("time %.0f ms rate %.0f\n", (end - start), count / ((end - start) / 1000));
}

int main (int argc, char** argv) {
  if (argc > 1) total = atoi(argv[1]);
  if (argc > 2) count = atoi(argv[2]);

  void* lib = dlopen("/Users/divy/gh/picohttparse-deno/bin/ffi.dylib", RTLD_LAZY);
  if (!lib) {
    printf("error: %s\n", dlerror());
    return 1;
  }

  parse = dlsym(lib, "ffio_parse_request");

  char buf[1521] = "GET / HTTP/1.1\r\n";
  for (int i = 0; i < 100; i++) {
    strcat(buf, "X-Header-");    
    strcat(buf, "1");
    strcat(buf, ": ");
    strcat(buf, "1");
    strcat(buf, "\r\n");
  }
  strcat(buf, "\r\n");

  while (total--) bench(buf, 1520);
}