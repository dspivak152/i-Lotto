'use strict';
IlottoApp.controller('FormSelectionController', ['$rootScope', '$scope', 'LogInService', 'localStorageService', 'NotificationService', 'ProductService', 'DataModelsService', 'ngDialog',
    function ($rootScope, $scope, LogInService, localStorageService, NotificationService, ProductService, DataModelsService, ngDialog) {
        $scope.FormMessagesModel = angular.copy($scope.$parent.FormMessagesModel);
        
        ///close the nav-bar after redirection
        $rootScope.$broadcast('Close-NavBar');
    }]);
