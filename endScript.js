function extractPageFeeds() {
  var feeds = [];
  var headLinks = document.getElementsByTagName("head")[0].getElementsByTagName("link");

  for (var i=0; i < headLinks.length; i++) {
    var link = headLinks[i];

    if (link.attributes.getNamedItem("rel") !== null && link.attributes.getNamedItem("rel").value == "alternate") {
      var type = link.attributes.getNamedItem("type");

      if (type !== null) {
        var typeValue = type.value;
        if (typeValue === "application/rss+xml" || typeValue === "application/atom+xml" || typeValue === "text/xml") {
          var title = link.attributes.getNamedItem("title");
          title = title !== null ? title.value : "Feed";
          var href = link.attributes.getNamedItem("href").value;

          if (href) {
            feeds.push({url: fullURL(href), title: titleFromURL(href), type: typeFromString(typeValue)});
          }
        }
      }
    }
  }

  return feeds;
}

function protocol(url) {
  return url.split(":")[0];
}

function typeFromString(string) {
  if (string.indexOf("rss") != -1) {
    return "RSS";
  } else if (string.indexOf("atom") != -1) {
    return "Atom";
  } else {
    return "Unknown";
  }
}

function titleFromURL(url) {
  return toTitleCase(unescape(url.substring(url.lastIndexOf("/")+1).split(".")[0].replace(/[_-]+/g, " ")));
}

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

function getBaseURL() {
    var head = document.getElementsByTagName("head")[0];
    var baseLinks = head.getElementsByTagName("base");
    var baseURL;

    for (var i=0; i < baseLinks.length; i++) {
      var link = baseLinks[i];

      if (link.attributes.getNamedItem("href") !== null) {
        url = link.attributes.getNamedItem("href").value;

        if (url.charAt(url.length-1)!="/") {
          url+="/";
        }

        baseURL = url;
        break;
      }
    }

    if (baseURL === undefined) {
      baseURL = protocol(document.URL) + "://" + document.domain + "/"
    }

    return baseURL;
}

function openFeedInBrowser(url) {
  safari.self.tab.dispatchMessage("openLocal", url);
}

function fullURL(url) {
  var trimmedURL = url.trim();

  if (trimmedURL.substr(0,4) !== "http") {
    if (trimmedURL[0] == "/") {
      trimmedURL = trimmedURL.slice(1);
    }

    trimmedURL = getBaseURL() + trimmedURL;
  }

  return trimmedURL;
}
