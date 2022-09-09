CC?=gcc
CFLAGS=-Wall -Wextra -fPIC -Iinclude -O3

build: picohttparse.c ../picohttpparser/picohttpparser.c
	$(CC) -Wall $(CFLAGS) $(LDFLAGS) -o picohttparse $^

clean:
	rm -f picohttparse

.PHONY: build