(()=>{"use strict";if(!window.sportpriority){window.sportpriority=new function(){var t=this;this.isApp=true,this.widgetHost="http://localhost:3000",this.widgets=[],this.createWidget=function(e){var i,a,r,o;if(e.attributes.getNamedItem("data-from-app")){t.isApp=!0,o="0cc480b993a1452f962d9652838c8113";var d=null===(i=e.attributes.getNamedItem("data-club-id"))||void 0===i?void 0:i.value;r="".concat(t.widgetHost,"?w=").concat(o,"&clubId=").concat(d)}else o=null===(a=e.attributes.getNamedItem("data-sportpriority-widget-id"))||void 0===a?void 0:a.value,r="".concat(t.widgetHost,"?w=").concat(o);var n=document.createElement("iframe");return n.src=r,n.style.width="100%",n.style.height="100%",n.style.border="0",n.style.display="block",e.appendChild(n),window.addEventListener("message",(function(t){if("widget-modal-open"===t.data.action){var e=document.getElementsByTagName("iframe")[0],i=t.data.route;e.src=i,console.log(i)}})),{id:o,iframe:n}},this.init=function(){var e=document.querySelectorAll("[data-sportpriority-widget-id]");Array.prototype.forEach.call(e,(function(e){var i=e.attributes.getNamedItem("data-sportpriority-widget-id").value,a=t.widgets.find((function(t){return t.id===i}));if(a){if(!document.body.contains(a.iframe)){var r=t.createWidget(e);Object.keys(r).forEach((function(t){a[t]=r[t]}))}}else{var o=t.createWidget(e);t.widgets.push(o)}}))}}}window.sportpriority.init()})();