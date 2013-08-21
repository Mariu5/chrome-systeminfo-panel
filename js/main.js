var dbg = true;

chrome.contextMenus.removeAll(function() {
    chrome.contextMenus.create({
        type: 'normal',
        title: 'Close App',
        id: 'close',
        contexts: ['all']
    });
});

chrome.contextMenus.onClicked.addListener(function(info) {
    if (!document.hasFocus()) {
        return;
    }
    
    switch(info.menuItemId) {
            case 'close':
                chrome.app.window.current().close();
                break;
    };
});


chrome.system.cpu.getInfo(function(info) {
	$('#cpu #arch').append('<span>'+info.archName+'</span>');
	$('#cpu #model').append(info.modelName);
	$('#cpu #cores').append('<span>'+info.numOfProcessors+'</span>');
});



function memupdate() {
	chrome.system.memory.getInfo(function(info) {
		$('#mem #p').attr('max', info.capacity);
		$('#mem #p').attr('value', info.capacity - info.availableCapacity );
		$('#mem #p').attr('data-cap', Math.round(info.availableCapacity / Math.pow(1024, 2))+' MB');
	});
}

chrome.alarms.onAlarm.addListener(function(alarm) {
	if(alarm.name == 'refresh') {
		memupdate();
	}
});

chrome.system.storage.getInfo(function(info) {
	if(dbg) console.log(info);
	var counter = 0;
	for(disk in info) {
		var dskname = 'HDD';
		if(info[disk].name !== '') dskname = info[disk].name;
		$('body').append('<div id="'+info[disk].id+'" class="flex-block">'+
						 '<header><i class="icon-hdd"></i></header>'+
						 '<div><meter id="hdm" max="100" value="100" data-name="'+dskname+'" data-cap="'+Math.round(info[disk].capacity / Math.pow(1024, 3))+' GB'+'"></meter></div>'+
						 '</div>');
		counter++;
	}
	var bounder = chrome.app.window.current().getBounds();
	var newheight =	bounder.height + (counter * 40);
	chrome.app.window.current().setBounds({'height': newheight});
});

$(document).ready(function() {
	memupdate();
});
