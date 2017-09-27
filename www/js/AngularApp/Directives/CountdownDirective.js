IlottoApp.directive("countdown", function ($state, $rootScope, $timeout) {
    return {
        restrict: "E",
        replace: true,
        scope: {
            target: '@targetDate'
        },
        templateUrl: "Html/Ng-Menus/Ng-Countdown.html",
        link: function (scope, element, attrs) {
            scope.eventDay = new Date(scope.target.replace(/-/g, '/').replace(/T/g, ' '));
            scope.timeTillEvent = {};
            
            var updateClock = function () {
                scope.seconds = (scope.eventDay - new Date()) / 1000;
                
                scope.timeTillEvent = {
                    daysLeft: parseInt(scope.seconds / 86400) > 9 ? parseInt(scope.seconds / 86400) : '0' + (parseInt(scope.seconds / 86400)).toString(),
                    hoursLeft: parseInt(scope.seconds % 86400 / 3600) > 9 ? parseInt(scope.seconds % 86400 / 3600) : '0' + (parseInt(scope.seconds % 86400 / 3600)).toString(),
                    minutesLeft: parseInt(scope.seconds % 86400 % 3600 / 60) > 9 ? parseInt(scope.seconds % 86400 % 3600 / 60) : '0' + (parseInt(scope.seconds % 86400 % 3600 / 60)).toString(),
                    secondsLeft: parseInt(scope.seconds % 86400 % 3600 % 60)
                }
            };
            var StartInterval = function(){
                setInterval(function () {
                    scope.$apply(updateClock);
                }, 1000);

                updateClock();
            }
            var Deley4Data = function () {
                $timeout(function () {
                    if (scope.target && scope.target != '') {
                        scope.eventDay = new Date(scope.target);
                        StartInterval();
                    } else {
                        Deley4Data();
                    }
                }, 500);
            }
            
            if (scope.target && scope.target != '') {
                StartInterval();
            } else {
                Deley4Data();
            }
        }
    }
});

