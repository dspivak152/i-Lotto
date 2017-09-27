IlottoApp.factory('ProductService', ['$http', '$rootScope', function ($http, $rootScope) {
    var productForm;

    function getProductForm() {
        return productForm;
    };
    function setProductForm(data) {
        productForm = data;
    };
    var setAction = function (action, params) {
        var _Url = $rootScope.baseUrl + 'Product' + '/' + action;
        if (params && typeof params === 'object') {
            for (var i in params) {
                _Url += (_Url.indexOf('?') < 0 ? '?' : '&') + i + '=' + params[i];
            }
        }
        return _Url
    }
    return {
        GetProduct: function (Data) {
            Data = { ProdId: Data };
            return $http.get(setAction('GetProduct', Data), "json", "application/json; charset=utf-8");
        },
        CalculatFormCost: function (Data) {
            return $http.post(setAction('CalculatFormCost'), JSON.stringify(Data), "json", "application/json; charset=utf-8");
        },
        GetCart: function () {
            return $http.get(setAction('GetCart'), "json", "application/json; charset=utf-8");
        },
        GetMessagesModel: function (Data) {
            return $http.post(setAction('GetMessagesModel'), JSON.stringify(Data), "json", "application/json; charset=utf-8");
        },
        TranslationSingle: function (Data) {
            return $http.post(setAction('TranslationSingle'), JSON.stringify(Data), "json", "application/json; charset=utf-8");
        },
        ModelMessages: function (Data) {
            Data = { ModelPath: Data };
            return $http.post(setAction('ModelMessages', Data), "json", "application/json; charset=utf-8");
        },
        GetFormSettingsModel: function () {
            return $http.get(setAction('GetFormSettingsModel'), "json", "application/json; charset=utf-8");
        },
        SaveForm: function (Data) {
            return $http.post(setAction('SaveForm'), JSON.stringify(Data), "json", "application/json; charset=utf-8");
        },
        GetNumberOfRaffles: function () {
            return $http.get(setAction('GetNumberOfRaffles'), "json", "application/json; charset=utf-8");
        },
        SaveFormName: function (Data) {
            return $http.post(setAction('SaveFormName'), JSON.stringify(Data), "json", "application/json; charset=utf-8");
        },
        SaveDeposit: function (Data) {
            return $http.post(setAction('SaveDeposit'), JSON.stringify(Data), "json", "application/json; charset=utf-8");
        },
        GetNextRaffle: function (Data) {
            return $http.get(setAction('GetNextRaffle'), "json", "application/json; charset=utf-8");
        },
        RequesRuffles: function () {
            return $http.get(setAction('RequesRuffles'), "json", "application/json; charset=utf-8");
        },
        WebServicePay: function (Data) {
            return $http.post(setAction('WebServicePay'), JSON.stringify(Data), "json", "application/json; charset=utf-8");
        },
        DepositUsingWebService: function (Data, amount) {
            return $http.post(setAction('DepositUsingWebService'), JSON.stringify(Data), "json", "application/json; charset=utf-8");
        },
        PostSaveAndRedirect: function (Data) {
            Data = { id: Data };
            return $http.get(setAction('GetProduct', Data), "json", "application/json; charset=utf-8");
        },
        GetRafflePopup: function () {
            return $http.get(setAction('RafflePopup'), "json", "application/json; charset=utf-8");
        },
        getProductForm: getProductForm,
        setProductForm: setProductForm
    }
}]);