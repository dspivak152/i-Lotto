IlottoApp.factory('LogInService', ['$http', '$rootScope', function ($http, $rootScope) {
    var setAction = function (action) {
        return $rootScope.baseUrl + 'Account' + '/' + action;
    }
    return {
        LogInFB: function (userData) {
            return $http.post(setAction('Facebook'), JSON.stringify(userData), "json", "application/json; charset=utf-8");
        },
        LogIn: function (userData) {
            var dataObj = { userName: userData.userName, password: userData.password };
            return $http.post(setAction('LogIn'), JSON.stringify(dataObj), "json", "application/json; charset=utf-8");
        },
        ChangePassword: function (userData) {
            var dataObj = { userName: userData.userName, password: userData.password, NewPassword: userData.NewPassword };
            return $http.post(setAction('ChangePassword'), JSON.stringify(dataObj), "json", "application/json; charset=utf-8");
        },
        Validate: function (userData) {
            return $http.post(setAction('ValidateUser'), JSON.stringify(userData), "json", "application/json; charset=utf-8");
        },
        LogOut: function (userData) {
            return $http.post(setAction('LogOut'), JSON.stringify(userData), "json", "application/json; charset=utf-8");
        },
        Register: function (userData) {
            return $http.post(setAction('Register'), JSON.stringify(userData), "json", "application/json; charset=utf-8");
        },
        ResetPassword: function (_userName) {
            var dataObj = { userName: _userName, password: '' };
            return $http.post(setAction('ResetPassword'), JSON.stringify(dataObj), "json", "application/json; charset=utf-8");
        },
        ValidateUserPassword: function (userData) {
            return $http.post(setAction('ValidateUserPassword'), JSON.stringify(userData), "json", "application/json; charset=utf-8");
        },
        UpdateDetails: function (userData) {
            return $http.post(setAction('UpdateDetails'), JSON.stringify(userData), "json", "application/json; charset=utf-8");
        },
        GetUserFromConfirmationToken: function (Token) {
            return $http.post(setAction('GetUserFromConfirmationToken') + '?Token=' + Token, JSON.stringify({ Token: Token }), "json", "application/json; charset=utf-8");
        },
        loginGoogleUser: function (data) {
            return $http.post(setAction('Google'), JSON.stringify(data), "json", "application/json; charset=utf-8");
        },
        RegisterUserMobileDeviceId: function (mobileDeviceData) {
            return $http.post(setAction('RegisterMobileDeviceId'), JSON.stringify(mobileDeviceData), "json", "application/json; charset=utf-8");
        },
        WriteLogAction: function (message) {
            return $http.post(setAction('WriteLogAction') + '?message=' + message, JSON.stringify(message), "json", "application/json; charset=utf-8");
        }
    }
}]);