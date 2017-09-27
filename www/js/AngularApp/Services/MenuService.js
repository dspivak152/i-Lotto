IlottoApp.factory('MenuService', ['$http', '$rootScope', function ($http, $rootScope) {
    var setAction = function (action) {
        return $rootScope.baseUrl + 'Menu' + '/' + action;
    }
    return {
        GetMenu: function (menuId) {
            return $http.get(setAction('GetMenuById') + '?menuId=' + menuId, "json", "application/json; charset=utf-8");
        },
        GetPage: function (pageId) {
            return $http.get(setAction('GetPageByID') + '?pageId=' + pageId, "json", "application/json; charset=utf-8");
        },
        GetMenuById: function (menuId) {
            var dataObj = { menuId: menuId };
            return $http.post(setAction('GetMenuById'), JSON.stringify(dataObj), "json", "application/json; charset=utf-8");
        },
        GetDepositDetails: function () {
            return $http.get(setAction('GetDepositDetails'), "json", "application/json; charset=utf-8");
        },
        GetTranslation: function (KyeVal, Path) {
            var dataObj = { ID: null, KyeVal: KyeVal, Value: null, LangID: null, Path: Path }
            return $http.post(setAction('TranslationSingle'), JSON.stringify(dataObj), "json", "application/json; charset=utf-8");
        },
        SaveContact: function (Contact) {
            var dataObj = {
                Name: Contact.firstName, LastName: Contact.lastName, Cell: Contact.cell,
                Email: Contact.userName, Message: Contact.Message
            }
            return $http.post(setAction('ContactUs'), JSON.stringify(dataObj), "json", "application/json; charset=utf-8");
        },
        GetPageSons: function (parentID) {
            return $http.get(setAction('GetPageSons') + '?parentPageId=' + parentID, "json", "application/json; charset=utf-8");
        },
        GetQuestions: function (pageId) {
            return $http.get(setAction('GetQuestions') + '?pageId=' + pageId, "json", "application/json; charset=utf-8");
        },
        GetJsonTrans: function (Time) {
            return $http.get(setAction(String(Time)), "json", "application/json; charset=utf-8");
        }
    }
}]);