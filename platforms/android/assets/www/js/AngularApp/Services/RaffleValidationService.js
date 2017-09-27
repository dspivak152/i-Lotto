(function () {
    'use strict';

    angular.module('IlottoApp').service('RaffleValidationService', ['localStorageService', 'ProductService', '$timeout', '$interval', '$state',
        function (localStorageService, ProductService, $timeout, $interval, $state) {

        return { Initialize: Initialize };

        function Initialize(scope) {
            //localStorageService.get('$$NextRaffle');
            //ProductService.GetNextRaffle();
            scope.$$NextRaffle = localStorageService.get('$$NextRaffle');
            window.$R = scope.$$NextRaffle;
            window.$S = $state;
            window.scope = scope;
            //$S.current.name
            //$state.current.name


            //localStorageService.bind($rootScope, '$$NextRaffle', $scope.NextRaffle);
            //var index = 10, stop = $interval(function () {
            //    console.log($rootScope.$$credentials);
            //    index--;
            //    if(index <= 0)
            //        $interval.cancel(stop);
            //}, 500);

        }
    }]).run(function ($rootScope, RaffleValidationService) {
        RaffleValidationService.Initialize($rootScope);
    });

})();