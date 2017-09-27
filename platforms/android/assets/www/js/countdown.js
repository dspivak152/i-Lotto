function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
function calcage(secs, num1, num2) {
    s = ((Math.floor(secs / num1)) % num2).toString();
    if (LeadingZero && s.length < 2)
        s = "0" + s;
    return s;
}
function CountBack(secs) {
    var _days = $('.clock-container .dd');
    var _hours = $('.clock-container .hh');
    var _minutes = $('.clock-container .mm');
    _days.html(calcage(secs, 86400, 100000, LeadingZero));
    _hours.html(calcage(secs, 3600, 24, LeadingZero));
    _minutes.html(calcage(secs, 60, 60, LeadingZero));
    if (CountActive)
        setTimeout("CountBack(" + (secs + CountStepper) + ")", SetTimeOutPeriod);
}

var TargetDate = $('input[name="date"]').val();

if (typeof (TargetDate) == "undefined")
    TargetDate = "12/12/2016 10:55 PM";

if (typeof (CountActive) == "undefined")
    CountActive = true;
if (typeof (FinishMessage) == "undefined")
    FinishMessage = "בהצלחה!!!";
if (typeof (CountStepper) != "number")
    CountStepper = -1;
if (typeof (LeadingZero) == "undefined")
    LeadingZero = true;

CountStepper = Math.ceil(CountStepper);
if (CountStepper == 0)
    CountActive = false;
var SetTimeOutPeriod = (Math.abs(CountStepper) - 1) * 1000 + 990;

var dthen = new Date(TargetDate);
var dnow = new Date();
if (CountStepper > 0)
    ddiff = new Date(dnow - dthen);
else
    ddiff = new Date(dthen - dnow);
gsecs = Math.floor(ddiff.valueOf() / 1000);
CountBack(gsecs);
