class IngamePanelCustomPanel extends TemplateElement {
    constructor() {
        super(...arguments);

        this.panelActive = false;
        this.started = false;
        this.ingameUi = null;
        this.busy = false;
        this.debugEnabled = false;

        if (this.debugEnabled) {
            var self = this;
            setTimeout(() => {
                self.isDebugEnabled();
            }, 1000);
        } else {
            this.initialize();
        }
    }
    isDebugEnabled() {
        var self = this;
        if (typeof g_modDebugMgr != "undefined") {
            g_modDebugMgr.AddConsole(null);
            g_modDebugMgr.AddDebugButton("Identifier", function() {
                console.log('Identifier');
                console.log(self.instrumentIdentifier);
            });
            g_modDebugMgr.AddDebugButton("TemplateID", function() {
                console.log('TemplateID');
                console.log(self.templateID);
            });
            g_modDebugMgr.AddDebugButton("Source", function() {
                console.log('Source');
                console.log(window.document.documentElement.outerHTML);
            });
			g_modDebugMgr.AddDebugButton("close", function() {
				console.log('close');
				if (self.ingameUi) {
					console.log('ingameUi');
					self.ingameUi.closePanel();
				}
			});
            this.initialize();
        } else {
            Include.addScript("/JS/debug.js", function () {
                if (typeof g_modDebugMgr != "undefined") {
                    g_modDebugMgr.AddConsole(null);
                    g_modDebugMgr.AddDebugButton("Identifier", function() {
                        console.log('Identifier');
                        console.log(self.instrumentIdentifier);
                    });
                    g_modDebugMgr.AddDebugButton("TemplateID", function() {
                        console.log('TemplateID');
                        console.log(self.templateID);
                    });
                    g_modDebugMgr.AddDebugButton("Source", function() {
                        console.log('Source');
                        console.log(window.document.documentElement.outerHTML);
                    });
                    g_modDebugMgr.AddDebugButton("close", function() {
                        console.log('close');
                        if (self.ingameUi) {
                            console.log('ingameUi');
                            self.ingameUi.closePanel();
                        }
                    });
                    self.initialize();
                } else {
                    setTimeout(() => {
                        self.isDebugEnabled();
                    }, 2000);
                }
            });
        }
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
            //    if (self.iframeElement) {
           //         self.iframeElement.src = 'https://www.ipify.org/';
           //     }
            });
            this.ingameUi.addEventListener("panelInactive", (e) => {
                console.log('panelInactive');
                self.panelActive = false;
                if (self.iframeElement) {
                    self.iframeElement.src = '';
                }
            });
            this.ingameUi.addEventListener("onResizeElement", () => {
                //self.updateImage();
            });
            this.ingameUi.addEventListener("dblclick", () => {
                if (self.m_Footer) {
                    self.m_Footer.classList.remove("hidden");
                }
			});
        }
    }
    initialize() {
        if (this.started) {
            return;
        }

        //var self = this;
        //this.m_MainDisplay = document.querySelector("#MainDisplay");
        //this.m_MainDisplay.classList.add("hidden");

        //this.m_Footer = document.querySelector("#Footer");
        //this.m_Footer.classList.add("hidden");

        //this.iframeElement = document.getElementById("CustomPanelIframe");
        //this.ingameUi = this.querySelector('ingame-ui');

        /*if (this.ingameUi) {
            this.ingameUi.addEventListener("panelActive", (e) => {
                console.log('panelActive');
                self.updateImage();
            });
            this.ingameUi.addEventListener("panelInactive", (e) => {
                console.log('panelInactive');
                self.iframeElement.src = '';
            });
            this.ingameUi.addEventListener("onResizeElement", () => {
                //self.updateImage();
            });
            this.ingameUi.addEventListener("dblclick", () => {
                if (self.m_Footer) {
                    self.m_Footer.classList.remove("hidden");
                }
            });
        }*/
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


//// simconnect

window.onmessage = function (e) {

    console.log(e.data)
    var request = e.data
    var response = {
      "read": [],
      "write": []
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
  