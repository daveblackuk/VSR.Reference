ver = "0.8.1.108 "
console.log(ver)

String.prototype.format = function() {
    var formatted = this;
    for( var arg in arguments ) {
        formatted = formatted.replace("{" + arg + "}", arguments[arg]);
    }
    return formatted;
  };


class IngamePanelCustomPanel extends TemplateElement {
    constructor() {
        super(...arguments);

        this.panelActive = false;
        this.started = false;
        this.ingameUi = null;
        this.busy = false;
        this.debugEnabled = false;
        this.initialize();
        

    }

 
    connectedCallback() {
        super.connectedCallback();

        var self = this;
        this.ingameUi = this.querySelector('ingame-ui');

        this.iframeElement = document.getElementById("CustomPanelIframe");

        this.m_MainDisplay = document.querySelector("#MainDisplay");
        this.m_MainDisplay.classList.add("hidden");

        this.m_Footer = document.querySelector("#Footer");
        this.m_Footer.classList.add("hidden");

        if (this.ingameUi) {
            this.ingameUi.addEventListener("panelActive", (e) => {
                console.log('panelActive');
                self.panelActive = true;
           });
            this.ingameUi.addEventListener("panelInactive", (e) => {
                console.log('panelInactive');
                self.panelActive = false;
                if (self.iframeElement) {
                    self.iframeElement.src = '';
                }
            });

        }
    }

    initialize() {
        console.log("initialised")
        if (this.started) {
            return;
        }

   
        this.started = true;
    }
    disconnectedCallback() {
        super.disconnectedCallback();
    }
    updateImage() {

    }
}


window.customElements.define("ingamepanel-custom", IngamePanelCustomPanel);
checkAutoload();


 
function transformWindow(transformLevel) {

    console.log("VRMode",window.globalVars.vrMode)
  
    if (window.globalVars.vrMode == true) {
        zoomLevel = configSettings.VRZoom
        console.log("VR Mode",configSettings.VRZoom)
    } else {
        zoomLevel = configSettings.defaultZoom
        console.log("Non VR Mode",configSettings.defaultZoom)
    }
  
    if (transformLevel) {
      zoomLevel = transformLevel
    }
  
    scale = "translate({0},{1})".format(zoomLevel,zoomLevel)
    document.body.style.transform = scale; 
    console.log(scale)
  
  
  }


  window.onmessage = function (e) {
  
  
    var request = e.data
    var response = {
      "read": [],
      "write": []
    }
  
  
  
    if (request.configSettings) {
        configSettings = request.configSettings 
     }
  
     if (request.zoom) {
  
        transformWindow(request.zoom[0].level)
      
     }
  
     if (request.firstRun) {
      console.log("firstRun",request.firstRun)
      transformWindow()
      response.vrMode = []
      response.vrMode.push({
        "vrMode":window.globalVars.vrMode,
        "zoomLevel":zoomLevel,
      })
     }
  
    if (request.read) {
      request.read.forEach(element => {
        let simvar = SimVar.GetSimVarValue(element.name, element.unit)
        console.log(simvar)
        response.read.push({
          "name": element.name,
          "unit": element.unit,
          "value": simvar
        })
      });
    }
    if (request.write) {
      request.write.forEach(element => {
        SimVar.SetSimVarValue(element.name, element.unit, element.value)
        response.write.push({
          "name": element.name,
          "unit": element.unit,
        })
      });
    }
    var iframe = document.getElementById("CustomPanelIframe");
    iframe.contentWindow.postMessage(response, '*');
  };
  
  window.addEventListener("keydown", (e) => {

    // Shift + Ctrl + S toggle panel visibility
    if (e.shiftKey && e.ctrlKey &&  String.fromCharCode(e.which) == configSettings.vizKey) {
          toggleVisibility()
        }
    }
  )
  
  function toggleVisibility() {

    var cP = document.getElementById('CustomPanel')
    cP.classList.toggle('panelInvisible'); // toggle the panelInvisible class
  }
  

  zoomLevel = 1