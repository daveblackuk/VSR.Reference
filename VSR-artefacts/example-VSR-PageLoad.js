// ensure main page is loaded in iframe from server before running this script - 
// "http://localhost:1228"    // this is the VSR server main page

// check window.globalVars.vrMode to determine if in VR
console.log("vrMode:",window.globalVars.vrMode)

// this script ignores the zoom settings from the users config
// set zoom Level to 2.5 if in VR and 1 if not

var VRZoomLevel = 2.5
// var VRZoomLevel = configSettings.VRZoom // if you have got the user configSettings
var zoomLevel = 1               
// zoomLevel = configSettings.defaultZoom  // if you have got the user configSettings


if (window.globalVars.vrMode) {
  var zoomLevel = VRZoomLevel  
}


var response = {}                         // initialise response 
var iframeID = "CustomPanelIframe"        // change to name of your iframe

response.vrMode = []

response.vrMode.push({
      "vrMode": window.globalVars.vrMode,
      "zoomLevel": zoomLevel,             //  zoom level to iframe page
})

var iframe = document.getElementById(iframeID);   // identify iframe
iframe.contentWindow.postMessage(response, '*');  // send iframe the zoom parameters 
// this message is sent to a zoom function in main page javascript
