var windowPayment = null;
var state = null;
function windowPayment_loadStartHandler(event) {
 if(event.url.indexOf('m.ilotto') > -1){
    state.go("Home");
    setTimeout(function(){
        windowPayment.close();
    }, 5000);
 }
}