IlottoApp.directive('modal', function ($rootScope, ModalServic, MenuService, localStorageService) {
    return {
        restrict: 'E',
        templateUrl: 'Html/Ng-Dialog/Inline.Show-Form.html',
        //transclude: true,
        replace: true,
        //scope: {
        //    modalData: "="
        //},
        //scope:false,
        link: function (scope, element, attrs) {
            console.log(scope.modalData);
        }
    };
});