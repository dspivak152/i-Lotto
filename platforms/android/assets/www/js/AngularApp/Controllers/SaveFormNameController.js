'use strict';
IlottoApp.controller('SaveFormNameController', ['$rootScope', '$scope', 'LogInService', 'localStorageService', 'NotificationService', 'ProductService', 'DataModelsService', 'ngDialog'
    ,
    function ($rootScope, $scope, LogInService, localStorageService, NotificationService, ProductService, DataModelsService, ngDialog) {
        $scope.FormMessagesModel = angular.copy($scope.$parent.FormMessagesModel);

        var JoinArray = function (Array) {
            if (typeof Array == 'undefined' || !Array || Array.length <= 0)
                return '';
            return Array.join(',');
        }
        var ClosePop = function () {
            ngDialog.close();
        }

        $scope.Save = function (Form, _Name) {
            if (Form.$invalid || !Form.$valid)
                return void [0];

            var FormsSettingsModel = angular.copy($scope.$parent.FormsSettingsModel);
            var User = localStorageService.get('credentials');

            $scope.formModel = DataModelsService.formModel();
            var Index = 0;            
            FormsSettingsModel.Tables.filter(function (T) {
                if (T.Active) {
                    Index--;
                    $scope.formModel.Tables.push({
                        ID: Index,
                        FormID: -1,
                        Numbers: JoinArray(T.ValArray),
                        StrongNumbers: JoinArray(T.StrongValArray)
                    });
                }     
            });
            $scope.formModel.ID = -1;
            $scope.formModel.RaffleID = null;
            $scope.formModel.BaseFormTypeID = FormsSettingsModel.ID
            $scope.formModel.Name = _Name;
            $scope.formModel.SystematicType = 1;
            $scope.formModel.TableCount = $scope.formModel.Tables.length;
            $scope.formModel.Extra = FormsSettingsModel.Extra;
            $scope.formModel.UserID = User.UserId;
            $scope.formModel.IsActive = true;
            $scope.formModel.RaffleType = FormsSettingsModel.Selected_SelectionOptions;

            ProductService.SaveFormName($scope.formModel)
                .then(function (res) {
                    if (res.status === 200 && res.data == true) {///success
                        ClosePop();
                        NotificationService.Success({ message: $scope.FormMessagesModel.FormNameSaveSuccess });
                    } else {///error
                        ClosePop();
                        NotificationService.Error({ message: $scope.FormMessagesModel.saveNameErorr });
                    }
                });
        }

        ///close the nav-bar after redirection
        $rootScope.$broadcast('Close-NavBar');
    }]);
