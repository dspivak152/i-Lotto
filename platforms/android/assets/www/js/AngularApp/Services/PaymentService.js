IlottoApp.factory('PaymentService', ['$http', '$rootScope', function ($http, $rootScope) {
    var setAction = function (action, params) {
        var _Url = $rootScope.baseUrl + 'Payment' + '/' + action;
        if (params && typeof params === 'object') {
            for (var i in params) {
                _Url += (_Url.indexOf('?') < 0 ? '?' : '&') + i + '=' + params[i];
            }
        }
        return _Url
    }
    var addFormFields = function (form, data) {
        if (data != null) {
            $.each(data, function (name, value) {
                if (value != null) {
                    var input = $("<input></input>").attr("type", "hidden").attr("name", name).val(value);
                    form.append(input);
                }
            });
        }
    }
    
    
    return {
        Post: function (Data) {
            return $http.post(setAction(''), JSON.stringify(Data), "json", "application/json; charset=utf-8");
        },
        Get: function (Data) {
            return $http.get(setAction('', Data), "json", "application/json; charset=utf-8");
        },
        PayPal: function (Data) {
            
            var form = $('<form id="paypal"/></form>');
            form.attr("action", "https://www.paypal.com/cgi-bin/webscr");
            form.attr("method", "POST");
            form.attr("style", "display:none;");

            form = addFormFields(form, Data);

            return form;
        },
        form: function () {
            return '<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="paypal">\
                        <input type="hidden" name="cmd" value="_cart">\
                        <input type="hidden" name="add" value="1">\
                        <input type="hidden" name="business" value="gal.rave-facilitator@sergata.net">\
                        <input type="hidden" name="item_name" value="My Cart Item 1">\
                        <input type="hidden" name="amount" value="10.00">\
                        <input type="hidden" name="shopping_url" value="http://www.yourwebsite.com/shoppingpage.html">\
                        <input type="hidden" name="return" value="http://www.yourwebsite.com/success.html">\
                        <input type="hidden" name="cancel_return" value="http://www.yourwebsite.com/cancel.html">\
                        <input type="hidden" name="bn" value="PP-ShopCartBF:x-click-but22.gif:NonHosted">\
                        <input type="image" src="https://www.paypal.com/en_US/i/btn/x-click-but22.gif" border="0" name="submit" alt="Make payments with PayPal - it`s fast, free and secure!">\
                        <img alt="" border="0" src="https://www.paypal.com/en_US/i/scr/pixel.gif" width="1" height="1">\
                    </form>'
        }
    }
}]);



var PayPalFormModel = function(){
    return {
        Sandbox_account: 'gal.rave-facilitator@sergata.net',
        Sandbox_endpoint: 'api.sandbox.paypal.com',
        Client_ID: 'Aamu3nq9H7iSXXG2w9wg25E6R1Bf9FGW27GCPUPqS1ErWgstAEAnHPqbvnEmp5JzFbc4gnR_8ibN9sY-',
        Secret: 'EIlNya2NlY5Tqh9Qn7gPVSsclVqcxVwK6D65UPk_1JmJDgim4zNPA8F2YrgYRtVylV91-qTjybA_ZRaV'
    }
}

//<form id="paypal" action="https://www.paypal.com/cgi-bin/webscr" method="POST" style="display:none;">
//    <input type="hidden" name="cmd" value="_cart">
//    <input type="hidden" name="business" value="bernardo.castilho-facilitator@gmail.com">
//    <input type="hidden" name="upload" value="1">
//    <input type="hidden" name="rm" value="2">
//    <input type="hidden" name="charset" value="utf-8">
//    <input type="hidden" name="item_number_1" value="APL">
//    <input type="hidden" name="item_name_1" value="Apple">
//    <input type="hidden" name="quantity_1" value="1">
//    <input type="hidden" name="amount_1" value="12.00">
//    <input type="hidden" name="item_number_2" value="AVC">
//    <input type="hidden" name="item_name_2" value="Avocado">
//    <input type="hidden" name="quantity_2" value="1">
//    <input type="hidden" name="amount_2" value="16.00">
//    <input type="hidden" name="item_number_3" value="BAN">
//    <input type="hidden" name="item_name_3" value="Banana">
//    <input type="hidden" name="quantity_3" value="1">
//    <input type="hidden" name="amount_3" value="4.00">
//</form>