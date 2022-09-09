#include "picohttpparser/picohttpparser.h"
#include <string.h>

const char *method, *path;
int pret, minor_version, has_body;
struct phr_header headers[100];
size_t buflen = 0, prevbuflen = 0, method_len, path_len, num_headers;

int ffio_parse_request(char* buf, ssize_t rret) {
  prevbuflen = buflen;
  buflen += rret;  
  /* parse the request */
  num_headers = sizeof(headers) / sizeof(headers[0]);
  pret = phr_parse_request(buf, buflen, &method, &method_len, &path, &path_len,
                             &minor_version, headers, &num_headers, prevbuflen);
  buflen = prevbuflen = 0;
  // check if GET or HEAD
  if (pret == -1) {
    return -1;
  }
  int has_body = 1;
  if (strncmp(method, "GET", method_len) == 0) {
    has_body = 0;
  } else if (strncmp(method, "HEAD", method_len) == 0) {
    has_body = 0;
  }
  return has_body;
}

int ffio_get_minor_version() {
  return minor_version;
}

size_t ffio_get_method(void* method_buf) {
  memcpy(method_buf, method, method_len);
  return method_len;
}

size_t ffio_get_url(void* url_buf) {
  memcpy(url_buf, path, path_len);
  return path_len;
}

size_t ffio_get_header(void* header_buf, const char* header_name) {
  size_t header_name_len = strlen(header_name);
  for (size_t i = 0; i < num_headers; i++) {
    if (strncmp(headers[i].name, header_name, header_name_len) == 0) {
      memcpy(header_buf, headers[i].value, headers[i].value_len);
      return headers[i].value_len;
    }
  }
  return 0;
}