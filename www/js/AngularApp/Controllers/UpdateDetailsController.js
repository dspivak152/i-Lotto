'use strict';
IlottoApp.controller('UpdateDetailsController', ['$rootScope', '$scope', '$http', '$timeout', '$state', 'LogInService', 'localStorageService', 'NotificationService', 'MenuService', 'ngDialog', '$stateParams', '$User', '$Message',
    function ($rootScope, $scope, $http, $timeout, $state, LogInService, localStorageService, NotificationService, MenuService, ngDialog
        , $stateParams, $User, $Message) {
        
        $scope.ValidateIDNumber = function (number) {
            var IDnum = String(number);

            // Validate correct input
            if ((IDnum.length > 9) || (IDnum.length < 5)) {
                return false;
            }

            if (isNaN(IDnum)) {
                return false;
            }

            // The number is too short - add leading 0000
            if (IDnum.length < 9) {
                while (IDnum.length < 9) {
                    IDnum = '0' + IDnum;
                }
            }

            // CHECK THE ID NUMBER
            var mone = 0, incNum;
            for (var i = 0; i < 9; i++) {
                incNum = Number(IDnum.charAt(i));
                incNum *= (i % 2) + 1;
                if (incNum > 9)
                    incNum -= 9;
                mone += incNum;
            }
            if (mone % 10 == 0) {
                return true;
            } else {
                return false;
            }
        }
        
        var validate_Phone_Number = function (number) {
            var patt = new RegExp(/^0\d([\d]{0,1})([-]{0,1})\d{7}$/gi);
            return patt.test(number);
        }

        $Message = typeof $Message === 'object' ? $Message.data.data.KyeVal : $Message;
        $scope.updateStep = false;
        $scope.LogInService = LogInService;
        $scope.localStorageService = localStorageService;
        $scope.NotificationService = NotificationService;
        $scope.MenuService = MenuService;

        var returnFull = function (cell, phone) {
            if(phone && phone.length > 7)
                return phone;
            if (cell && cell.length > 7)
                return cell;
            return '';
        }
        var spliteFullName = function (fullName) {
            var nameArray = new Array();
            if (!fullName || fullName.length < 1)
                return ['', ''];

            nameArray = fullName.split(' ');
            if (nameArray.length < 2)
                return [nameArray[0], ""];
            if (nameArray.length === 2)
                return nameArray;
            if (nameArray.length > 2) {
                var newNameArray = new Array();
                newNameArray = nameArray.splice(0, 1);
                newNameArray[1] = nameArray.join(' ');
                return newNameArray;
            }
        }
        $scope.$User = $User;
        $scope.Token = $stateParams.Token;
        
        $scope.Credentials = new Object();
        if ($scope.Token && $scope.Token.length > 10) {
            ///ConfirmUser check user
            if (!$scope.$User || typeof $scope.$User !== 'object' || typeof $scope.$User.data !== 'object') {
                NotificationService.Error({ message: $Message, replaceMessage: true, delay: 6000 }, $state.go("Home"));
                return;
            }
            try {
                $scope.updateStep = true;
                $scope.Credentials = $scope.$User.data;
                $scope.$$UserName = $scope.Credentials.UserName;

                $scope.userDetails = {
                    Id: $scope.Credentials.Id,
                    FullName: $scope.Credentials.Fname + ' ' + $scope.Credentials.Lname,
                    UserName: $scope.$$UserName,
                    IdentityNumber: $scope.Credentials.IdentityNumber,
                    Phone: returnFull($scope.Credentials.Cell, $scope.Credentials.Phone),
                    Password: null,
                };
            } catch (e) {
                NotificationService.Error({ message: $Message, replaceMessage: true, delay: 6000 }, $state.go("Home"));
            }
        } else {
            $scope.Credentials = localStorageService.get('credentials');
            $scope.$$UserName = $scope.Credentials.UserName;

            $scope.userDetails = {
                Id: $scope.Credentials.UserId,
                FullName: $scope.Credentials.FullName,
                UserName: $scope.$$UserName,
                IdentityNumber: $scope.Credentials.user.IdentityNumber,
                Phone: returnFull($scope.Credentials.user.Cell, $scope.Credentials.user.Phone),
                Password: null,
            };
        }
                
        $scope.Update = function () {
            $scope.UpdateForm.IdentityNumber.$setValidity('custom', true);
            $scope.UpdateForm.Phone.$setValidity('custom', true)

            if (!$scope.ValidateIDNumber($scope.userDetails.IdentityNumber))
                $scope.UpdateForm.IdentityNumber.$setValidity('custom', false);
            if (!validate_Phone_Number($scope.userDetails.Phone))
                $scope.UpdateForm.Phone.$setValidity('custom', false);
            if ($scope.UpdateForm.$invalid)
                return;

            var UserModel = {
                Id: $scope.userDetails.Id,
                UserName: $scope.$$UserName,
                Fname: spliteFullName($scope.userDetails.FullName)[0],
                Lname: spliteFullName($scope.userDetails.FullName)[1],
                Phone: $scope.userDetails.Phone,
                IdentityNumber: $scope.userDetails.IdentityNumber,
                Password: $scope.userDetails.Password,
                IsConfirmed: true,
                IsActive: true,
                AgreeToRules: true,
                MailingList: true,
                ConfirmationToken: $scope.Token,
                UpdatedDate: new Date(),
                ///TODO -> ADD IN APP
                //MobileDeviceId: null,
                //MobileDeviceType: null,
            }
            LogInService.UpdateDetails(UserModel)
                .success(function (res) {
                    if (res.success) {
                        localStorageService.set('credentials', res.data);
                        $scope.updateStep ?
                            NotificationService.Success({ message: res.message, delay: 3000 }, $state.go("Home")) :
                            NotificationService.Success({ message: res.message, delay: 2500 });
                    } else {
                        NotificationService.Error({ message: res.message, delay: 3000 }, $state.go("Home"));
                    }
                })
                .error(function (res) {
                    NotificationService.Error({ message: 'Fatal Error!', delay: 5000 }, $state.go("Home"));
                });
        }
                
        ///close the nav-bar after redirection
        $rootScope.$broadcast('Close-NavBar');
        ngDialog.closeAll();
    }]);

