'use strict';

IlottoApp.controller('ProductPaymentController', ['$rootScope', '$scope', '$state', 'LogInService', 'localStorageService', 'NotificationService', 'ProductService', 'DataModelsService', 'ngDialog', 'MenuService', '$ProductForm', 'PaymentService', '$window'
    , '$timeout', '$location',
    function ($rootScope, $scope, $state, LogInService, localStorageService, NotificationService, ProductService, DataModelsService,
                ngDialog, MenuService, $ProductForm, PaymentService, $window, $timeout, $location) {
        
		state = $state;
        $scope.broadcastHome = function () {///REMOVE ALL STORED DATA AND GO TO HOME TO RE-START
            localStorageService.remove('SavedPageForMony');
            ProductService.setProductForm(null);
            $state.go("Home");
        }
        var StayInScope = function ($ProductForm) {
            if (!$ProductForm || !$ProductForm.SaveFormData || !$ProductForm.FormsSettingsModel) {///no data go to home page
                NotificationService.Warning({ message: 'Data Error!, No Data!', delay: 2550 }, $scope.broadcastHome);
                return void [0];
            }
            ///TimeStop -> only save data for 1 hour
            var TimeStop = new Date(); TimeStop.setHours(TimeStop.getHours() - 1);
            var SaveDataDate = new Date($ProductForm.SaveDataDate);
            if (SaveDataDate < TimeStop) {///data over 1 hour old, delete and return
                NotificationService.Warning({ message: 'Data Error!, No Data!', delay: 2550 }, $scope.broadcastHome);
                return void [0];
            }
        }
        var JoinArray = function (Array) {
            if (typeof Array == 'undefined' || !Array || Array.length <= 0)
                return '';
            return Array.join(',');
        };
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
            formModel.State = -1;
            formModel.Ukey = $scope.userCredentials.UserGuid.replace(/[+]/g, '[]');

            var data = { formModel: formModel, CalculatFormCostPostModel: $scope.CalcFormData };
            return data;
        }
        
        $scope.LogInService = LogInService;
        $scope.localStorageService = localStorageService;
        $scope.NotificationService = NotificationService;
        $scope.MenuService = MenuService;
        $scope.UseService = $scope.userCredentials.UseCreditToken;
        $scope.tab = null;
        ///allows 1 refresh if operation encountered an error
        if (typeof $ProductForm == 'undefined' || !$ProductForm) {
            $ProductForm = localStorageService.get('SavedPageForMony');
            localStorageService.remove('SavedPageForMony');
        }

        $scope.Pay = function (form) {
            ///save the form and open new page for site pay
            ProductService.SaveForm(form)
                .then(function (res) {
                    if (res.data.success) {///success
                        $scope.ResetAndRedirect(res.data);
                    } else {///error
                        NotificationService.Error({ message: res.data.message, delay: 750 }, $scope.broadcastHome);
                    }
                });
        }

        $scope.ResetAndRedirect = function (ResData) {
            localStorageService.remove('SavedPageForMony');
            ProductService.setProductForm(null);

            var message = ResData.message.split('[||]');
            var data = {
                formID: ResData.data,
                Ukey: $scope.userCredentials.UserGuid.replace(/[+]/g, '[]')
            };
            OpenWindowWithPost(data);
        }

        $scope.UsingWebService = function (form) {
            ProductService.WebServicePay(form)
                .then(function successCallback(response) {
                    if (response.data.success) {
                        NotificationService.Success({ message: response.data.message }, $scope.broadcastHome);
                    }
                    else {
                        NotificationService.Error({ message: response.data.message, delay: 750 }, $scope.broadcastHome);
                    }
                }, function errorCallback(response) {
                    NotificationService.Error({ message: $scope.FormMessagesModel.formMonyError, delay: 750 }, $scope.broadcastHome);
                });
        }

        ///validate have data or go to home
        StayInScope($ProductForm);
        $scope.FormMessagesModel = $ProductForm.FormMessagesModel;
        $scope.SaveFormData = $ProductForm.SaveFormData;
        $scope.CalcFormData = $ProductForm.CalcFormData;
        $scope.FormsSettingsModel = $ProductForm.FormsSettingsModel;
        $scope.FormCostModel = $ProductForm.FormCostModel;
        
        $scope.SaveForm = function (model) {
            var form = SetFormData();
            $scope.$from = form;
            switch (model) {
                case 1:
                    $scope.UsingWebService(form);
                    break;
                case 2:
                    $scope.postForm(form);
                    break;
                default:
                    $scope.broadcastHome();
                    break;
            }
            //return false;
        }

     $scope.postForm = function (form) {
                    ProductService.SaveForm(form)
                        .then(function successCallback(response) {
                            if (response.data.success) {
                                localStorageService.remove('SavedPageForMony');
                                ProductService.setProductForm(null);

                               windowPayment = window.open($rootScope.$imageUrl + 'Payment/RedirectFormToZ?formId=' + response.data.data, '_blank', 'location=yes');
                               windowPayment.addEventListener('loadstop', windowPayment_loadStartHandler);
                            }
                            else {
                                ////form dident save
                                NotificationService.Error({ message: response.data.message, delay: 750 }, $scope.broadcastHome);
                            }
                            //console.log(response)
                        }, function errorCallback(response) {
                            NotificationService.Error({ message: $scope.FormMessagesModel.formMonyError, delay: 750 }, $scope.broadcastHome);
                        }, );
                }

        var MapObject = function (item, name, $inputs) {
            if (typeof $inputs === 'undefined')
                $inputs = [];
            if (typeof name === 'undefined')
                name = '';
            for (var i in item) {
                if (isNaN(i) && name.lastIndexOf('.') < (name.length - 1) && isNaN(name.substring(name.indexOf('Tables[') + 7, name.length)))
                    name += '.';
                if (typeof item[i] === 'object') {
                    MapObject(item[i], (name + (isNaN(i)? "":"[") + i), $inputs);
                }
                if (typeof item[i] !== 'object' && typeof item[i] !== 'function') {
                    if (name.indexOf('Tables[') > 0 && !isNaN(name.substring(name.indexOf('Tables[') + 7, name.length))) {
                        name += '].';
                    }
                    var input = document.createElement('input');
                    input.type = 'hidden';
                    input.name = (name + '' + i);
                    input.value = item[i];
                    $inputs.push(input);
                }
            }
            return $inputs;
        }

        ///close the nav-bar after redirection
        $rootScope.$broadcast('Close-NavBar');
}]);
