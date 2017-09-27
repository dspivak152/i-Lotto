'use strict';
IlottoApp.controller('ForgotPasswordController',
    ['$rootScope', '$scope', '$http', '$Page', '$compile', '$timeout', '$state', '$stateParams', 'LogInService', 'localStorageService', 'NotificationService', 'MenuService', 'ngDialog'
    , function ($rootScope, $scope, $http, $Page, $compile, $timeout, $state, $stateParams, LogInService, localStorageService, NotificationService, MenuService, ngDialog) {

        $scope.$Page = $Page.data;
        $scope.title = $scope.$Page.PageTitle ? $scope.$Page.PageTitle : $scope.$Page.Name;
        $scope.LogInService = LogInService;
        $scope.localStorageService = localStorageService;
        $scope.NotificationService = NotificationService;
        $scope.MenuService = MenuService;
        
        $scope.Reset = function (userName) {
            if (userName && userName.length > 5) {
                ///send email to user
                LogInService.ResetPassword(userName)
                    .then(function (res) {
                        if (res.data.success) {
                            NotificationService.Success({ message: res.data.message, delay: 7500 }, $state.go("LogIn"));
                        } else {
                            NotificationService.Error({ message: res.data.message });
                        }
                    });
            }
        };
        
        ///close the nav-bar after redirection
        $rootScope.$broadcast('Close-NavBar');
        ngDialog.closeAll();
    }]);