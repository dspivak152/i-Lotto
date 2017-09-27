'use strict';
IlottoApp.controller('SweepstakesArchiveController', ['$rootScope', '$scope', '$Raffles', 'PersonalAreaService', '$state', '$stateParams', 'LogInService', 'localStorageService', 'NotificationService', 'MenuService', 'DataModelsService', 'ngDialog', 'ProductService',
    function ($rootScope, $scope, $Raffles, PersonalAreaService, $state, $stateParams, LogInService, localStorageService,
        NotificationService, MenuService, DataModelsService, ngDialog, ProductService) {

        function convertDate(inputFormat, addTime) {
            function pad(s) { return (s < 10) ? '0' + s : s; }
            function year(y) {
                return y > 2000 ? y.toString().replace('20', '') : y.toString().split('').splice(2, 2).join('')
                "69";
            }
            var d = new Date(inputFormat);
            if (d == 'Invalid Date') {
                var a = inputFormat.split(/[^0-9]/);
                d = new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5]);
            }

            d.setHours(d.getHours() - 3);
            var retDate = [pad(d.getDate()), pad(d.getMonth() + 1), year(d.getFullYear())].join('/');
            if (addTime) retDate = [pad(d.getHours()), pad(d.getMinutes())].join(':') + ' ' + retDate;
            return retDate;
        }

        $scope.LogInService = LogInService;
        $scope.localStorageService = localStorageService;
        $scope.NotificationService = NotificationService;
        $scope.MenuService = MenuService;
        $scope.Raffles = $.grep($Raffles.data, function (r) {
            return r.Numbers != null && r.Numbers.length > 0
        });
        $scope.Raffles.filter(function (r) {
            r.RaffledateFormat = convertDate(r.Raffledate, true);
        });
        $scope.userCredentials = localStorageService.get('credentials');

        var CheckIfHaveValue = function ($item) {
            return $item !== null && $item !== undefined && $item !== 'undefined'
                && $item !== '';
        }
        var SplitToIntArray = function (numbers) {
            if (typeof numbers == 'undefined' || numbers == null)
                return new Array();

            var NumArray = numbers.split(',');
            for (var i in NumArray) {
                NumArray[i] = parseInt(NumArray[i]);
            }
            return NumArray;
        }
        var SplitToSortArray = function (numbers) {
            var NumArray = new Array();
            if (typeof numbers == 'undefined' || numbers == null || numbers == '')
                return NumArray;

            numbers = numbers.split(',');
            for (var i in numbers) {
                NumArray.push(parseInt(numbers[i]))
            }
            return NumArray.length > 0 ?
                NumArray.sort(function (a, b) {
                    return b - a;//return a - b;
                }) : NumArray;
        }

        ///pager
        $scope.$Pager = {
            PageSize: 12,
            PageNumber: 1,
            Counter: 0,
            MaxPages: 0,
            pagerList: []
        }

        $scope.ShowRaffle = function (raffle) {
            $scope.Raffle = raffle;

            ngDialog.open({
                template: '/Html/Ng-Dialog/OpenRaffle.html',
                scope: $scope,
                backdrop: 'static',
                showClose: true
            });
        }

        $scope.openModal = function (raffle, Raffles) {
            if (typeof raffle.showModal === 'undefined') {
                raffle.showModal = false;
                $scope.setRaffle(raffle);
            }

            raffle.showModal = !raffle.showModal;

            $.map(Raffles, function (item) {
                if (typeof item.showModal !== 'undefined' && item.ID !== raffle.ID) {
                    item.showModal = false;
                }
            })
        };

        $scope.setRaffle = function (raffle) {
            if (typeof raffle == 'object' && raffle !== null) {

                if (raffle.RegSum) {
                    raffle.RegSum = Math.abs(raffle.RegSum / 1000000);
                }

                if (raffle.DoubleSum) {
                    raffle.DoubleSum = Math.abs(raffle.DoubleSum / 1000000);
                }

                if (CheckIfHaveValue(raffle.Numbers)) {
                    raffle.Numbers = SplitToSortArray(raffle.Numbers);
                }
                else {
                    raffle.Numbers = new Array();
                }
                if (CheckIfHaveValue(raffle.Strong)) {
                    raffle.Strong = SplitToSortArray(raffle.Strong);

                }
                else {
                    raffle.Strong = new Array();
                }
                if (CheckIfHaveValue(raffle.ExtraNumbers)) {
                    raffle.ExtraNumbers = SplitToIntArray(raffle.ExtraNumbers);
                    raffle.ExtraNumbers.reverse();
                }
                else {
                    raffle.ExtraNumbers = new Array();
                }
            }
        }
        
        $scope.$Pager.Counter = $scope.Raffles.length;
        $scope.$Pager.MaxPages = Math.ceil($scope.Raffles.length / $scope.$Pager.PageSize);
        
        for (var i = 0; i <= $scope.$Pager.MaxPages; i++)
            $scope.$Pager.pagerList.push(i + 1);
        
        ///close the nav-bar after redirection
        $rootScope.$broadcast('Close-NavBar');
        ngDialog.close();
    }]);
