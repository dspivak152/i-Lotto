'use strict';
IlottoApp.controller('DepositWithdrawalController', ['$rootScope', '$scope', '$Page', 'DataModelsService', '$state', '$stateParams', 'LogInService', 'localStorageService', 'NotificationService', 'MenuService', 'ngDialog', 'ProductService', '$window',
    function ($rootScope, $scope, $Page, DataModelsService, $state, $stateParams, LogInService, localStorageService, NotificationService, MenuService, ngDialog, ProductService, $window) {

        var broadcastHome = function (func) {
            $state.go("Home");
            if (typeof func == 'function')
                func();
        };
        ///phone number regex
        var PhoneNumberRegex = /^((\+[1-9]{1,4}[ \-]*)|(\([0-9]{2,3}\)[ \-]*)|([0-9]{2,4})[ \-]*)*?[0-9]{3,4}?[ \-]*[0-9]{3,4}?$/;
        ///local functions
        var InvalidateForm = function (form) {
            form.$valid = false;
            form.$invalid = true;
        }
        var ValidateForm = function (financialForm, depositModel) {
            financialForm.$invalid = false;
            financialForm.$valid = true;
            depositModel.$error = DataModelsService.depositModel([false, false, { $error: false, required: false, minlength: false }, { $error: false, required: false, min: false, Over: false }, false, false, { $error: false, required: false, isPhoneNumber: false, minlength: false }, false, { $error: false, required: false, minlength: false }, { $error: false, required: false}, ]);

            if ($scope.$scopeType === 'Withdrawal') {
                if (!depositModel.Password || depositModel.Password == '') {
                    depositModel.$error.Password.$error = true;
                    depositModel.$error.Password.required = true;
                    InvalidateForm(financialForm);
                }
                if (!depositModel.ContactPhone || depositModel.ContactPhone == '') {
                    depositModel.$error.ContactPhone.$error = true;
                    depositModel.$error.ContactPhone.required = true;
                    InvalidateForm(financialForm);
                }
                if (!PhoneNumberRegex.test(depositModel.ContactPhone)) {
                    depositModel.$error.ContactPhone.$error = true;
                    depositModel.$error.ContactPhone.isPhoneNumber = true;
                    InvalidateForm(financialForm);
                }
                if (typeof depositModel.Amount == 'undefined' || isNaN(parseFloat(depositModel.Amount))) {
                    depositModel.$error.Amount.$error = true;
                    depositModel.$error.Amount.required = true;
                    InvalidateForm(financialForm);
                }
                if (parseFloat(depositModel.Amount) > parseFloat($scope.$credentials.current)) {
                    depositModel.$error.Amount.$error = true;
                    depositModel.$error.Amount.Over = true;
                    InvalidateForm(financialForm);
                }
            } else {
                if (!depositModel.BankName || depositModel.BankName == '') {
                    depositModel.$error.BankName.$error = true;
                    depositModel.$error.BankName.required = true;
                    InvalidateForm(financialForm);
                }
                if (depositModel.BankName && depositModel.BankName.length < 3) {
                    depositModel.$error.BankName.$error = true;
                    depositModel.$error.BankName.minlength = true;
                    InvalidateForm(financialForm);
                }
                if (typeof depositModel.Amount == 'undefined' || depositModel.Amount == '' || !depositModel.Amount) {
                    depositModel.$error.Amount.$error = true;
                    depositModel.$error.Amount.required = true;
                    InvalidateForm(financialForm);
                }
                if (depositModel.Amount <= 1) {
                    depositModel.$error.Amount.$error = true;
                    depositModel.$error.Amount.min = true;
                    InvalidateForm(financialForm);
                }
                if (!depositModel.RefrenceNumber || depositModel.RefrenceNumber == '') {
                    depositModel.$error.RefrenceNumber.$error = true;
                    depositModel.$error.RefrenceNumber.required = true;
                    InvalidateForm(financialForm);
                }
                if (depositModel.RefrenceNumber && depositModel.RefrenceNumber.length < 6) {
                    depositModel.$error.RefrenceNumber.$error = true;
                    depositModel.$error.RefrenceNumber.minlength = true;
                    InvalidateForm(financialForm);
                }
            }
        }

        $scope.$Page = $Page.data;
        $scope.title = $scope.$Page.PageTitle ? $scope.$Page.PageTitle : $scope.$Page.Name;
        $scope.LogInService = LogInService;
        $scope.localStorageService = localStorageService;
        $scope.$credentials = localStorageService.get('credentials');
        $scope.NotificationService = NotificationService;
        $scope.MenuService = MenuService;
        $scope.ShowBanks = false;
        $scope.ShowBanksForm = false;
        $scope.ShowDeposit = false;
        //$scope.$LogInState = true;
        
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
                
        $scope.SaveForm = function (financialForm, depositModel) {
            ValidateForm(financialForm, depositModel);
            if (financialForm.$invalid || !financialForm.$valid)
                return void [0];
            if ($stateParams.Type === 'Withdrawal') {
                ///validate password
                var UserDataModel =
                {
                    userName:'',
                    password: depositModel.Password,
                    UserGuid: $scope.$credentials.UserGuid,
                    NewPassword: '',
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
            else {
                ProductService.SaveDeposit(depositModel)
                    .then(function (res) {
                        if (res.data.success) {///success
                            NotificationService.Success({ message: res.data.message, delay: 6500 }, broadcastHome);
                        } else {///error
                            NotificationService.Error({ message: res.data.message, replaceMessage: true, delay: 2550 });
                        }
                    });
            }
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
            $window.open(
                $rootScope.$imageUrl
                + 'Payment/Deposit?Ukey='
                + $scope.$credentials.UserGuid.replace(/[+]/g, '[]')
                + "&Amount=" + Amount
                , '_blank');
        }

        ///close the nav-bar after redirection
        $rootScope.$broadcast('Close-NavBar');
        ngDialog.closeAll();
    }]);