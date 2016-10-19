// this content-script plays role of medium to publish/subscribe messages from webpage to the background script

// this object is used to make sure our extension isn't conflicted with irrelevant messages!
var rtcmulticonnectionMessages = {
    'are-you-there': true,
    'get-sourceId':  true,
    'extension-loaded':true,
    'cancle-destopcapture':true
};

// this port connects with background script
var port = chrome.runtime.connect();

// if background script sent a message
port.onMessage.addListener(function (message) {
    // get message from background script and forward to the webpage

    window.postMessage(message, '*');
});

// this event handler watches for messages sent from the webpage
// it receives those messages and forwards to background script
window.addEventListener('message', function (event) {
    // if invalid source
    console.log("receve webpage req>> "+ event.data);
    //if (event.source != Window)
    //    return;
        
     //it is 3rd party message
     if(!rtcmulticonnectionMessages[event.data]) return;
        
    // if browser is asking whether extension is available
    if(event.data == 'are-you-there') {
        return window.postMessage('rtcmulticonnection-extension-loaded', '*');
    }

    // if it is something that need to be shared with background script
    else if(event.data == 'get-sourceId' ) {
        // forward message to background script 
        port.postMessage(event.data);
    }

    else if (event.data == 'extension-loaded') {
        window.postMessage({enabledScreenCapturing: true}, '*');
    }

    else if (event.data == 'cancle-destopcapture') {
        port.postMessage(event.data);
    }
});

// inform browser that you're available!
//window.postMessage('rtcmulticonnection-extension-loaded', '*');
