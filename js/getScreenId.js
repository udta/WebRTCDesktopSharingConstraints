// Last time updated at Oct 24, 2015, 08:32:23

// Latest file can be found here: https://cdn.webrtc-experiment.com/getScreenId.js

// MIT License       - www.WebRTC-Experiment.com/licence
// Documentation     - https://github.com/muaz-khan/getScreenId.

// ______________
// getScreenId.js

/*
getScreenId(function (error, sourceId, screen_constraints) {
    // error    == null || 'permission-denied' || 'not-installed' || 'installed-disabled' || 'not-chrome'
    // sourceId == null || 'string' || 'firefox'
    
    if(sourceId == 'firefox') {
        navigator.mozGetUserMedia(screen_constraints, onSuccess, onFailure);
    }
    else navigator.webkitGetUserMedia(screen_constraints, onSuccess, onFailure);
});
*/

var APP_DOMAIN = "";
(function() {
    window.getScreenId = function(isWindow,callback) {
        // for Firefox:
        // sourceId == 'firefox'
        // screen_constraints = {...}
        var source = isWindow ? 'window' : 'screen';
        if (!!navigator.mozGetUserMedia) {
                var screen_constraints = {
                                audio: false,
                                video: {
                                        mozMediaSource: source,
                                        mediaSource: source,
                                        frameRate: {min: 1, max: 5},
                                      }
                              };
            callback(null, 'firefox', screen_constraints);
            return;
        }

        if ( (adapter.browserDetails.browser == "ie" || adapter.browserDetails.browser == "safari" ) && adapter.browserDetails.isWebRTCPluginInstalled == true) {
            // For IE / Safari which is installed webrtc-everywhere
            if ( source === 'screen' ) {
                 var screen_constraints = {
                                    audio: false,
                                    video: {optional: [{sourceId: "X978GrandstreamScreenCapturer785"}],
                                            mandatory: {
                                                       //minAspectRatio: 1.40,
                                                       //maxAspectRatio: 1.78,
                                                       minFrameRate: 1,
                                                       maxFrameRate: 5
                                                       //minWidth: 1280,
                                                       //minHeight: 720
                                                   }
                                    }
                                  };
            } else {
                 //var windowList = window.loadWindows();

                 var windowId = window.selectedWindowId;
                 //var imgBase64 = windowSelect.options[windowSelect.selectedIndex].previewImg64;
                 //previewImg.src = "data:image/x-icon;base64," + imgBase64;
                 //imgBase64 = null;
                 var screen_constraints = {
                                audio: false,
                                video: { optional: [{sourceId: "X978GrandstreamScreenCapturer785", windowId: windowId}],
                                        mandatory: {
                                                       //minAspectRatio: 1.40,
                                                       //maxAspectRatio: 1.78,
                                                       minFrameRate: 1,
                                                       maxFrameRate: 5
                                                       //minWidth: 1280,
                                                       //minHeight: 720
                                                   }
                                }
                              };
            }

            callback(null, 'IE', screen_constraints);
            return;
        }

        
        function onIFrameCallback(event) {
        
            if (!event.data) return;
            if (event.data=='get-sourceId') return;
            var chromeMediaSourceId = event.data;
            if (chromeMediaSourceId) {
                if (chromeMediaSourceId== 'PermissionDeniedError') {
 //                   return;
                    callback('ShareCancel',null,null);
                } else callback(chromeMediaSourceId, chromeMediaSourceId.sourceId, getScreenConstraints(isWindow, chromeMediaSourceId.sourceId));
            }

            if (event.data.chromeExtensionStatus) {
                callback(event.data.chromeExtensionStatus, null, getScreenConstraints(event.data.chromeExtensionStatus));
            }

            // this event listener is no more needed
            iframe.contentWindow.removeEventListener('message', onIFrameCallback);
        }
        
        if (iframe && iframe.length > 0){
            $(iframe).remove();
        } else
        {
            iframe = document.createElement('iframe');
            iframe.onload = function() {
            iframe.isLoaded = true;

            iframe.contentWindow.addEventListener('message', onIFrameCallback);
            iframe.contentWindow.postMessage('get-sourceId', '*');
        };
        iframe.src = APP_DOMAIN +'/index.html';
        iframe.style.display = 'none';
        (document.body || document.documentElement).appendChild(iframe);
        }

    };

    window.cancelChooseDesktopMedia = function(){
        if (iframe && iframe.length > 0){
            $(iframe).remove();
        } else
        {
            iframe = document.createElement('iframe');
            iframe.onload = function() {
            iframe.isLoaded = true;
            iframe.contentWindow.postMessage('cancle-destopcapture', '*');
        };
        iframe.src = APP_DOMAIN +'/index.html';
        iframe.style.display = 'none';
        (document.body || document.documentElement).appendChild(iframe);
        }
    };
    function getScreenConstraints(error, sourceId) {
        var screen_constraints = {
            audio: false,
            video: {
                mandatory: {
                    chromeMediaSource: error ? 'screen' : 'desktop',
                    maxWidth: window.screen.width > 1920 ? window.screen.width : 1920,
                    maxHeight: window.screen.height > 1080 ? window.screen.height : 1080,
                    minFrameRate: 1,
                    maxFrameRate: 5
                },
                optional: []
            }
        };

        if (sourceId) {
            screen_constraints.video.mandatory.chromeMediaSourceId = sourceId;
        }

        return screen_constraints;
    }

    function postMessage() {
    }

    function loadIFrame(loadCallback) {
        if (iframe) {
            loadCallback();
            return;
        }
        iframe = document.createElement('iframe'); 
        iframe.onload = function() {
            iframe.isLoaded = true;

            loadCallback();
        };
        iframe.src = APP_DOMAIN +'/index.html';
        iframe.style.display = 'none';
        (document.body || document.documentElement).appendChild(iframe); 
    }

    var iframe;

    // this function is used in v3.0
    window.getScreenConstraints = function(callback) {
        loadIFrame(function() {
            getScreenId(false, function(error, sourceId, screen_constraints) {
                callback(error, screen_constraints.video);
            });
        });
    };
})();

