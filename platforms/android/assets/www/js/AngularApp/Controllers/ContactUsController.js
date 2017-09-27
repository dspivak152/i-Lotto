'use strict';
IlottoApp.controller('ContactUsController',
    ['$rootScope', '$scope', '$http', '$Page', '$compile', '$timeout', '$state', '$stateParams', 'LogInService', 'localStorageService', 'NotificationService', 'MenuService', 'ngDialog'
    , function ($rootScope, $scope, $http, $Page, $compile, $timeout, $state, $stateParams, LogInService, localStorageService, NotificationService, MenuService, ngDialog) {

        $scope.$Page = $Page.data;
        
        $scope.title = $scope.$Page.PageTitle ? $scope.$Page.PageTitle : $scope.$Page.Name;
        $scope.LogInService = LogInService;
        $scope.localStorageService = localStorageService;
        $scope.NotificationService = NotificationService;
        $scope.MenuService = MenuService;
        $scope.Contact = {
            firstName: null,
            lastName: null,
            userName: null,
            cell: null,
            Message: null,
            $error: {
                firstName: false,
                lastName: false,
                userName: false,
                cell: false
            }
        }

        $scope.Register = function(ContactForm, Contact){
            Validate(ContactForm, Contact);
            if (ContactForm.$valid) {
                MenuService.SaveContact(Contact)
                    .then(function (res) {
                        if (res.data.success) {
                            NotificationService.Success({ message: 'הודעתך התקבלה, שירות הלקוחות יצרו איתך קשר בהקדם.', delay: 7500 }, $state.go("Home"));
                        } else {
                            NotificationService.Error({ message: 'התרחשה שגיאה בשמירת הפרטים, אנא נסה שנית מאוחר יותר.' });
                        }
                    });
            }
        }

        var Validate = function (ContactForm, Contact) {
            Contact.$error = {
                firstName: false,
                //lastName: false,
                userName: false,
                cell: false
            };
            if (!Contact.firstName || Contact.firstName.length < 2) {
                InvalidateForm(ContactForm);
                Contact.$error.firstName = true;
            }
            //if (!Contact.lastName || Contact.lastName.length < 2) {
            //    InvalidateForm(ContactForm);
            //    Contact.$error.lastName = true;
            //}
            if (!Contact.userName || Contact.userName.length < 2) {
                InvalidateForm(ContactForm);
                Contact.$error.userName = true;
            }
            if (Contact.cell && Contact.cell.length > 0) {
                var phoneRegex = new RegExp(/^([\+][0-9]{1,3}[\ \.\-])?([\(]{1}[0-9]{2,6}[\)])?([0-9\ \.\-\/]{3,20})((x|ext|extension)[\ ]?[0-9]{1,4})?$/);
                if (!phoneRegex.test(Contact.cell) || Contact.cell.length < 7) {
                    InvalidateForm(ContactForm);
                    Contact.$error.cell = true;
                }
            }
        }
        var InvalidateForm = function (form) {
            form.$valid = false;
            form.$invalid = true;
        }
        
        ///close the nav-bar after redirection
        $rootScope.$broadcast('Close-NavBar');
        ngDialog.closeAll();
    }]);