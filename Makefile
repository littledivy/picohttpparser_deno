CC?=gcc
CFLAGS=-Wall -Wextra -Werror -fPIC -shared -Iinclude -O3 -ftree-vectorize -funroll-loops

build: ffi.c picohttpparser/picohttpparser.c
	$(CC) -Wall $(CFLAGS) $(LDFLAGS) $^ -o bin/ffi.dylib

clean:
	rm -f bin

.PHONY: build