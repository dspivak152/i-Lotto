'use strict';
IlottoApp.controller('PaymentDecisionController', ['$rootScope', '$scope', '$state', 'localStorageService', 'NotificationService', 'ProductService', 'MenuService', 'ngDialog', '$window', 'DataModelsService', '$timeout',
    function ($rootScope, $scope, $state, localStorageService, NotificationService, ProductService, MenuService, ngDialog, $window, DataModelsService, $timeout) {

        $scope.FormMessagesModel = angular.copy($scope.$parent.FormMessagesModel);
        $scope.$ProductForm = ProductService.getProductForm();

        $scope.userCredentials = localStorageService.get('credentials');
        $scope.$Page = null;
        MenuService.GetPage(1030).then(function (res) {
            if (res.status == 200) {
                $scope.$Page = res.data;
            } else {
                $scope.ResetForm();
            }
        });

        var StayInScope = function ($ProductForm) {
            if (!$ProductForm || !$ProductForm.SaveFormData || !$ProductForm.FormsSettingsModel) {///no data go to home page
                NotificationService.Warning({ message: 'Data Error!, No Data!', delay: 2550 }, $scope.ResetForm);
                return void [0];
            }
            ///TimeStop -> only save data for 1 hour
            var TimeStop = new Date(); TimeStop.setHours(TimeStop.getHours() - 1);
            var SaveDataDate = new Date($ProductForm.SaveDataDate);
            if (SaveDataDate < TimeStop) {///data over 1 hour old, delete and return
                NotificationService.Warning({ message: 'Data Error!, No Data!', delay: 2000 }, $scope.ResetForm);
                return void [0];
            }
        }
        StayInScope($scope.$ProductForm);

        var ClosePop = function () {
            ngDialog.close();
        }
        $scope.ResetForm = function () {///REMOVE ALL STORED DATA ANG GO TO HOME TO RE-START
            localStorageService.remove('SavedPageForMony');
            ProductService.setProductForm(null);
            ClosePop();
            $state.go("Home");
        }
        $scope.ResetAndRedirect = function (ResData) {
            localStorageService.remove('SavedPageForMony');
            ProductService.setProductForm(null);
            ClosePop();

            $timeout(function () {
                $state.go("Home");
            },190);
            
            $window.open($rootScope.$imageUrl + 'Payment/PaymentMobile?formID=' + ResData + '&Ukey=' + $scope.userCredentials.UserGuid.replace(/[+]/g, '[]'), '_blank');
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

            var data = { formModel: formModel, CalculatFormCostPostModel: $scope.CalcFormData };
            return data;
        }
        
        $scope.Pay = function () {
            ///save the form and open new page for site pay
            ProductService.SaveForm(SetFormData())
                .then(function (res) {
                    if (res.data.success) {///success
                        NotificationService.Success({ message: res.data.message }, $scope.ResetAndRedirect(res.data.data));
                    } else {///error
                        NotificationService.Error({ message: res.data.message, delay: 750 }, $scope.ResetForm);
                    }
                });
        }

        $scope.PayUsingWebService = function () {
            if ($scope.UseService) {
                var form = SetFormData();
                $scope.$parent.UsingWebService(form);
                ClosePop();
            } else {
                $scope.Pay();
            }
        }
    }]);
