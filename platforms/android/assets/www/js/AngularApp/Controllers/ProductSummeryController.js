'use strict';
IlottoApp.controller('ProductSummeryController', ['$rootScope', '$scope', '$state', '$stateParams', 'LogInService', 'localStorageService', 'NotificationService', 'ProductService', 'DataModelsService', 'ngDialog', 'MenuService', '$ProductForm', '$RufflesList', 'PaymentService', '$$NextRaffle',
    function ($rootScope, $scope, $state, $stateParams, LogInService, localStorageService, NotificationService, ProductService, DataModelsService, ngDialog, MenuService, $ProductForm, $RufflesList, PaymentService, $$NextRaffle) {
        
        $scope.FormMessagesModel = angular.copy($scope.$parent.FormMessagesModel);
        $scope.allowSend = false;
        $scope.$$NextRaffle = $$NextRaffle.data;
        var getMinutesBetweenDates = function (startDate, endDate) {
            var diff = endDate.getTime() - startDate.getTime();
            return parseInt(diff / 60000);
        }
        var JoinArray = function (Array) {
            if (typeof Array == 'undefined' || !Array || Array.length <= 0)
                return '';
            return Array.join(',');
        };
        var broadcastHome = function () {///REMOVE ALL STORED DATA ANG GO TO HOME TO RE-START
            localStorageService.remove('SavedPageForMony');
            ProductService.setProductForm(null);
            $state.go("Home");
            $scope.allowSend = false;
        }
        var ResetForm = function () {
            $state.transitionTo($state.current, $stateParams, {
                reload: true,
                inherit: false,
                notify: true
            });
        };
        var StayInScope = function ($ProductForm) {
            if (!$ProductForm || !$ProductForm.SaveFormData || !$ProductForm.FormsSettingsModel)
                $ProductForm = ProductService.GetProduct($stateParams.ProdId)
            if (!$ProductForm || !$ProductForm.SaveFormData || !$ProductForm.FormsSettingsModel) {///no data go to home page
                NotificationService.Warning({ message: 'Data Error!, No Data!', delay: 1550 }, broadcastHome);
                return void [0];
            }
            ///TimeStop -> only save data for 1 hour
            var TimeStop = new Date(); TimeStop.setHours(TimeStop.getHours() - 1);
            var SaveDataDate = new Date($ProductForm.SaveDataDate);
            if (SaveDataDate < TimeStop) {///data over 1 hour old, delete and return
                NotificationService.Warning({ message: 'Data Error!, No Data!', delay: 2550 }, broadcastHome);
                return void [0];
            }
        }
        var SetFormData = function () {
            var formModel = DataModelsService.formModel();
            var User = localStorageService.get('credentials');
            var Index = 0;
            $scope.FormsSettingsModel.Tables.filter(function (T) {
                if (T.Active) {
                    Index--;
                    formModel.Tables.push({
                        ID: Index,
                        FormID: -1,
                        Numbers: JoinArray(T.ValArray),
                        StrongNumbers: JoinArray(T.StrongValArray)
                    });
                }
            });
            formModel.BaseFormTypeID = $scope.FormsSettingsModel.ID
            formModel.Extra = $scope.FormsSettingsModel.Extra === true;
            formModel.ID = -1;
            formModel.IsActive = true;
            formModel.Name = null;
            formModel.RaffleID = $scope.CurrentRaffleID;
            formModel.RaffleType = $scope.FormsSettingsModel.Selected_SelectionOptions;
            formModel.SystematicType = $scope.CalcFormData.numberRuffels_Selected.id;
            formModel.TableCount = formModel.Tables.length;
            formModel.UserID = User.UserId;
            formModel.State = 1;

            var data = { formModel: formModel, CalculatFormCostPostModel: $scope.CalcFormData };
            return data;
        }
        function convertDate(inputFormat, addTime) {
            if(inputFormat == null || !inputFormat || typeof inputFormat == 'undefined' || inputFormat.length < 5)
                return void[0];
            
            function pad(s) { return (s < 10) ? '0' + s : s; }
            function year(y) {
                return y > 2000 ? y.toString().replace('20', '') : y.toString().split('').splice(2, 2).join('');
            }
            var d = new Date(inputFormat);
            if (d == 'Invalid Date') {
                var a = inputFormat.split(/[^0-9]/);
                d = new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5]);
            }

            d.setHours(d.getHours() - 3);
            var retDate = [pad(d.getDate()), pad(d.getMonth() + 1), year(d.getFullYear())].join('/');
            if (addTime) retDate += ' ' + [pad(d.getHours()), pad(d.getMinutes())].join(':');
            return retDate;
        }
        ///re calc form cost 
        $scope.ReCalcForm = function () {
            $scope.CalcFormData.Extra = $scope.FormsSettingsModel.Extra;
            $scope.CalcFormData.numberRuffels = $scope.CalcFormData.numberRuffels_Selected.id;
            ProductService.CalculatFormCost($scope.CalcFormData)
                .then(function (res) {
                    if (res.data.success) {//get prices OK
                        $scope.FormCostModel = res.data.data;
                    } else {
                        NotificationService.Error({ message: 'Error Geting Prices From Server' }, broadcastHome);
                    }
                });

            $scope.paymentsNumber = parseInt($scope.CalcFormData.numberRuffels / 8);
        };

        $scope.LogInService = LogInService;
        $scope.localStorageService = localStorageService;
        $scope.NotificationService = NotificationService;
        $scope.MenuService = MenuService;
        $scope.CurrentRaffleID = localStorageService.get('CurrentRaffleID');
        $scope.CurrentRaffleID = $scope.CurrentRaffleID.data;
        $scope.paymentsNumber = '';
        
        if (typeof $RufflesList == '' || !$RufflesList || !$RufflesList.data) {
            NotificationService.Error({ message: 'Fatal Erorr!', delay: 650 }, broadcastHome);
        }
                
        ///allows 1 refresh if operation encountered an error
        if (typeof $ProductForm == 'undefined' || !$ProductForm) {
            $ProductForm = localStorageService.get('SavedPageForMony');
            localStorageService.remove('SavedPageForMony');

            if (typeof $ProductForm == 'undefined' || !$ProductForm)
                NotificationService.Error({ message: 'Fatal Erorr!', delay: 650 }, broadcastHome);
        }
        ///user data
        $scope.userCredentials = localStorageService.get('credentials');
        
        $scope.IdentityNumber = typeof $scope.userCredentials.user !== 'undefined' && typeof $scope.userCredentials.user.IdentityNumber === 'string' ? $scope.userCredentials.user.IdentityNumber.substring($scope.userCredentials.user.IdentityNumber.length - 4, $scope.userCredentials.user.IdentityNumber.length)
            : null;

        ///validate have data or go to home
        StayInScope($ProductForm);
        $scope.FormMessagesModel = $ProductForm.FormMessagesModel;
        $scope.SaveFormData = $ProductForm.SaveFormData;
        $scope.CalcFormData = $ProductForm.CalcFormData;
        $scope.FormsSettingsModel = $ProductForm.FormsSettingsModel;
        $scope.FormCostModel = $ProductForm.FormCostModel;
        $scope.$Page = $ProductForm.$Page;
        $scope.MaxRaffles = $ProductForm.MaxRaffles;
        $scope.Title = $scope.$Page.PageTitle ? $scope.$Page.PageTitle : $scope.$Page.Name;
        $scope.RuffleNumbers = new Array();
        $scope.UseService = true;

        $scope.$RufflesList = $RufflesList.data;
        $RufflesList.data.map(function (r, Index) {
            $scope.RuffleNumbers.push({ id: r.ID, number: r.RaffleNumber });
        });

        var UserNoMonyDecision = function () {
            ///save the form
            ProductService.setProductForm($ProductForm);
            localStorageService.add('SavedPageForMony', $ProductForm);
            ///open the no mony page
            ngDialog.open({
                template: 'Html/Ng-Dialog/Form.NoMonyDecision.html',
                controller: 'PaymentDecisionController',
                scope: $scope,
                backdrop: 'static',
                showClose: false
            });
        };
        
        $scope.ReturnToForm = function () {
            ////save form and go back
            localStorageService.add('SavedPageForMony', $ProductForm);
            window.history.back();
        }

        $scope.GoToPayment = function () {
            ///save the form
            ProductService.setProductForm($ProductForm);
            localStorageService.add('SavedPageForMony', $ProductForm);
            $state.go('Product.Payment');
        }

        $scope.AfterShowPop = function () {
            ///get current user
            var User = localStorageService.get('credentials');
            ///first check if user have fands for form
            ///2 option 1: have -> go to save, 2: dont have -> pop the insertmony popup
            if (User.current < $scope.FormCostModel.Total) {///user dont have fands send to pay page
                ///go to payment page
                $scope.GoToPayment();
                return void [0];
            }
            else {///update data
                User.userObligo = parseFloat(User.userObligo + $scope.FormCostModel.Total).toFixed(2);
                User.current = parseFloat(User.current - $scope.FormCostModel.Total).toFixed(2);
                localStorageService.add('credentials', User);
            }
            $scope.allowSend = true;
            ProductService.SaveForm(SetFormData())
                .then(function (res) {
                    if (res.data.success) {///success
                        NotificationService.Success({ message: res.data.message }, broadcastHome);
                    } else {///error
                        NotificationService.Error({ message: res.data.message, delay: 750 }, broadcastHome);
                    }
                });
        }
        $scope.SendForm = function () {
            var _Go = true;
            ///current time
            $scope.currentDate = new Date();
            ///check raffle time
            var _message = '<div style="text-align:right;">הנך הולך לבצע הזמנה להגרלה מספר NUMBER<br/> בתאריך TIME DATE</div>';
            $scope.$$NextRaffle.filter(function (item) {
                var rafDate = new Date(item.Raffledate.replace('T', ' '));
                var difMinutes = getMinutesBetweenDates(rafDate, $scope.currentDate);
                if (difMinutes < 0) difMinutes = difMinutes * (-1);
                if (difMinutes < item.FormCloseTime) {
                    _Go = false;
                    NotificationService.Info({
                        message:
                            _message.replace('NUMBER', item.RaffleNumber)
                                .replace('DATE', convertDate(item.Raffledate))
								.replace('TIME', convertDate(item.Raffledate, true).split(' ')[1])
                        , delay: 5500
                    }, $scope.AfterShowPop);
                }
            });
            if (_Go) $scope.AfterShowPop();
        }

        ///save form name
        $scope.SaveFormName = function () {
            ngDialog.open({ template: 'Html/Ng-Dialog/SaveFormName-Template.html', controller: 'SaveFormNameController', scope: $scope });
        };

        $scope.UsingWebService = function (form) {            
            ProductService.WebServicePay(form)
                .then(function successCallback(response) {
                    if (response.data.success) {
                        NotificationService.Success({ message: response.data.message }, broadcastHome);
                    }
                    else {
                        NotificationService.Error({ message: response.data.message, delay: 750 }, broadcastHome);
                    }
                }, function errorCallback(response) {
                    console.log('errorCallback response', response);
                    NotificationService.Error({ message: $scope.FormMessagesModel.formMonyError, delay: 750 }, broadcastHome);
                });
        }
        ///re-calc the form cost, having problems with the saved forms....
        $scope.ReCalcForm();
        ///close the nav-bar after redirection
        $rootScope.$broadcast('Close-NavBar');
    }]);
