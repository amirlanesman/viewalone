// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });

const tabCache = {}
const reloadTransitionTypes = ['link', 'typed', 'auto_bookmark', 'manual_subframe', 'generated', 'start_page', 'form_submit', 'reload', 'keyword', 'keyword_generated']
const videoExtensions = ['m3u8', 'mp4']

const getExtension = (url) => { return url.split('?').shift().split('#').shift().split('.').pop() }

chrome.extension.onMessage.addListener(
  function (request, sender, sendResponse) {
    console.log('got request:', { request, sender })
    if (request.getObjectsTab !== undefined) {
      console.log('sending response:', tabCache[request.getObjectsTab], request.getObjectsTab, tabCache)
      sendResponse(tabCache[request.getObjectsTab]);
    }
  });

chrome.webRequest.onResponseStarted.addListener(function (details) {
  if (videoExtensions.includes(getExtension(details.url))) {
    if (!tabCache[details.tabId]) {
      tabCache[details.tabId] = []
    }
    console.log(`pushing url '${details.url}' to tab ${details.tabId}`)
    tabCache[details.tabId].push(details.url)
    chrome.browserAction.setIcon({ path: "/icons/icon19.png", tabId: details.tabId });
    chrome.browserAction.setBadgeText({ text: '' + tabCache[details.tabId].length, tabId: details.tabId })
    chrome.runtime.sendMessage({ addNewObject: { tabId: details.tabId, url: details.url } })
  }
}, {
    urls: ["<all_urls>"]
  });


chrome.webNavigation.onCommitted.addListener(function (details) {
  if (!reloadTransitionTypes.includes(details.transitionType)) {
    return;
  }
  if (details.tabId) {
    console.log(`resetting tab ${details.tabId}`)
    delete tabCache[details.tabId]
    chrome.browserAction.setIcon({ path: "/icons/icon19-gray.png", tabId: details.tabId });
    chrome.browserAction.setBadgeText({ text: '', tabId: details.tabId })
  }
}, {
    urls: ['<all_urls>']
  });

chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    if (videoExtensions.includes(getExtension(details.url)) && details.type == "main_frame") {
      const playerUrl = chrome.extension.getURL('src/player/player.html') + "#" + details.url
      return { redirectUrl: playerUrl }
    }
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);

chrome.tabs.onRemoved.addListener(function (tabId) {
  console.log(`resetting tab ${tabId}`)
  delete tabCache[tabId]
})

// chrome.tabs.onActivated.addListener(function (details) {
//   activeTabs[details.windowId] = details.tabId
//   console.log({ activeTabs })
// })
// setInterval(() => console.log(tabCache), 5000)

console.log('done loading!')