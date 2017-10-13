'use strict';
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
IlottoApp.controller('DepositController', ['$rootScope', '$scope', '$Page', 'DataModelsService', '$state', '$stateParams', 'LogInService', 'localStorageService', 'NotificationService', 'MenuService', 'ngDialog', 'ProductService', '$window',
    function ($rootScope, $scope, $Page, DataModelsService, $state, $stateParams, LogInService, localStorageService, NotificationService, MenuService, ngDialog, ProductService, $window) {
        
		state = $state;
        var broadcastHome = function (func) {
            $state.go("Home");
            if (typeof func == 'function')
                func();
        };
        
        $scope.$Page = $Page.data;
        $scope.LogInService = LogInService;
        $scope.localStorageService = localStorageService;
        $scope.$credentials = localStorageService.get('credentials');
        $scope.NotificationService = NotificationService;
        $scope.MenuService = MenuService;
        $scope.ShowBanks = false;
        $scope.ShowBanksForm = false;
        $scope.ShowDeposit = false;

        ///params setup
        $scope.selectedBank = '';
        $scope.$scopeType = $stateParams.Type;
        $scope.depositModel = DataModelsService.depositModel([null, $scope.$credentials.UserId, null, null, false, ($stateParams.Type === 'Withdrawal'), null, null, null, $scope.$credentials.UserName, null]);
        $scope.depositModel.$error = DataModelsService.depositModel(
            [false, ///ID
            false,  ///UserID
            { $error: false, required: false },  ///RefrenceNumber
            { $error: false, required: false, min: false },  ///Amount
            false,  ///IsConfiremed
            false,  ///IsWithdrawal
            { $error: false, required: false, isPhoneNumber: false },  ///ContactPhone
            false,  ///DepositDetailsID
            { $error: false, required: false },  ///BankName
            false,  ///UserName
            false, ///userPassword
            ]);

        $scope.ModelDeposit = {
            Amount: 10,
            CardNumber: $scope.$credentials.CreditNumber,
            UseCreditToken: $scope.$credentials.UseCreditToken,
            SaveCreditToken: true,
            $error: {
                Amount: {
                    $error: false
                }
            }
        }
        $scope.$ShowDepositState = $scope.$credentials.UseCreditToken;

        var ResetdepositModel = function () {
            $scope.depositModel = DataModelsService.depositModel([null, $scope.$credentials.UserId, null, null, false, ($stateParams.Type === 'Withdrawal'), null, null, null, $scope.$credentials.UserName, null]);
            $scope.depositModel.$error = DataModelsService.depositModel(
                [false, ///ID
                false,  ///UserID
                { $error: false, required: false },  ///RefrenceNumber
                { $error: false, required: false, min: false },  ///Amount
                false,  ///IsConfiremed
                false,  ///IsWithdrawal
                { $error: false, required: false, isPhoneNumber: false },  ///ContactPhone
                false,  ///DepositDetailsID
                { $error: false, required: false },  ///BankName
                false,  ///UserName
                false, ///userPassword
                ]);
        }

        $scope.DepositDetails = localStorageService.get('DepositDetails');
        if ($rootScope.ValidateDate($scope.DepositDetails)) {
            MenuService.GetDepositDetails()
                .then(function (res) {
                    if (res.data.success) {
                        localStorageService.add('DepositDetails', res.data);
                        $scope.DepositDetails = res.data.data;
                        
                        $scope.DepositDetails.filter(function (d) {
                            d.ImageUrl = d.ImageUrl.replace('~/', $rootScope.$imageUrl);
                            d.ImageUrl = d.ImageUrl.replace('/UserContent', $rootScope.$imageUrl + 'UserContent');
                        });
                    }
                })
        } else {
            $scope.DepositDetails = $scope.DepositDetails.data;
            $scope.DepositDetails.filter(function (d) {
                d.ImageUrl = d.ImageUrl.replace('~/', $rootScope.$imageUrl);
                d.ImageUrl = d.ImageUrl.replace('/UserContent', $rootScope.$imageUrl + 'UserContent');
            });
        }

        $scope.SelectPayOption = function (bank) {
            $scope.selectedBank = parseInt(bank.ID);
            $scope.depositModel.DepositDetailsID = bank.ID;
            $scope.depositModel.BankName = bank.BankName;
            $scope.depositModel.AccountNumber = bank.AccountNumber;
            $scope.depositModel.Recipient = bank.Recipient;
            $scope.depositModel.BranchNumber = bank.BranchNumber;

            $scope.ShowBanks = false;
            $scope.ShowBanksForm = true;
        }

        $scope.ShowHideBanks = function () {
            $scope.ShowBanks = !$scope.ShowBanks;
            $scope.ShowBanksForm = false;
            $scope.ShowDeposit = false;
        };

        $scope.checkValidity = function () {
            $scope.financialForm.Amount.$setValidity('over', true);
            if (parseFloat($scope.financialForm.Amount.$modelValue) > 25000) {
                $scope.financialForm.Amount.$setValidity('over', false);
            }
        }

        $scope.SaveForm = function () {            
            $scope.checkValidity();

            if ($scope.financialForm.$invalid || !$scope.financialForm.$valid)
                return void [0];
            
            var UserDataModel =
                {
                    userName: '',
                    password: $scope.financialForm.password.$modelValue,
                    UserGuid: $scope.$credentials.UserGuid,
                    NewPassword: typeof $scope.$credentials.externalLogin !== 'undefined' && $scope.$credentials.externalLogin.length > 5?
                        $scope.$credentials.externalLogin : '',
                },
                depositModel = {
                    ID: 0,
                    UserID: $scope.$credentials.UserId,
                    RefrenceNumber: $scope.financialForm.RefrenceNumber.$modelValue,
                    Amount: $scope.financialForm.Amount.$modelValue,
                    IsConfiremed: null,
                    IsWithdrawal: false,
                    ContactPhone: null,
                    DepositDetailsID: $scope.depositModel.DepositDetailsID,
                }

            LogInService.ValidateUserPassword(UserDataModel)
                    .then(function (res) {
                        if (res.data.data) {
                            ProductService.SaveDeposit(depositModel)
                                .then(function (res) {
                                    if (res.data.success) {///success
                                        NotificationService.Success({ message: res.data.message, delay: 4500 }, broadcastHome);
                                    } else {///error
                                        NotificationService.Error({ message: res.data.message, replaceMessage: true, delay: 2550 });
                                    }
                                });
                        } else {
                            NotificationService.Error({ message: res.data.message, replaceMessage: true, delay: 2550 });
                        }
                    });
            
        }

        $scope.SaveDepositForm = function (DepositForm, ModelDeposit) {
            ModelDeposit.$error.Amount.$error = false;
            if (!(ModelDeposit.Amount > 9)) {
                ModelDeposit.$error.Amount.$error = true;
                return;
            }
            var userDataModel =
                {
                    userName: null,
                    password: null,
                    UserGuid: $scope.$credentials.UserGuid,
                    NewPassword: ModelDeposit.Amount,
                }

            if (ModelDeposit.UseCreditToken) {
                ProductService.DepositUsingWebService(userDataModel)
                    .then(function (res) {
                        if (res.data.success) {///success
                            NotificationService.Success({ message: res.data.message, delay: 6500 }, broadcastHome);
                        } else {///error
                            NotificationService.Error({ message: res.data.message, replaceMessage: true, delay: 2550 });
                        }
                    });
            } else {
                broadcastHome($scope.WindowOpen(ModelDeposit.Amount));
            }
        }

        $scope.Deposit = function () {
            $scope.ShowDeposit = !$scope.ShowDeposit;
            $scope.ShowBanks = false;
            $scope.ShowBanksForm = false;
        };
        
        $scope.WindowOpen = function (Amount) {
            windowPayment = $window.open(
                            $rootScope.$imageUrl
                            + 'Payment/Deposit?Ukey='
                            + $scope.$credentials.UserGuid.replace(/[+]/g, '[]').replace(/[\/]/g, '[*]')
                            + "&Amount=" + Amount
                            , '_blank', 'location=yes');
                              windowPayment.addEventListener('loadstop', windowPayment_loadStartHandler);
        }

        ///close the nav-bar after redirection
        $rootScope.$broadcast('Close-NavBar');
        ngDialog.closeAll();
    }]);