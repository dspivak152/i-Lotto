'use strict';
IlottoApp.controller('RegisterController', ['$rootScope', '$scope', '$http', '$state', 'LogInService', 'localStorageService', 'NotificationService', 'MenuService', 'ngDialog'
    ,function ($rootScope, $scope, $http, $state, LogInService, localStorageService, NotificationService, MenuService, ngDialog) {

        openFB.init({ appId: '252454821884548' });

        window.$scope = $scope;
        window.$state = $state;
        $scope.sigein = false;
        $scope.fbuser = {
            id: null,
            first_name: null,
            last_name: null,
            link: null,
            email: null,
            gender: null,
            locale: null,
            faceBookToken: null
        };

        $scope.LogInService = LogInService;
        $scope.localStorageService = localStorageService;
        $scope.NotificationService = NotificationService;
        $scope.MenuService = MenuService;
        $scope.credentials = {
            Name: null,
            userName: null,
            password: null,
            identityNumber: null,
            cell: null,
            confirmRules: null,
            confirm18: null,
            facebookLogInStatus: null,
            $error: {
                Name: { $error: false },
                userName: { $error: false },
                password: { $error: false },
                identityNumber: { $error: false },
                cell: { $error: false },
                confirmRules: { $error: false },
                confirm18: { $error: false },
            }
        };

        /*Facebook Login*/
        $scope.getInfo = function () {
            openFB.api({
                path: '/me',
                success: function (data) {
                    //console.log(data);
                    $scope.fbuser = {
                        id: data.id,
                        first_name: data.first_name,
                        last_name: data.last_name,
                        link: null,
                        email: data.email,
                        gender: null,
                        locale: null,
                        faceBookToken: null
                    };

                    $scope.fbServerLogin();
                },
                error: function (res) {
                    console.log('errorHandler', res);
                }
            });
        }

        $scope.faceBookLogIn = function () {
            openFB.login(
                function (response) {
                    if (response.status === 'connected') {
                        $scope.getInfo();
                    } else {
                        console.log('Facebook login failed: ' + response.error);
                    }
                }, { scope: 'email' });
        }
        ///do the save/create login
        $scope.fbServerLogin = function () {
            $scope.fbuser.locale = 'RegisterPage'
            LogInService.LogInFB($scope.fbuser)
                .success(function (responce) {
                    switch (responce.ExceptionId) {
                        case 0:
                            NotificationService.Success({ message: responce.message }, callback);
                            break;
                        case 1:///UserExist
                            $scope.NotificationService.Error({ message: responce.message, replaceMessage: true });
                            break;
                        case 2:///MembershipIsConfirmed
                            $scope.NotificationService.Primary({ message: responce.message, replaceMessage: true });
                            break;
                        default:
                            $scope.NotificationService.Error({ message: responce.message, replaceMessage: true });
                            break;
                    }
                })
                .error(function (res, status) {
                    console.error('Repos error', status, res);
                });
        }

        var callback = function () {
            $state.go("Home");
        }

        $scope.Register = function () {
            $scope.RegisterForm.$submitted = true;
            ValidateIDNumber();
            ValidatePhone();
            if ($scope.RegisterForm.$invalid)
                return;

            $scope.credentials.Fname = $scope.credentials.Name.indexOf(' ') > 0 ? $scope.credentials.Name.split(' ')[0] : $scope.credentials.Name;
            $scope.credentials.Lname = $scope.credentials.Name.indexOf(' ') > 0 ? $scope.credentials.Name.replace($scope.credentials.Name.split(' ')[0], '') : $scope.credentials.Name;

            LogInService.Register($scope.credentials).then(function (res) {
                if (res.data.success) {
                    NotificationService.Success({ message: res.data.message }, callback);
                } else {
                    NotificationService.Error({ message: res.data.message, replaceMessage: true });
                }
            });
        };
        var ValidatePhone = function () {
            var patt = new RegExp(/^0\d([\d]{0,1})([-]{0,1})\d{7}$/gi);
            $scope.RegisterForm.cell.$setValidity('custom', true);
            if ($scope.RegisterForm.cell.$invalid)
                return void [0];
            $scope.RegisterForm.cell.$setValidity('custom', patt.test($scope.credentials.cell));
        }
        var ValidateIDNumber = function () {
            $scope.RegisterForm.identityNumber.$setValidity('custom', true);
            if ($scope.RegisterForm.identityNumber.$invalid)
                return void [0];

            var IDnum = String($scope.credentials.identityNumber);

            // The number is too short - add leading 0000
            if (IDnum.length < 9) {
                while (IDnum.length < 9) {
                    IDnum = '0' + IDnum;
                }
            }

            // CHECK THE ID NUMBER
            var mone = 0, incNum;
            for (var i = 0; i < 9; i++) {
                incNum = Number(IDnum.charAt(i));
                incNum *= (i % 2) + 1;
                if (incNum > 9)
                    incNum -= 9;
                mone += incNum;
            }
            if (mone % 10 !== 0) {
                $scope.RegisterForm.identityNumber.$setValidity('custom', false);
            }
        }

        $scope.GoogleSineIn = function (googleUser) {
            var loginGoogleUser = {
                id: googleUser.userId,
                first_name: googleUser.givenName,
                last_name: googleUser.familyName,
                link: googleUser.imageUrl,
                email: googleUser.email,
                gender: null,
                locale: 'RegisterPage',
                faceBookToken: null,
            };

            LogInService.loginGoogleUser(loginGoogleUser)
                .then(function (res) {
                    var responce = res.data;
                    switch (responce.ExceptionId) {
                        case 0:
                            NotificationService.Success({ message: responce.message }, callback);
                            break;
                        case 1:///UserExist
                            $scope.NotificationService.Error({ message: responce.message, replaceMessage: true });
                            break;
                        case 2:///MembershipIsConfirmed
                            $scope.NotificationService.Primary({ message: responce.message, replaceMessage: true });
                            break;
                        default:
                            $scope.NotificationService.Error({ message: responce.message, replaceMessage: true });
                            break;
                    }
                });
        }

        $scope.googleLogin = function () {
            window.plugins.googleplus.login(
                {
                    //'scopes': '... ', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
                    'webClientId': '994611551395-30p2uhl1thoci46a73lka9m6t10jkufr.apps.googleusercontent.com',
                    // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
                    'offline': true, // optional, but requires the webClientId - if set to true the plugin will also return a serverAuthCode, which can be used to grant offline access to a non-Google server
                },
                function (obj) {
                    $scope.GoogleSineIn(obj)
                },
                function (msg) {
                    console.log('error: ', msg);
                    $scope.NotificationService.Error({ message: 'התרחשה תקלה חמורה, אנא נסה שנית מאוחר יותר.', replaceMessage: true });
                }
            );
        }
        ///close the nav-bar after redirection
        $rootScope.$broadcast('Close-NavBar');
        ngDialog.closeAll();
    }]);
