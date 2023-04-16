
// add the following to main script to retrieve the user config settings
// these are sent from the main page once loaded into the iframe
// if you are running windows executable config settings are in registry
// HKEY_CURRENT_USER\SOFTWARE\DeltaBravoZulu\VSR

window.onmessage = function (e) {
  
  
    var request = e.data
    if (request.configSettings) {
        configSettings = request.configSettings 
     }

}