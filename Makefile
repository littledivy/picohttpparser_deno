CC?=gcc
CFLAGS=-Wall -Wextra -Werror -fPIC -shared -Iinclude -O3 -ftree-vectorize -funroll-loops

UNAME_S := $(shell uname -s)
ifeq ($(UNAME_S),Linux)
	EXT = .so
endif
ifeq ($(UNAME_S),Darwin)
	EXT = .dylib
endif


build: ffi.c picohttpparser/picohttpparser.c
	$(CC) -Wall $(CFLAGS) $(LDFLAGS) $^ -o bin/ffi$(EXT)

clean:
	rm -f bin

.PHONY: build