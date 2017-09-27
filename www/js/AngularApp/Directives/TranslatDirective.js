IlottoApp.directive("translat", function ($state, $rootScope, MenuService, localStorageService) {
    var filterTranslation = function (TranslationModal, $e) {
        TranslationModal.filter(function (trans) {
            if (trans.KyeVal == $e.$keyVal && trans.Path == $e.$keyPath) {
                $e.$element.replaceWith(trans.Value);
            }
        });
    }
    var filterElement = function ($$elements, TranslationModal) {
        $.map($$elements, function ($e) {
            filterTranslation(TranslationModal, $e);
        });
    }
    return {
        restrict: "E",
        replace: true,
        link: function (scope, element, attrs) {
            var Dtime = new Date().getHours();
            if (typeof $rootScope.TransTimer === 'number' && $rootScope.TransTimer < Dtime) {
                $rootScope.TranslationModal = undefined;
                localStorageService.remove('TranslationModal');
            }
            $rootScope.TransTimer = Dtime;
            
            var keyVal = attrs.keyVal;
            var keyPath = attrs.keyPath;
            
            if(typeof $rootScope.$$elements == 'undefined')
                $rootScope.$$elements = new Array();

            if ($rootScope.HavData !== false && (
                    $rootScope.TranslationModal == undefined || $rootScope.TranslationModal == null
                    || (($rootScope.TranslationModal instanceof Array) && $rootScope.TranslationModal.length <= 0)
                )) {
                var Data = localStorageService.get('TranslationModal');
                if (Data != undefined && Data != null && Data.TransTimer === $rootScope.TransTimer) {
                    $rootScope.TranslationModal = Data.Model;
                    $rootScope.HavData = true;
                    $rootScope.TranslationModal.filter(function (trans) {
                        if (trans.KyeVal == keyVal && trans.Path == keyPath) {
                            element.replaceWith(trans.Value);
                        }
                    });
                    return void [0];
                }
                $rootScope.TranslationModal = new Array();
                $rootScope.HavData = false;
                MenuService.GetJsonTrans(new Date().getHours())
                        .then(function (res) {
                            $rootScope.TranslationModal = res.data;
                            $rootScope.HavData = true;
                            localStorageService.set('TranslationModal', { Model: res.data, TransTimer: $rootScope.TransTimer });
                            ///now do the translation
                            filterElement($rootScope.$$elements, res.data);
                        }, function (reason) {
                            console.log('reason', reason);
                            $rootScope.HavData = undefined;
                            $rootScope.$$elements = undefined;
                            $rootScope.TranslationModal = undefined;
                        });
            }

            if ($rootScope.HavData !== true) {
                $rootScope.$$elements.push({
                    $element: element,
                    $keyVal: keyVal,
                    $keyPath: keyPath
                });
            } else {
                $rootScope.TranslationModal.filter(function (trans) {
                    if (trans.KyeVal == keyVal && trans.Path == keyPath) {
                        element.replaceWith(trans.Value);
                    }
                });
            }
                        
            //var KyeVal = attrs.keyVal;
            //var Path = attrs.keyPath;

            /*
            var transType = typeof attrs.transType !== 'undefined' ? attrs.transType : '';
            
            var TranslationModal = scope.localStorageService.get('TranslationModal');
            if (TranslationModal == undefined) {
                TranslationModal = new Array();
            }
            var translation = null;
            TranslationModal.filter(function (trans) {
                if (!$rootScope.ValidateDate(trans) && trans.data.KyeVal == KyeVal && trans.data.Path == Path) {
                    translation = trans.data.Value;
                    element.replaceWith(trans.data.Value);                 
                }
            });
            
            if (!translation || translation == '') {///no valid key in the scope -> get key from server
                MenuService.GetTranslation(KyeVal, Path)
                    .then(function (res) {
                        var Modal = scope.localStorageService.get('TranslationModal');
                        if (Modal == undefined) {
                            Modal = new Array();
                        }
                        Modal.push(res.data);
                        scope.localStorageService.add('TranslationModal', Modal);
                        element.replaceWith(res.data.data.Value);
                    });
            }
            */
            
        }
    }
});

