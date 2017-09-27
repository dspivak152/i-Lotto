'use strict';
IlottoApp.controller('ShowFormController', ['$rootScope', '$scope', 'localStorageService', 
    function ($rootScope, $scope, localStorageService) {
        $scope.FormMessagesModel = angular.copy($scope.$parent.FormMessagesModel);

        ///close the nav-bar after redirection
        $rootScope.$broadcast('Close-NavBar');
    }]);
