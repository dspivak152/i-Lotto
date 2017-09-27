'use strict';
IlottoApp.controller('HomeController', ['$rootScope', '$scope', '$Page', '$state', '$stateParams', 'LogInService', 'localStorageService', 'NotificationService',
    'MenuService', 'ProductService', '$NextRaffle', 'ngDialog',
    function ($rootScope, $scope, $Page, $state, $stateParams, LogInService, localStorageService
        , NotificationService, MenuService, ProductService, $NextRaffle, ngDialog) {
        
        $scope.$Page = $Page.data;
        $scope.title = $scope.$Page.PageTitle ? $scope.$Page.PageTitle : $scope.$Page.Name;
        $scope.LogInService = LogInService;
        $scope.localStorageService = localStorageService;
        $scope.NotificationService = NotificationService;
        $scope.MenuService = MenuService;
        
        var ValidateRaffledate = function (NextRaffleData) {
            var date = new Date(NextRaffleData.Raffledate);
            var aux = NextRaffleData.RaffledateFormat.split(/[/\/]/);
            ///year/month/date
            var yt = aux[2].split(' ');
            var vdate = new Date(yt[0], aux[1] - 1, aux[0]);
            vdate.setHours(yt[1].split(':')[0] - 4);
            vdate.setMinutes(yt[1].split(':')[1]);
            var Now = new Date();
            return (Now >= vdate);
        }
        ///local $scope params
        $scope.userCredentials = localStorageService.get('credentials');
        
        $scope.NextRaffle = $NextRaffle.data.data;
        
        ///close the nav-bar after redirection
        $rootScope.$broadcast('Close-NavBar');
        ngDialog.closeAll();
}]);