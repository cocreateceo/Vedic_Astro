function handler(event) {
  var request = event.request;
  var uri = request.uri;
  if (uri.includes('__next.') && uri.endsWith('.txt')) {
    var match = uri.match(/^(.+\/__next\.[^.]+)\.(__[^.]+__\.txt)$/);
    if (match) {
      request.uri = match[1] + '/' + match[2];
    }
  }
  return request;
}
