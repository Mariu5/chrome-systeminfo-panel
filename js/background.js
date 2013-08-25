chrome.browserAction.onClicked.addListener(function() {
	chrome.windows.create({
		'url': '/html/widget.html',
		'width': 220,
		'height': 200,
		'type': 'panel'
	});
});


chrome.alarms.create('refresh', {
    'when': Date.now(),
    'periodInMinutes': 1
});