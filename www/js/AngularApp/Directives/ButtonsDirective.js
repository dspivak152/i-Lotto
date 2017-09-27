IlottoApp.directive("topbuttons",['$state', '$rootScope', '$window', function ($state, $rootScope, $window) {
    return {
        restrict: "E",
        templateUrl: "Html/Ng-Menus/ButtonsTemplate.html",
        replace: true,
        link: function (scope, element, attrs) {
            scope.userCredentials = typeof $rootScope.userCredentials !== 'undefined' && $rootScope.userCredentials !== null ? $rootScope.userCredentials : scope.localStorageService.get('credentials');
            scope.show = typeof scope.userCredentials !== 'undefined' && scope.userCredentials !== null;
        }
    }
}]);