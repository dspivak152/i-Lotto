var IlottoApp = angular.module("IlottoApp", ['ngSanitize', 'ngAnimate', 'ui.router', 'LocalStorageModule', 'ui-notification', 'ngDialog', 'ui.bootstrap']);

///config $http to broadcast global events - d
IlottoApp.config(function ($httpProvider, $provide) {
    $provide.factory('httpInterceptor', function ($q, $rootScope) {
        return {
            'request': function (config) {
                // intercept and change config: e.g. change the URL
                // config.url += '?nocache=' + (new Date()).getTime();
                // broadcasting 'httpRequest' event
                $rootScope.$broadcast('httpRequest', config);
                return config || $q.when(config);
            },
            'response': function (response) {
                // we can intercept and change response here...
                // broadcasting 'httpResponse' event
                $rootScope.$broadcast('httpResponse', response);
                return response || $q.when(response);
            },
            'requestError': function (rejection) {
                // broadcasting 'httpRequestError' event`
                $rootScope.$broadcast('httpRequestError', rejection);
                return $q.reject(rejection);
            },
            'responseError': function (rejection) {
                // broadcasting 'httpResponseError' event
                $rootScope.$broadcast('httpResponseError', rejection);
                return $q.reject(rejection);
            }
        };
    });
    $httpProvider.interceptors.push('httpInterceptor');
});
///config angular router
IlottoApp.config(['$locationProvider', '$stateProvider', '$urlRouterProvider', function ($locationProvider, $stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('Home', {
            url: "/",
            templateUrl: "Html/Home.html",
            controller: "HomeController",
            resolve: {
                $Page: ['MenuService', '$stateParams', function (MenuService, $stateParams) {
                    return MenuService.GetPage(1025);
                }],
                $NextRaffle: ['ProductService', '$stateParams', function (ProductService, $stateParams) {
                    return ProductService.GetNextRaffle();
                }]
            }
        })
        .state('LogIn', {
            url: "/login",
            templateUrl: "Html/LogIn.html",
            controller: "LogInController",
            resolve: {
                $Page: ['MenuService', '$stateParams', function (MenuService, $stateParams) {
                    return MenuService.GetPage(2036);
                }]
            }
        })
        .state('ContactUs', {
            url: "/contact-us",
            templateUrl: "Html/ContactUs.html",
            controller: "ContactUsController",
            resolve: {
                $Page: ['MenuService', '$stateParams', function (MenuService, $stateParams) {
                    return MenuService.GetPage(2052);
                }]
            }
        })
        .state('ForgotPassword', {
            url: "/forgot-password",
            templateUrl: "Html/ForgotPassword.html",
            controller: "ForgotPasswordController",
            resolve: {
                $Page: ['MenuService', '$stateParams', function (MenuService, $stateParams) {
                    return MenuService.GetPage(2033);
                }]
            }
        })
        .state('Register', {
            url: "/register",
            templateUrl: "Html/Register.html",
            controller: "RegisterController"
        })
        .state('Update', {
            url: "/update-details",
            templateUrl: "Html/Update-details.html",
            controller: "UpdateDetailsController",
            resolve: {
                $User: [function () {
                    return '';
                }],
                $Message: [function () {
                    return '';
                }]
            }
        })
        .state('ConfirmUser', {
            url: "/confirm-user/{Token}",
            templateUrl: "Html/Update-details.html",
            controller: "UpdateDetailsController",
            resolve: {
                $User: ['LogInService', '$stateParams', function (LogInService, $stateParams) {
                    return LogInService.GetUserFromConfirmationToken($stateParams.Token);
                }],
                $Message: ['MenuService', function (MenuService) {
                    return MenuService.GetTranslation("Fatal Error, Cant Validate User.", "Update-details.html");
                }]
            }
        })
        .state('Page', {
            url: "/page/{PageId:[0-9]{1,10}}",
            templateUrl: "Html/Pages.html",
            controller: "PagesController",
            resolve: {
                $Page: ['MenuService', '$stateParams', function (MenuService, $stateParams) {
                    return MenuService.GetPage($stateParams.PageId);
                }]
            }
        })
        .state('Financial', {
            abstract: true,
            url: "/Financial",
            template: "<ui-view></ui-view>",
        })
        .state('Financial.Withdrawal', {
            url: "/Withdrawal",
            templateUrl: "Html/Financial.Withdrawal.html",
            controller: "WithdrawalController",
            resolve: {
                $Page: ['MenuService', '$stateParams', function (MenuService, $stateParams) {
                    $stateParams.Type = 'Withdrawal'
                    return MenuService.GetPage(1029);
                }]
            }
        })
        .state('Financial.Deposit', {
            url: "/Deposit",
            templateUrl: "Html/Financial.Deposit.html",
            controller: "DepositController",
            resolve: {
                $Page: ['MenuService', '$stateParams', function (MenuService, $stateParams) {
                    $stateParams.Type = 'Deposit'
                    return MenuService.GetPage(1030);
                }]
            }
        })
        .state('Product', {
            abstract: true,
            url: "/product",
            template: "<ui-view></ui-view>",
        })
        .state('Product.form', {
            url: "/{ProdId:[0-9]{1,10}}",
            templateUrl: "Html/Product.html",
            controller: "ProductController",
            resolve: {
                $Page: ['ProductService', '$stateParams', function (ProductService, $stateParams) {
                    return ProductService.GetProduct($stateParams.ProdId);
                }]
            }
        })
        .state('Product.FormSummery', {
            url: "/FormSummery",
            templateUrl: "Html/Product.FormSummery.html",
            controller: "ProductSummeryController",
            resolve: {
                $RufflesList: ['ProductService', '$stateParams', function (ProductService, $stateParams) {
                    return ProductService.RequesRuffles();
                }],
                $ProductForm: ['ProductService', '$stateParams', function (ProductService, $stateParams) {
                    return ProductService.getProductForm();
                }],
                $$NextRaffle: ['ProductService', function (ProductService) {
                    return ProductService.GetRafflePopup();
                }]
            }
        })
        .state('Product.Payment', {
            url: "/Payment",
            templateUrl: "Html/Product.Payment.html",
            controller: "ProductPaymentController",
            resolve: {
                $ProductForm: ['ProductService', '$stateParams', function (ProductService, $stateParams) {
                    return ProductService.getProductForm();
                }]
            }
        })
        .state('PersonalArea', {
            url: "/Personal-Area",
            templateUrl: "Html/PersonalArea.html",
            controller: "PersonalAreaController",
            resolve: {
                $FormsSettings: ['ProductService', '$stateParams', function (ProductService, $stateParams) {
                    return ProductService.GetFormSettingsModel()
                }]
            }
        })
        .state('SweepstakesArchive', {
            url: "/Sweepstakes-Archive",
            templateUrl: "Html/Sweepstakes.Archive.html",
            controller: "SweepstakesArchiveController",
            resolve: {
                $Raffles: ['PersonalAreaService', '$stateParams', function (PersonalAreaService, $stateParams) {
                    return PersonalAreaService.GetSweepstakes();
                }]
            }
        });
    
}]);
// Handle global LINK click
IlottoApp.directive('a', function () {
    return {
        restrict: 'E',
        link: function (scope, elem, attrs) {
            if (attrs.ngClick || attrs.href === '' || attrs.href === '#') {
                elem.on('click', function (e) {
                    e.preventDefault(); // prevent link click for above criteria
                });
            }
        }
    };
});
// Handle login state globaly
IlottoApp.run(['$rootScope', '$location', 'localStorageService', 'LogInService', '$state', 'NotificationService'
    , function ($rootScope, $location, localStorageService, LogInService, $state, NotificationService) {
        $rootScope.state = $state;
        ///set $rootScope.$location
        $rootScope.$location = $location;
        
        // $rootScope.baseUrl = $location.$$host === 'localhost' ? 'http://localhost:20765/' : 'http://www.api.ilotto.co.il/';
        $rootScope.baseUrl = 'http://www.testapi.ilotto.co.il/';
        $rootScope.$imageUrl = 'http://www.test.ilotto.co.il/';

        $rootScope.ValidateDate = function (responseModel) {
            if (!responseModel || responseModel == '' || !responseModel.GetDataDate
                || responseModel.GetDataDate == '' || !responseModel.data || responseModel.data == '')
                return true;
            var aux = responseModel.GetDataDate.split(/[/\/]/);
            var vdate = new Date(aux[2], aux[1] - 1, aux[0]);

            var targetDate = new Date();
            targetDate.setDate(targetDate.getDate() - 14);

            return targetDate >= vdate;
        }

        var broadcast = function () {
            $rootScope.$broadcast('start-login');
        };
        var FatalError = function () {
            $.blockUI({
                message: $('#FatalErrorContainer'),
                timeout: 30000, ///30 second timeout
                css: {
                    border: 'none',
                    padding: '15px 5px',
                    backgroundColor: '#000',
                    '-webkit-border-radius': '10px',
                    '-moz-border-radius': '10px',
                    opacity: .5,
                    color: '#fff'
                }
            });
        };
        var RefreshPage = function () {
            var REFRESH = false;
            var Params = $rootScope.$location.search();
            if (!Params || !Params.Error) {
                $rootScope.$location.search('Error', 1);
                REFRESH = true;
            } else {
                var ERROR_NUMBER = parseInt(Params.Error);
                ERROR_NUMBER++;
                if (ERROR_NUMBER < 5) {
                    $rootScope.$location.search('Error', ERROR_NUMBER);
                    REFRESH = true;
                } else {
                    var Messege = 'Thers An Error Running The App, Please Try Again Later Or Contact The App Manager!'
                    NotificationService.Error({ message: Messege, replaceMessage: true, delay: 9500 }, FatalError);
                }
            }

            if (REFRESH) {
                window.location.reload(false);
            }
        };
        ///check login state
        $rootScope.checkCredentials = function () {
            $rootScope.userCredentials = localStorageService.get('credentials');
            $rootScope.$LogInState = $rootScope.userCredentials !== null && $rootScope.userCredentials.UserId > 0;
        }
        ///after content loaded check login state, DOTO->> fix multiple fire on product page
        $rootScope.$on('$viewContentLoaded', function (event) {
            $rootScope.checkCredentials();

            var OpenStates = ['ContactUs', 'LogIn', 'Register', 'ForgotPassword', 'Page', 'ConfirmUser', null, ''];
            ///if in Open States return
            if (OpenStates.indexOf($state.current.name) > -1)
                return;
            ///check login state on every entry to controller
            if (!$rootScope.userCredentials) {
                $state.current.name !== 'Home' ? broadcast(): null;
                return;
            }

            //validate the login state
            LogInService.Validate($rootScope.userCredentials)
                .then(function (res) {
                    var responce = res.data;
                    if (!responce.success) {
                        $rootScope.$LogInState = false;
                        NotificationService.Error({ message: responce.message }, broadcast);
                    } else {
                        $rootScope.userCredentials.FullName = responce.data.FullName;
                        $rootScope.userCredentials.UserName = responce.data.UserName;
                        $rootScope.userCredentials.current = responce.data.current;
                        $rootScope.userCredentials.userObligo = responce.data.userObligo;
                        $rootScope.userCredentials.userValue = responce.data.userValue;
                        $rootScope.userCredentials.ConfirmationToken = responce.data.user.ConfirmationToken;
                        $rootScope.userCredentials.UseCreditToken = responce.data.user.UseCreditToken;
                        $rootScope.userCredentials.CreditNumber =
                            responce.data.user.CreditNumber != null && responce.data.user.CreditNumber.length > 1 ?
                            '****-****-****-' + responce.data.user.CreditNumber : null;
                        localStorageService.set('credentials', $rootScope.userCredentials);
                        $rootScope.$LogInState = true;
                    }
                });
        });
        ///go to log in page if not connected (run on avery page in app)
        $rootScope.$on('start-login', function (event, args) {
            $state.go("LogIn");
        });

        ///$rootScope.$broadcast gloabl ajax listeners
        $rootScope.$on('httpRequest', function (event, args) {
            if (typeof $rootScope.BlockCounter == 'undefined')
                $rootScope.BlockCounter = 0;
            $rootScope.BlockCounter++;
            $.blockUI({
                message: '<p><div id="ProcessingContainer" style="cursor: default;direction:rtl;"><h3 style="margin:20px 0px;">הדף בטעינה...</h3></div></p>',
                fadeIn: 800,
                fadeOut: 700,
                css: {
                    border: 'none',
                    padding: '15px 10px',
                    backgroundColor: '#000',
                    '-webkit-border-radius': '10px',
                    '-moz-border-radius': '10px',
                    opacity: .8,
                    color: '#fff',
                    width: '35%',
                    left: '30%'
                }
            });
        });
        $rootScope.$on('httpResponse', function (event, args) {
            if (typeof $rootScope.BlockCounter == 'undefined')
                $rootScope.BlockCounter = 1;
            $rootScope.BlockCounter--;
            if ($rootScope.BlockCounter <= 0) {
                $rootScope.BlockCounter = 0;
                $.unblockUI();
            }
        });
        $rootScope.$on('httpRequestError', function (event, args) {
            if (typeof $rootScope.BlockCounter == 'undefined')
                $rootScope.BlockCounter = 1;
            $rootScope.BlockCounter--;
            if ($rootScope.BlockCounter <= 0) {
                $rootScope.BlockCounter = 0;
                $.unblockUI();
            }
            ///show error Msg
            var Message = args.data.ExceptionMessage ? args.data.ExceptionMessage : args.data.Message ? args.data.Message : args.statusText;
            NotificationService.Error({ message: Message, replaceMessage: true, delay: 2500 }, RefreshPage);
        });
        $rootScope.$on('httpResponseError', function (event, args) {
            if (typeof $rootScope.BlockCounter == 'undefined')
                $rootScope.BlockCounter = 1;
            $rootScope.BlockCounter--;
            if ($rootScope.BlockCounter <= 0) {
                $rootScope.BlockCounter = 0;
                $.unblockUI();
            }
            ///show error Msg
            var Message = args.data.ExceptionMessage ? args.data.ExceptionMessage : args.data.Message ? args.data.Message : args.statusText;
            NotificationService.Error({ message: Message, replaceMessage: true, delay: 2500 }, RefreshPage);
        });

        ///Fix for navbar: close navbar after load
        $rootScope.$on('Close-NavBar', function (event, args) {
            $('body, html').removeClass("right-nav-open").removeClass("left-nav-open");
        });

        window.NotificationService = NotificationService;
        
}]);
$(function () {
    /*
    # =============================================================================
    #   Mobile Nav
    # =============================================================================
    */
    $(document).on('click', '.navbar-toggle', function () {
        return $('body, html').toggleClass("left-nav-open");
    });
});