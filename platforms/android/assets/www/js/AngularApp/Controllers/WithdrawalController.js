'use strict';
IlottoApp.controller('WithdrawalController', ['$rootScope', '$scope', '$Page', 'DataModelsService', '$state', '$stateParams', 'LogInService', 'localStorageService', 'NotificationService', 'MenuService', 'ngDialog', 'ProductService', '$window',
    function ($rootScope, $scope, $Page, DataModelsService, $state, $stateParams, LogInService, localStorageService, NotificationService, MenuService, ngDialog, ProductService, $window) {
        
        var broadcastHome = function (func) {
            $state.go("Home");
            if (typeof func == 'function')
                func();
        };
        ///phone number regex
        var PhoneNumberRegex = /^((\+[1-9]{1,4}[ \-]*)|(\([0-9]{2,3}\)[ \-]*)|([0-9]{2,4})[ \-]*)*?[0-9]{3,4}?[ \-]*[0-9]{3,4}?$/;
       
        $scope.$Page = $Page.data;
        $scope.title = $scope.$Page.PageTitle ? $scope.$Page.PageTitle : $scope.$Page.Name;
        $scope.LogInService = LogInService;
        $scope.localStorageService = localStorageService;
        $scope.$credentials = localStorageService.get('credentials');
        $scope.NotificationService = NotificationService;
        $scope.MenuService = MenuService;
        
        $scope.checkValidity = function () {
            $scope.Withdrawalform.mobile.$setValidity('required', true);
            $scope.Withdrawalform.mobile.$setValidity('custom', true);
            if (typeof $scope.Withdrawalform.mobile.$modelValue === 'undefined' || $scope.Withdrawalform.mobile.$modelValue.length < 1) {
                $scope.Withdrawalform.mobile.$setValidity('required', false);
            } else if (!PhoneNumberRegex.test($scope.Withdrawalform.mobile.$modelValue)) {
                $scope.Withdrawalform.mobile.$setValidity('custom', false);
            }
            if (typeof $scope.Withdrawalform.password.$modelValue === 'undefined' || $scope.Withdrawalform.password.$modelValue.length < 3) {
                $scope.Withdrawalform.password.$setValidity('required', false);
            } else if ($scope.Withdrawalform.password.$modelValue.length < 3) {
                $scope.Withdrawalform.password.$setValidity('custom', false);
            }
            if (typeof $scope.Withdrawalform.amount.$modelValue === 'undefined' || $scope.Withdrawalform.amount.$modelValue.toString().length < 1) {
                $scope.Withdrawalform.amount.$setValidity('required', false);
            } else if ($scope.Withdrawalform.amount.$modelValue < 1) {
                $scope.Withdrawalform.amount.$setValidity('custom', false);
            } else if (parseFloat($scope.Withdrawalform.amount.$modelValue) > parseFloat($scope.$credentials.current)) {
                $scope.Withdrawalform.amount.$setValidity('over', false);
            }
        }

        $scope.SaveForm = function () {
            $scope.checkValidity();
            //amount, mobile,password
            if ($scope.Withdrawalform.valid || !$scope.Withdrawalform.$valid)
                return void [0];

                ///validate password
                var UserDataModel =
                {
                    userName:'',
                    password: $scope.Withdrawalform.password.$modelValue,
                    UserGuid: $scope.$credentials.UserGuid,
                    NewPassword: typeof $scope.$credentials.externalLogin !== 'undefined' && $scope.$credentials.externalLogin.length > 5 ?
                        $scope.$credentials.externalLogin : '',
                },
                depositModel = {
                    ID: 0,
                    UserID: $scope.$credentials.UserId,
                    RefrenceNumber : null,
                    Amount: $scope.Withdrawalform.amount.$modelValue,
                    IsConfiremed : null,
                    IsWithdrawal: true,
                    ContactPhone: $scope.Withdrawalform.mobile.$modelValue
                }
                LogInService.ValidateUserPassword(UserDataModel)
                    .then(function (res) {
                        if (res.data.data) {
                            ProductService.SaveDeposit(depositModel)
                                .then(function (res) {
                                    if (res.data.success) {///success
                                        NotificationService.Success({ message: res.data.message, delay: 6500 }, broadcastHome);
                                    } else {///error
                                        NotificationService.Error({ message: res.data.message, replaceMessage: true, delay: 2550 });
                                    }
                                });
                        } else {
                            NotificationService.Error({ message: res.data.message, replaceMessage: true, delay: 2550 });
                        }
                    });            
        }
        
        ///close the nav-bar after redirection
        $rootScope.$broadcast('Close-NavBar');
        ngDialog.closeAll();
    }]);