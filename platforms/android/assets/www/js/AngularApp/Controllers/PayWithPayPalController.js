'use strict';
IlottoApp.controller('PayWithPayPalController', ['$rootScope', '$scope', 'PaymentService', 'localStorageService', 'NotificationService', 'ProductService', 'DataModelsService', 'ngDialog'
    ,
    function ($rootScope, $scope, PaymentService, localStorageService, NotificationService, ProductService, DataModelsService, ngDialog) {
        
        //console.log('$scope', $scope);
        //console.log('$scope.$parent', $scope.$parent);

        ///close the nav-bar after redirection
        $rootScope.$broadcast('Close-NavBar');
    }]);
