chrome.app.runtime.onLaunched.addListener(function() {
	chrome.app.window.create('html/widget.html', {
		'id': 'widgetwin',
		'frame': 'none',
        'type': 'panel',
		//'transparentBackground': true,
		'resizable': false,
		'singleton': true,
		'maxWidth': 220,
		'maxHeight': 160
	}, function (appwindow) {
		console.log('callback');
		//appwindow.moveTo(0,0);
		appwindow.onClosed.addListener(function() {
			console.log('close');
		});
	});
});

chrome.runtime.onSuspend.addListener(function() { 
  // Do some simple clean-up tasks.
});

chrome.alarms.create('refresh', {
    'when': Date.now(),
    'periodInMinutes': 1
});