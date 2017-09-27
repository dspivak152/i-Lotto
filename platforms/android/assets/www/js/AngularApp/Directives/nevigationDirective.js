IlottoApp.directive("nevigation", function ($state, $rootScope) {
    
    return {
        restrict: "E",
        templateUrl: "Html/Ng-Menus/Headder.html",
        replace: true,
        link: function (scope, element, attrs) {
            scope.$LogInState = $rootScope.$LogInState;
            scope.menuId = attrs.menuId;

            scope.LogOut = function () {
                scope.LogInService.LogOut(scope.localStorageService.get('credentials'));
                scope.localStorageService.remove('credentials');
                $state.go("LogIn");
            };
            scope.$state = $state;
            
            var Menu = scope.localStorageService.get('Menu-' + scope.menuId);

            if ($rootScope.ValidateDate(Menu)) {
                scope.MenuService.GetMenu(scope.menuId)
                .error(function (res) {
                    scope.NotificationService.Error({ message: (res.Message ? res.Message : 'Error On Data Request'), replaceMessage: true }, scope.LogOut);
                })
                .then(function (res) {
                    if (res.status !== 200 || !res.data.success) {///error
                        scope.NotificationService.Error({ message: (res.data.message ? res.data.message : 'Error On Data Request'), replaceMessage: true }, scope.LogOut);
                    } else {///success
                        scope.MenuPages = res.data.data;
                        scope.localStorageService.add('Menu-' + scope.menuId, res.data);
                    }                    
                });
            } else {
                scope.MenuPages = Menu.data;
            }            

        }
    }
});