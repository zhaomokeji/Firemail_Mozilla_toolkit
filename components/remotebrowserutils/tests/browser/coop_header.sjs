function handleRequest(request, response)
{
  Components.utils.importGlobalProperties(["URLSearchParams"]);
  let query = new URLSearchParams(request.queryString);

  response.setStatusLine(request.httpVersion, 200, "OK");

  let isDownloadPage = false;
  let isDownloadFile = false;

  query.forEach((value, name) => {
    if (name === "downloadPage") {
      isDownloadPage = true;
    } else if (name === "downloadFile") {
      isDownloadFile = true;
    } else if (name ==  "coop") {
      response.setHeader("Cross-Origin-Opener-Policy", unescape(value), false);
    } else if (name == "coep") {
      response.setHeader("Cross-Origin-Embedder-Policy", unescape(value), false);
    }
  });

  let downloadHTML = "";
  if (isDownloadPage) {
    [
     "no-coop", "same-origin", "same-origin-allow-popups",
    ].forEach(coop => {
      downloadHTML +=
        '<a href="https://example.com/browser/toolkit/components/remotebrowserutils/tests/browser/coop_header.sjs?downloadFile&' +
        (coop === "no-coop" ? "" : coop) + '" id="' + coop + '" download>' + unescape(coop) +  '</a> <br>';
    });
  }

  if (isDownloadFile) {
    response.setHeader("Content-Type", "application/octet-stream", false);
    response.write("BINARY_DATA");
  } else {
    response.setHeader("Content-Type", "text/html; charset=utf-8", false);
    response.write("<!DOCTYPE html><html><body><p>Hello world</p> " + downloadHTML + "</body></html>");
  }
}
