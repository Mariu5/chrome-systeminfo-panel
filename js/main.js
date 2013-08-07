var dbg = false;

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
		$('#mem #p').attr('data-cap', Math.round((info.availableCapacity / 1024)/ 1024)+'MB');
	});
}

chrome.alarms.onAlarm.addListener(function(alarm) {
	if(alarm.name == 'refresh') {
		memupdate();
	}
});

chrome.system.storage.getInfo(function(info) {
	if(dbg) console.log(info);
	for(disk in info) {
		var dskname = 'HDD';
		if(info[disk].name !== '') dskname = info[disk].name;
		$('body').append('<div id="'+info[disk].id+'" class="flex-block">'+
						 '<header><i class="icon-hdd"></i></header>'+
						 '<div><meter id="hdm" max="'+info[0].capacity+'" value="0" data-name="'+dskname+'" data-cap="0"></meter></div>'+
						 '</div>');
		var bounder = chrome.app.window.current().getBounds();
		var newheight =	bounder.height + 40;
		chrome.app.window.current().setBounds({'height': newheight});
//		chrome.system.storage.addAvailableCapacityWatch(info[disk].id, function(info) {
//			if(dbg) console.log(info);
//			$('#mhd').attr('value', (info.capacity - info.availableCapacity));
//		});
	}
});

chrome.system.storage.onAvailableCapacityChanged.addListener(function(info) {
	if(info.length) {
		for(disk in info) {
			$('#'+info[disk].id+' #hdm').attr('value',$('#'+info[disk].id+' #hdm').attr('max') - info[disk].availableCapacity);
			$('#'+info.id+' #hdm').attr('data-cap', Math.round((info[disk].availableCapacity / 1024)/ 1024)+'MB');
		}
	}
	else {
		$('#'+info.id+' #hdm').attr('value',$('#'+info.id+' #hdm').attr('max') - info.availableCapacity);
		$('#'+info.id+' #hdm').attr('data-cap', Math.round((info.availableCapacity / 1024)/ 1024)+'MB');
	}
});



$(document).ready(function() {
	memupdate();
});
