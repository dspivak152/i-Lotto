'use strict';
IlottoApp.controller('LogInController',
    ['$rootScope', '$scope', '$http', '$Page', '$compile', '$timeout', '$state', '$stateParams', 'LogInService', 'localStorageService', 'NotificationService', 'MenuService', 'ngDialog'
        , function ($rootScope, $scope, $http, $Page, $compile, $timeout, $state, $stateParams, LogInService, localStorageService, NotificationService, MenuService, ngDialog) {

            openFB.init({ appId: '252454821884548' });

            $scope.closeDialogs = function (index) {
                if (index > 10)
                    return void [0];

                setTimeout(function () {
                    ngDialog.closeAll();
                    $scope.closeDialogs(++index)
                }, 150);
            }

            $scope.$Page = $Page.data;
            $scope.title = $scope.$Page.PageTitle ? $scope.$Page.PageTitle : $scope.$Page.Name;
            $scope.LogInService = LogInService;
            $scope.localStorageService = localStorageService;
            $scope.NotificationService = NotificationService;
            $scope.MenuService = MenuService;
            $scope.Renew = false;
            $scope.authWindow;

            $scope.doFBlogin = function () {
                openFB.login(
                    function (response) {
                        if (response.status === 'connected') {
                            $scope.getInfo();
                        } else {
                            console.log('Facebook login failed: ' + response.error);
                        }
                    }, { scope: 'email' });

            }
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

            $scope.credentials = {
                userName: null,
                password: null,
                NewPassword: null,
                NewPasswordAgain: null,
                $error: {
                    userName: { $error: false, required: false },
                    password: { $error: false, required: false },
                    NewPassword: { $error: false, required: false },
                    NewPasswordAgain: { $error: false, required: false },
                },
                facebookLogInStatus: null
            };
            /*Facebook Login*/
            ///do the save/create login
            $scope.fbServerLogin = function () {
                $scope.fbuser.locale = 'logInPage';
                LogInService.LogInFB($scope.fbuser)
                    .success(function (responce) {
                        switch (responce.ExceptionId) {
                            case 0:
                                var credentials = responce.data;
                                credentials.externalLogin = $scope.fbuser.id;
                                localStorageService.add('credentials', credentials);
                                $rootScope.userCredentials = credentials;
                                $state.go("Home");
                                break;
                            case 1:///MembershipIsConfirmed
                            case 2:///MembershipIsConfirmed
                                $scope.NotificationService.Info({ message: responce.message, replaceMessage: true });
                                break;
                            case 3:///password error
                                $scope.NotificationService.Error({ message: responce.message, replaceMessage: true });
                                break;
                            case 4:///UserNotRegisterd
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

            $scope.registerMobileDevice = function (userId) {
                ///login success - save credentials and go to home
                //Getting the registration id from local storage
                var regId = localStorage.registrationId;
                if (regId && regId != '') {
                    //Send the regId to the database
                    LogInService.RegisterUserMobileDeviceId(
                        { UserId: userId, DeviceId: regId, MobileDeviceType: localStorage.deviceType }
                    ).then(function (res) {
                        localStorage.removeItem('IsNewRegistrationId');
                    });
                }
            }

            $scope.login = function (loginForm, credentials) {
                localStorageService.remove('credentials');
                Validate(loginForm, credentials);
                if (loginForm.$invalid || !loginForm.$valid)
                    return void [0];

                if ($scope.Renew)
                    LogInService.ChangePassword(credentials)
                        .then(function (res) {
                            if (res.status && res.data.success) {
                                ///login success - save credentials and go to home
                                localStorageService.add('credentials', res.data.data);
                                $rootScope.userCredentials = res.data.data;
                                $state.go("Home");
                            } else {
                                switch (res.data.ExceptionId) {
                                    case 1:
                                        ///Renew Password
                                        NotificationService.Info({ message: res.data.message, replaceMessage: true });
                                        $scope.Renew = true;
                                        break;
                                    case 2:
                                        ///locked
                                        NotificationService.Error({ message: res.data.message, replaceMessage: true });
                                        break;
                                    case 3:
                                        ///Invalid
                                        NotificationService.Error({ message: res.data.message, replaceMessage: true });
                                        break;
                                    default:
                                        NotificationService.Error({ message: res.data.message, replaceMessage: true });
                                        break;
                                }
                            }
                        });
                else
                    LogInService.LogIn(credentials)
                        .then(function (res) {
                            if (res.status && res.data.success) {
                                $scope.registerMobileDevice(res.data.data.UserId);

                                localStorageService.add('credentials', res.data.data);
                                $rootScope.userCredentials = res.data.data;
                                $state.go("Home");
                            } else {
                                switch (res.data.ExceptionId) {
                                    case 1:
                                        ///Renew Password
                                        NotificationService.Info({ message: res.data.message, replaceMessage: true });
                                        $scope.Renew = true;
                                        break;
                                    case 2:
                                        ///locked
                                        NotificationService.Error({ message: res.data.message, replaceMessage: true });
                                        break;
                                    case 3:
                                        ///Invalid
                                        NotificationService.Error({ message: res.data.message, replaceMessage: true });
                                        break;
                                    default:
                                        NotificationService.Error({ message: res.data.message, replaceMessage: true });
                                        break;
                                }
                            }
                        });
            };

            var Validate = function (loginForm, credentials) {
                credentials.$error = {
                    userName: { $error: false, required: false },
                    password: { $error: false, required: false },
                    NewPassword: { $error: false, required: false },
                    NewPasswordAgain: { $error: false, required: false, Matc: false },
                };
                if (!credentials.userName || credentials.userName == '') {
                    credentials.$error.userName.$error = true;
                    credentials.$error.userName.required = true;
                    InvalidateForm(loginForm);
                }
                if (!credentials.password || credentials.password == '') {
                    credentials.$error.password.$error = true;
                    credentials.$error.password.required = true;
                    InvalidateForm(loginForm);
                }
                if ($scope.Renew && (!credentials.NewPassword || credentials.NewPassword == '')) {
                    credentials.$error.NewPassword.$error = true;
                    credentials.$error.NewPassword.required = true;
                    InvalidateForm(loginForm);
                }
                if ($scope.Renew && (!credentials.NewPasswordAgain || credentials.NewPasswordAgain == '')) {
                    credentials.$error.NewPasswordAgain.$error = true;
                    credentials.$error.NewPasswordAgain.required = true;
                    InvalidateForm(loginForm);
                }
                if ($scope.Renew && (credentials.NewPassword !== credentials.NewPasswordAgain)) {
                    credentials.$error.NewPasswordAgain.$error = true;
                    credentials.$error.NewPasswordAgain.Matc = true;
                    InvalidateForm(loginForm);
                }
            }
            var InvalidateForm = function (form) {
                form.$valid = false;
                form.$invalid = true;
            }

            $scope.googleLogin = function () {
                window.plugins.googleplus.login(
                    {
                        //'scopes': '... ', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
                        //'webClientId': '994611551395-30p2uhl1thoci46a73lka9m6t10jkufr.apps.googleusercontent.com',
                        'webClientId': '994611551395-30p2uhl1thoci46a73lka9m6t10jkufr.apps.googleusercontent.com',
                        // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
                        'offline': true, // optional, but requires the webClientId - if set to true the plugin will also return a serverAuthCode, which can be used to grant offline access to a non-Google server
                    },
                    function (obj) {
                        $scope.GoogleSineIn(obj)
                    },
                    function (msg) {
                        console.log('error: ', msg);
                        LogInService.WriteLogAction(msg.toString());
                        // .then(function (res) {
                        //     var responce = res.data;
                            
                        // });
                        //$scope.NotificationService.Error({ message: 'התרחשה תקלה חמורה, אנא נסה שנית מאוחר יותר.', replaceMessage: true });
                        $scope.NotificationService.Error({ message: msg.toString(), replaceMessage: true, delay: 9000 });
                    }
                );
            }

            $scope.GoogleSineIn = function (googleUser) {
                var loginGoogleUser = {
                    id: googleUser.userId,
                    first_name: googleUser.givenName,
                    last_name: googleUser.familyName,
                    link: googleUser.imageUrl,
                    email: googleUser.email,
                    gender: null,
                    locale: 'LogInPage',
                    faceBookToken: null,
                };

                LogInService.loginGoogleUser(loginGoogleUser)
                    .then(function (res) {
                        var responce = res.data;
                        switch (responce.ExceptionId) {
                            case 0:
                                $scope.registerMobileDevice(responce.data.UserId);
                                var credentials = responce.data;
                                credentials.externalLogin = googleUser.id;
                                localStorageService.add('credentials', credentials);
                                $rootScope.userCredentials = credentials;
                                $state.go("Home");
                                break;
                            case 1:///MembershipIsConfirmed
                            case 2:///MembershipIsConfirmed
                                $scope.NotificationService.Info({ message: responce.message, replaceMessage: true });
                                break;
                            case 3:///password error
                                $scope.NotificationService.Error({ message: responce.message, replaceMessage: true });
                                break;
                            case 4:///UserNotRegisterd
                                $scope.NotificationService.Primary({ message: responce.message, replaceMessage: true });
                                break;
                            default:
                                $scope.NotificationService.Error({ message: responce.message, replaceMessage: true });
                                break;
                        }
                    });
            }

            ///close the nav-bar after redirection
            $rootScope.$broadcast('Close-NavBar');
            $scope.closeDialogs(0);
        }]);