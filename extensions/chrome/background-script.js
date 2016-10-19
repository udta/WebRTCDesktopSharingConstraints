// this background script is used to invoke desktopCapture API
// to capture screen-MediaStream.

var session = ['screen', 'window'];
var desktopMediaRequestId = 0;
chrome.runtime.onConnect.addListener(function (port) {
    port.onMessage.addListener(portOnMessageHanlder);
     console.log('sourceId>>1');
    // this one is called for each message from "content-script.js"
    function portOnMessageHanlder(message) {
        console.log('sourceId>>11');
        if(message == 'get-sourceId') {
            desktopMediaRequestId = chrome.desktopCapture.chooseDesktopMedia(session, port.sender.tab, onAccessApproved);
        } else if (message == 'cancle-destopcapture') {
            if (desktopMediaRequestId) {
                chrome.desktopCapture.cancelChooseDesktopMedia(desktopMediaRequestId);
            }
        }
    }

    // on getting sourceId
    // "sourceId" will be empty if permission is denied.
    function onAccessApproved(sourceId) {
        console.log('sourceId>>' + sourceId);
        desktopMediaRequestId = 0;
        // if "cancel" button is clicked
        if(!sourceId || !sourceId.length) {
            return port.postMessage('PermissionDeniedError');
        }
        
        // "ok" button is clicked; share "sourceId" with the
        // content-script which will forward it to the webpage
        port.postMessage({
            sourceId: sourceId
        });
    }
});
