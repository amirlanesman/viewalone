const MAX_NAME_LENGTH = 60;

function getName(url) {
	url = url.split('#').shift().split('?').shift().split('/').pop()
	if (url.length < 60) {
		return url
	} else {
		return '...' + url.slice(-MAX_NAME_LENGTH)
	}
}

function addUrlToStreams(url, div) {
	const urlRow = document.createElement('tr');
	urlRow.className = "url-row"
	const nameCol = document.createElement('td')
	nameCol.className = 'url-name-col'
	nameCol.innerText = getName(url)
	nameCol.setAttribute('nowrap', true)
	nameCol.setAttribute('title', url)
	const actionCol = document.createElement('td')
	actionCol.className = 'url-action-col'
	const actionNode = document.createElement('a')
	actionNode.className = 'url-action'
	actionNode.setAttribute('href', url)
	actionNode.setAttribute('target', '_blank')
	const actionComponent = document.createElement('div')
	actionComponent.className = 'url-action-component'
	actionComponent.innerText = 'Watch'
	actionNode.appendChild(actionComponent)
	actionCol.appendChild(actionNode)
	urlRow.appendChild(nameCol)
	urlRow.appendChild(actionCol)
	div.appendChild(urlRow)
}

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
	var currTab = tabs[0];
	if (currTab) { // Sanity check
		chrome.runtime.sendMessage({ getObjectsTab: currTab.id }, function (response) {
			if (response) {
				response.forEach(url => {
					addUrlToStreams(url, document.getElementById('streams'))
				})
			}
		});
	}
});

chrome.extension.onMessage.addListener(
	function (request, sender) {
		console.log('got request:', { request, sender })

		chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
			var currTab = tabs[0];
			if (currTab) { // Sanity check
				if (request.addNewObject && request.addNewObject.tabId === currTab.id) {
					addUrlToStreams(request.addNewObject.url, document.getElementById('streams'))
				}
			}
		})
  });

