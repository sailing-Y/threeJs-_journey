var b=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},w={},E={get exports(){return w},set exports(g){w=g}};(function(g,P){(function(s,a){g.exports=a()})(b,function(){var s=function(){function a(n){return i.appendChild(n.dom),n}function f(n){for(var l=0;l<i.children.length;l++)i.children[l].style.display=l===n?"block":"none";c=n}var c=0,i=document.createElement("div");i.style.cssText="position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000",i.addEventListener("click",function(n){n.preventDefault(),f(++c%i.children.length)},!1);var r=(performance||Date).now(),o=r,e=0,h=a(new s.Panel("FPS","#0ff","#002")),x=a(new s.Panel("MS","#0f0","#020"));if(self.performance&&self.performance.memory)var v=a(new s.Panel("MB","#f08","#201"));return f(0),{REVISION:16,dom:i,addPanel:a,showPanel:f,begin:function(){r=(performance||Date).now()},end:function(){e++;var n=(performance||Date).now();if(x.update(n-r,200),n>o+1e3&&(h.update(1e3*e/(n-o),100),o=n,e=0,v)){var l=performance.memory;v.update(l.usedJSHeapSize/1048576,l.jsHeapSizeLimit/1048576)}return n},update:function(){r=this.end()},domElement:i,setMode:f}};return s.Panel=function(a,f,c){var i=1/0,r=0,o=Math.round,e=o(window.devicePixelRatio||1),h=80*e,x=48*e,v=3*e,n=2*e,l=3*e,d=15*e,p=74*e,u=30*e,m=document.createElement("canvas");m.width=h,m.height=x,m.style.cssText="width:80px;height:48px";var t=m.getContext("2d");return t.font="bold "+9*e+"px Helvetica,Arial,sans-serif",t.textBaseline="top",t.fillStyle=c,t.fillRect(0,0,h,x),t.fillStyle=f,t.fillText(a,v,n),t.fillRect(l,d,p,u),t.fillStyle=c,t.globalAlpha=.9,t.fillRect(l,d,p,u),{dom:m,update:function(y,S){i=Math.min(i,y),r=Math.max(r,y),t.fillStyle=c,t.globalAlpha=1,t.fillRect(0,0,h,d),t.fillStyle=f,t.fillText(o(y)+" "+a+" ("+o(i)+"-"+o(r)+")",v,n),t.drawImage(m,l+e,d,p-e,u,l,d,p-e,u),t.fillRect(l+p-e,d,e,u),t.fillStyle=c,t.globalAlpha=.9,t.fillRect(l+p-e,d,e,o((1-y/S)*u))}}},s})})(E);const R=w;export{R as S};