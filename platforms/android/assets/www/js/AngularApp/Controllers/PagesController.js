'use strict';
IlottoApp.controller('PagesController', ['$rootScope', '$scope', '$Page', '$http', '$compile', '$timeout', '$state', '$stateParams', 'LogInService', 'localStorageService', 'NotificationService', 'MenuService', 'ngDialog',
    function ($rootScope, $scope, $Page, $http, $compile, $timeout, $state, $stateParams, LogInService, localStorageService, NotificationService, MenuService, ngDialog) {
        
        $scope.$Page = $Page.data;
        if ($scope.$Page == null) {
            NotificationService.Error({ message: "Fatal Eror In Page!", replaceMessage: true, delay: 2550 }, $state.go("Home"));
        }

        $scope.title = $scope.$Page.PageTitle ? $scope.$Page.PageTitle : $scope.$Page.Name;
        $scope.LogInService = LogInService;
        $scope.localStorageService = localStorageService;
        $scope.NotificationService = NotificationService;
        $scope.MenuService = MenuService;
        $scope.$Domain = $rootScope.$imageUrl;

        var SetImages = function (String) {
            if (typeof String !== 'string')
                return String;

            return String.replace(/\/UserContent/g, $rootScope.$imageUrl+'/UserContent');
        }
        var SetShow = function (Item,ItemName) {
            $scope.$Page['show-' + ItemName] = (Item !== null && Item !== '' && Item.toString().length > 1);
        }

        var cleanEmpty = function (item) {
            if (typeof item !== 'string')
                return item;
            for (var i = 0; i < 3; i++)
                item = item.replace(/<[^\/>][^>]*><\/[^>]+>|<[^\/>][^>]*>&nbsp;<\/[^>]+>/igm, '').replace(/^[\s\t]*(\r\n|\n|\r)/gm, '');
            return item;
        }

        var broadcastHome = function () {
            $state.go("Home");
        };
        ///return to home page if page is not active
        if (!$scope.$Page.Active)
            broadcastHome();
        
        $scope.setUpPage = function (page) {
            ///check if to show each item in page
            for (var Index in page) {
                SetShow(page[Index], Index);
                page[Index] = SetImages(angular.copy(page[Index]));
            }
        }

        $scope.showA = function (qa) {
            qa.hidden = !qa.hidden;
        }

        $scope.pagesList = new Array();
        MenuService.GetQuestions($scope.$Page.ID)
            .then(function (res) {
                if (res.data.success) {
                    $scope.pagesList = res.data.data;
                    $scope.pagesList.filter(function (p) {
                        $scope.setUpPage(p);
                        p.hidden = true;
                    });
                } else {
                    $scope.pagesList = null;
                }
            });
        
        $scope.setUpPage($scope.$Page);
        ///close the nav-bar after redirection
        $rootScope.$broadcast('Close-NavBar');
        ngDialog.closeAll();
    }]);