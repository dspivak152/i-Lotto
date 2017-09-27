IlottoApp.directive("innermenu", function ($state, $rootScope) {

    return {
        restrict: "E",
        templateUrl: "/Html/Ng-Menus/InnerPage-menu.html",
        replace: true,
        link: function (scope, element, attrs) {
            scope.LogOut = function () {
                scope.LogInService.LogOut(scope.localStorageService.get('credentials'));
                scope.localStorageService.remove('credentials');
                $state.go("LogIn");
            };
            scope.$state = $state;
            scope.userCredentials = scope.localStorageService.get('credentials');
        }
    }
});