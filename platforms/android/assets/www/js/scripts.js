/* this is new code */
/* kalman gueta is fuking a goat */
var windowPayment = null;
function windowPayment_loadStartHandler(event) {
 if(event.url.indexOf('m.ilotto') > -1){
    setTimeout(function(){
        windowPayment.close();
    }, 5000);
 }
}