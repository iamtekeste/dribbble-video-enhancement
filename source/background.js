(function() {
  var networkFilters = {
    urls: [
      'https://*.dribbble.com/*',
      'https://cdn.dribbble.com/users/*/videos/*'
    ]
    // types: ['image', 'object', 'media']
  };

  chrome.webRequest.onCompleted.addListener(function(details) {
    chrome.tabs.query(
      {
        active: true,
        currentWindow: true
      },
      function(tabs) {
        if (tabs[0]) {
          chrome.tabs.sendMessage(tabs[0].id, {
            action: 'dve_ajax_finished'
          });
        }
      }
    );
    return Promise.resolve('Dummy response to keep the console quiet');
  }, networkFilters);

  var responseListener = function(details) {
    var flag = false,
      rule = {
        name: 'Access-Control-Allow-Origin',
        value: '*'
      };

    for (var i = 0; i < details.responseHeaders.length; ++i) {
      if (
        details.responseHeaders[i].name.toLowerCase() ===
        rule.name.toLowerCase()
      ) {
        flag = true;
        details.responseHeaders[i].value = rule.value;
        break;
      }
    }
    if (!flag) details.responseHeaders.push(rule);
    return { responseHeaders: details.responseHeaders };
  };

  chrome.webRequest.onHeadersReceived.addListener(
    responseListener,
    networkFilters,
    ['blocking', 'responseHeaders']
  );

  chrome.webRequest.onBeforeRequest.addListener(
    ({ tabId, requestId, url, requestBody }) => {
      if (
        tabId &&
        (url.indexOf('video') > -1 && url.indexOf('dve_modified') < 0) // if we didn't already modified it by adding `dve_modified`
      ) {
        chrome.tabs.sendMessage(tabId, {
          action: 'updateVideoSrc'
        });
      }
    },
    networkFilters
  );
})();
