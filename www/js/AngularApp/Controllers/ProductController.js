'use strict';
IlottoApp.controller('ProductController', ['$rootScope', '$scope', '$Page', '$state', '$stateParams', 'LogInService', 'localStorageService', 'NotificationService', 'MenuService', 'ProductService', '$q', 'ngDialog', 'DataModelsService',
    '$anchorScroll', '$location', '$timeout',
    function ($rootScope, $scope, $Page, $state, $stateParams, LogInService, localStorageService, NotificationService, MenuService, ProductService, $q, ngDialog, DataModelsService, $anchorScroll, $location, $timeout) {
        
        ///internal usage functions
        var CombineImageUrl = function (imageUrl) {
            return $rootScope.$imageUrl + (imageUrl.indexOf('/') == 0 ? imageUrl.substring(1) : imageUrl);
        }
        var ResetForm = function () {
            $state.transitionTo($state.current, $stateParams, {
                reload: true,
                inherit: false,
                notify: true
            });
        };
        var RandomBetween = function (Max, Min) {
            if (isNaN(Max))
                Max = 10;
            if (isNaN(Min))
                Min = 1;
            return Math.floor(Math.random() * Max) + Min
        };
        var JoinArray = function (Array) {
            if (typeof Array == 'undefined' || !Array || Array.length <= 0)
                return '';
            return Array.join(',');
        };
        var broadcastHome = function () {///REMOVE ALL STORED DATA ANG GO TO HOME TO RE-START
            localStorageService.remove('FormsSettingsModel');
            localStorageService.remove('FormMessagesModel');
            localStorageService.remove('SavedPageForMony');
            localStorageService.remove('NextRaffle');
            $state.go("Home");
        };
        var NumbertToOptions = function (num) {
            var _array = new Array();
            for (var i = 1; i < num && i < 9; i++)
                _array.push({ id: i, name: i });
            for (var i = 16; i < num; i = i + 16)
                _array.push({
                    id: i,
                    name: 'Months_' + (i / 8), KyeVal: 'Months'
                });

            _array.filter(function (m) {
                if (m.KyeVal !== undefined) {
                    m.name = $scope.FormMessagesModel[m.name];
                }                   
            });
            return _array
        };

        ///$scope params set up
        $scope.$Page = $Page.data;
        $scope.title = $scope.$Page.PageTitle ? $scope.$Page.PageTitle : $scope.$Page.Name;
        $scope.LogInService = LogInService;
        $scope.localStorageService = localStorageService;
        $scope.NotificationService = NotificationService;
        $scope.MenuService = MenuService;
        ///local $scope params
        $scope.userCredentials = localStorageService.get('credentials');
        var TranslationModal = localStorageService.get('TranslationModal');
        var Header = '', HeadNumber = 0;
        switch ($scope.$Page.ID) {
            case 1018:
            case 1019:
                Header = "בחר כמות טבלאות";
                HeadNumber = 1;
                break;
            case 1020:
            case 1021:
                Header = "בחר כמות ניחושים";
                HeadNumber = 2;
                break;
            case 1022:
            case 1023:
                Header = "בחר כמות מספרים חזקים";
                HeadNumber = 3;
                break;
        }
        $scope.LocalNames = {
            formSettingsHeader: Header,
            HeaderNumber: HeadNumber,
        };

        ///select number/type of form pop up - cant close b-4 selecting
        $scope.OpenSelctionPop = function () {
            if($rootScope.BlockCounter > 0){
                $timeout($scope.OpenSelctionPop, 75);
                return void [0];
            }
            ngDialog.open({
                template: 'Html/Ng-Dialog/Select-Form-Option.html',
                controller: 'FormSelectionController',
                scope: $scope,
                backdrop: 'static',
                showClose: false
            });
        };
        
        ///get error message
        var getMessage = function (type, length, max) {
            var message = '';
            var dif = max - length;
            ///regolar numbers
            if (type === 1) {
                if (dif < 0) {
                    dif = dif * (-1);
                    message = 'נבחרו יותר מדי מספרים, יש להסיר number בחירות'.replace('number', dif);
                }
                if (dif == 1) {
                    message = 'יש לבחור עוד מספר אחד';
                } else {
                    message = 'יש לבחור עוד number מספרים'.replace('number', dif);
                }
            } else {///strong numbers
                if (dif < 0) {
                    dif = dif * (-1);
                    message = 'נבחרו יותר מדי מספרים חזקים, יש להסיר number בחירות'.replace('number', dif);
                }
                if (dif == 1) {
                    message = 'יש לבחור מספר חזק';
                } else {
                    message = 'יש לבחור עוד number מספרים חזקים'.replace('number', dif);
                }
            }

            return message;
        }
        var validateTable = function (T) {
            T.$error = { numbers: false, strongNumbers: false, valid: false }
            if (T.Active) {
                T.$error.valid = true;
                if (T.ValArray.length < $scope.FormsSettingsModel.ChoiceNumber || T.ValArray.length > $scope.FormsSettingsModel.ChoiceNumber) {
                    T.$error.numbers = true;
                    T.$error.valid = false;
                    InvalidateForm();
                    NotificationService.Error({ message: getMessage(1, T.ValArray.length, $scope.FormsSettingsModel.ChoiceNumber), delay: 2500 });
                }
                if (T.StrongValArray.length < $scope.FormsSettingsModel.StrongNumber || T.StrongValArray.length > $scope.FormsSettingsModel.StrongNumber) {
                    T.$error.strongNumbers = true;
                    T.$error.valid = false;
                    InvalidateForm();
                    NotificationService.Error({ message: getMessage(2, T.StrongValArray.length, $scope.FormsSettingsModel.StrongNumber), delay: 2500 });
                }
            }
        }
        $scope.nextForm = function (e, table) {
            ///validate this form
            validateTable(table)
            if (!table.$error.valid)
                return void [0];

            table.Show = false;
            $scope.FormsSettingsModel.Tables[table.tableNumber].Show = true;
        };
        $scope.previousForm = function (e, table) {
            if (table.tableNumber === 1)
                return void [0];

            table.Show = false;
            $scope.FormsSettingsModel.Tables[table.tableNumber - 2].Show = true;
        };

        ///set up to collect data for product 
        var Qlist = [];
        var FormsSettingsModel = localStorageService.get('FormsSettingsModel');
        if ($rootScope.ValidateDate(FormsSettingsModel)) {
            Qlist.push({ name: 'GetFormSettingsModel', DataObj: null, res$scope: 'FormsSettingsModel' });
        }
        else {
            $scope.FormsSettingsModel = FormsSettingsModel.data[$scope.$Page.product.ID - 1].Value;
        }
        var FormMessagesModel = localStorageService.get('FormMessagesModel');
        if ($rootScope.ValidateDate(FormMessagesModel)) {
            Qlist.push({ name: 'ModelMessages', DataObj: "Angular_Product", res$scope: 'FormMessagesModel' });
        }
        else {
            $scope.FormMessagesModel = FormMessagesModel.data;
        }
        ///model to hold form cost params
        $scope.CalcFormData = {
            productModel: $scope.$Page.product,
            numberRuffels: 1,
            numberForms: $scope.$Page.product.MinTables,
            Extra: false,
            formType: $scope.$Page.product.AmountChoicePerTable.split(',')[0],
            numberRuffels_Selected: { id: 1, name: 1 }
        };

        Qlist.push({ name: 'CalculatFormCost', DataObj: $scope.CalcFormData, res$scope: 'FormCostModel' });
        Qlist.push({ name: 'GetCart', DataObj: null, res$scope: 'CurrentRaffleID' });
        Qlist.push({ name: 'GetNumberOfRaffles', DataObj: null, res$scope: 'MaxRaffles' });
        ///pre load data
        $q.all(Qlist.map(function (Q) {
            return ProductService[Q.name](Q.DataObj)
        })).then(function (results) {
            results.map(function (r, index) {
                if (Qlist[index].res$scope == 'FormsSettingsModel') {
                    $scope[Qlist[index].res$scope] = r.data.data[$scope.$Page.product.ID - 1].Value;
                } else {
                    $scope[Qlist[index].res$scope] = r.data.data;
                }
                localStorageService.add(Qlist[index].res$scope, r.data);
            });
        }).then(function () {
            $scope.FormsSettingsModel.Tables = new Array();
            $scope.FormsSettingsModel.CurrentTableCounter = $scope.FormsSettingsModel.MinTables;
            for (var i = 1; i <= $scope.FormsSettingsModel.MaxTables; i++) {
                var TableObj = {
                    tableNumber: i,
                    ValArray: new Array(),
                    StrongValArray: new Array(),
                    Active: (i <= $scope.FormsSettingsModel.CurrentTableCounter),
                    Show: i === 1,
                }
                $scope.FormsSettingsModel.Tables.push(TableObj);
            }
            ///set 7 numbers if in forms 5,6
            if ($scope.FormsSettingsModel.ID == 5 || $scope.FormsSettingsModel.ID == 6) {
                $scope.FormsSettingsModel.ChoiceNumber = 7
            }

            $scope.MaxRaffles = NumbertToOptions($scope.MaxRaffles);
            ///set images url -> $rootScope.$imageUrl
            $scope.$Page.Image1 = CombineImageUrl($scope.$Page.Image1);
            $scope.$Page.Image2 = CombineImageUrl($scope.$Page.Image2);

            ///if user returns after no-mony option re popolate form
            $scope.ReFill();
        });
        ///trace table selected numbers
        $scope.TraceTable = function (Table, checked, val) {
            if (checked) {
                Table.ValArray.push(val);
            }
            if (!checked) {
                Table.ValArray.splice(Table.ValArray.indexOf(val), 1);
            }
        };
        ///trace table selected strong numbers
        $scope.TraceStrong = function (Table, checked, val) {
            if (checked) {
                Table.StrongValArray.push(val);
            }
            if (!checked) {
                Table.StrongValArray.splice(Table.StrongValArray.indexOf(val), 1);
            }
        };
        ///re calc form cost 
        $scope.ReCalcForm = function () {
            $scope.CalcFormData.Extra = $scope.FormsSettingsModel.Extra;
            $scope.CalcFormData.numberRuffels = $scope.CalcFormData.numberRuffels_Selected.id;
            ProductService.CalculatFormCost($scope.CalcFormData)
                .then(function (res) {
                    if (res.data.success) {//get prices OK
                        $scope.FormCostModel = res.data.data;
                    } else {
                        NotificationService.Error({ message: 'Error Geting Prices From Server' }, broadcastHome);
                    }
                });
        };
        ///connect selection of option to correct table behavior
        $scope.$watch('FormsSettingsModel.Selected_SelectionOptions', function (newVal, oldVal) {
            if (newVal == null || oldVal == null || newVal === oldVal)
                return void [0];

            ngDialog.close();
            newVal = parseInt(newVal);
            oldVal = parseInt(oldVal);
            //RaffleType
            $scope.CalcFormData.formType = newVal;
            switch ($scope.FormsSettingsModel.ID) {
                case 1:
                case 2:
                    $scope.FormsSettingsModel.Tables.filter(function (t, Index) {
                        t.Active = Index < newVal;
                    });
                    $scope.CalcFormData.numberForms = newVal;
                    break;
                case 3:
                case 4:
                    if (newVal < oldVal) {///nead to remove selections from table
                        $scope.FormsSettingsModel.Tables.filter(function (T) {
                            if (T.ValArray.length > newVal) {
                                var Remove = T.ValArray.length - newVal;
                                for (Remove; Remove > 0; Remove--) {
                                    var Index = T.ValArray[Math.floor(Math.random() * T.ValArray.length)];
                                    T.ValArray.splice((T.ValArray.indexOf(Index)), 1);
                                    T.CheckboxArray[Index] = false;
                                }
                            }
                        });
                    }
                    $scope.FormsSettingsModel.ChoiceNumber = newVal;
                    break;
                case 5:
                case 6:
                    if (newVal < oldVal) {///nead to remove selections from stron numbers table
                        $scope.FormsSettingsModel.Tables.filter(function (T) {
                            if (T.StrongValArray.length > newVal) {
                                var Remove = T.StrongValArray.length - newVal;
                                for (Remove; Remove > 0; Remove--) {
                                    var Index = T.StrongValArray[Math.floor(Math.random() * T.StrongValArray.length)];
                                    T.StrongValArray.splice((T.StrongValArray.indexOf(Index)), 1);
                                    T.StrongArray[Index] = false;
                                }
                            }
                        });
                    }
                    $scope.FormsSettingsModel.StrongNumber = newVal;
                    break;
                default:
                    NotificationService.Error({ message: 'FATAL ERROR, RESET THE APP!' }, broadcastHome);
                    break;
            }

            ProductService.CalculatFormCost($scope.CalcFormData)
                .then(function (res) {
                    if (res.data.success) {//get prices OK
                        $scope.FormCostModel = res.data.data;
                    } else {
                        NotificationService.Error({ message: 'Error Geting Prices From Server' }, broadcastHome);
                    }
                });
        });

        ///re-fill table from saved data
        $scope.ReFill = function ($apply) {
            var Form = localStorageService.get('SavedPageForMony');
            
            ///first check if thers a form and its on the same type
            if (!Form || !Form.CalcFormData || !Form.FormsSettingsModel || Form.FormsSettingsModel.ID !== $scope.FormsSettingsModel.ID) {
                $scope.OpenSelctionPop();
                return void [0];
            }
            ///TimeStop -> only save data for 1 hour
            var TimeStop = new Date(); TimeStop.setHours(TimeStop.getHours() - 1);
            var SaveDataDate = new Date($scope.localStorageService.get('SavedPageForMony').SaveDataDate);
            if (SaveDataDate < TimeStop) {///data over 1 hour old, delete and return
                localStorageService.remove('SavedPageForMony');
                $scope.OpenSelctionPop();
                return void [0];
            }
            
            $scope.FormsSettingsModel = Form.FormsSettingsModel;
            $scope.CalcFormData.Extra = Form.CalcFormData.Extra;
            $scope.CalcFormData.formType = Form.CalcFormData.formType;
            $scope.CalcFormData.numberForms = Form.CalcFormData.numberForms;
            $scope.CalcFormData.numberRuffels = Form.CalcFormData.numberRuffels;
            $scope.CalcFormData.numberRuffels_Selected = Form.CalcFormData.numberRuffels_Selected;
            localStorageService.remove('SavedPageForMony');
            if (typeof $apply !== 'undefined' && $apply === true)
                $scope.$apply();
        };

        ///auto fill entire form
        $scope.AutoFillAll = function (Tables) {
            var IsFull = true;
            Tables.filter(function (T) {
                if (T.Active === true && (T.ValArray.length < $scope.FormsSettingsModel.ChoiceNumber
                    || T.StrongValArray.length < $scope.FormsSettingsModel.StrongNumber))
                {
                    IsFull = false;
                    $scope.AutoFill(T);
                }
            });

            if (IsFull === true)
                Tables.filter(function (T) {
                    if (T.Active === true)
                        $scope.AutoFill(T);
                });
        }
        ///auto fill table
        $scope.AutoFill = function (table) {
            var IsFull = false;
            if (typeof table.CheckboxArray == 'undefined')
                table.CheckboxArray = {};
            if (typeof table.StrongArray == 'undefined')
                table.StrongArray = {};
            //table.ValArray
            if (table.ValArray.length >= $scope.FormsSettingsModel.ChoiceNumber
                && table.StrongValArray.length >= $scope.FormsSettingsModel.StrongNumber) {
                IsFull = true;
                table.CheckboxArray = {};
                table.ValArray = new Array();
            }
            while (table.ValArray.length < $scope.FormsSettingsModel.ChoiceNumber) {
                var Index = RandomBetween(37, 1);
                if (!table.CheckboxArray[Index]) {
                    table.CheckboxArray[Index] = true;
                    table.ValArray.push(Index);
                }
            }
            //table.StrongValArray
            if (table.StrongValArray.length >= $scope.FormsSettingsModel.StrongNumber && IsFull === true) {
                table.StrongArray = {};
                table.StrongValArray = new Array();
            }
            while (table.StrongValArray.length < $scope.FormsSettingsModel.StrongNumber) {
                var Index = RandomBetween(7, 1);
                if (!table.StrongArray[Index]) {
                    table.StrongArray[Index] = true;
                    table.StrongValArray.push(Index);
                }
            }
        };
        ///save form name
        $scope.SaveFormName = function () {
            ngDialog.open({ template: 'Html/Ng-Dialog/SaveFormName-Template.html', controller: 'SaveFormNameController', scope: $scope });
        };

        $scope.UserNoMonyDecision = function () {
            ///go to no mony page
            $state.go('Product.Payment');
        };
        ///save form
        $scope.SaveAndSend = function (LotoForm, FormsSettingsModel) {
            ValidateForm(LotoForm, FormsSettingsModel);
            if (!LotoForm.$submitted || LotoForm.$invalid || !LotoForm.$valid)
                return void [0];

            var User = localStorageService.get('credentials');
            var formModel = DataModelsService.formModel();
            var Index = 0;
            FormsSettingsModel.Tables.filter(function (T) {
                if (T.Active) {
                    Index--;
                    formModel.Tables.push({
                        ID: Index,
                        FormID: -1,
                        Numbers: JoinArray(T.ValArray),
                        StrongNumbers: JoinArray(T.StrongValArray)
                    });
                }
            });
            formModel.BaseFormTypeID = FormsSettingsModel.ID
            formModel.Extra = FormsSettingsModel.Extra === true;
            formModel.ID = -1;
            formModel.IsActive = true;
            formModel.Name = null;
            formModel.RaffleID = $scope.CurrentRaffleID;
            formModel.RaffleType = FormsSettingsModel.Selected_SelectionOptions;
            formModel.SystematicType = $scope.CalcFormData.numberRuffels_Selected.id;
            formModel.TableCount = formModel.Tables.length;
            formModel.UserID = User.UserId;

            var data = { formModel: formModel, CalculatFormCostPostModel: $scope.CalcFormData };

            ////save form and go to summery page
            var Form = {
                FormsSettingsModel: angular.copy($scope.FormsSettingsModel),
                CalcFormData: angular.copy($scope.CalcFormData),
                SaveFormData: angular.copy(data),
                SaveDataDate: new Date(),
                FormMessagesModel: $scope.FormMessagesModel,
                FormCostModel: $scope.FormCostModel,
                $Page: $scope.$Page,
                MaxRaffles: $scope.MaxRaffles
            }
            ProductService.setProductForm(Form);

            ///go to form summery page
            $state.go('Product.FormSummery');
        };

        var ValidateForm = function (LotoForm, FormsSettingsModel) {
            ///clear old errors
            $scope.LotoForm.$valid = true;
            $scope.LotoForm.$invalid = false;
            $scope.LotoForm.$inputerror = DataModelsService.FormErrorModel();
            $scope.FormsSettingsModel.Tables.filter(function (T) {
                validateTable(T);
            });
        };
        var InvalidateForm = function () {
            $scope.LotoForm.$valid = false;
            $scope.LotoForm.$invalid = true;
        };

        ///close the nav-bar after redirection
        $rootScope.$broadcast('Close-NavBar');
    }]);