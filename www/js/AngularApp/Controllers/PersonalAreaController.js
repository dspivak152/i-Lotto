'use strict';
IlottoApp.controller('PersonalAreaController', ['$rootScope', '$scope', 'PersonalAreaService', '$state', 'LogInService',
    'localStorageService', 'NotificationService', 'MenuService', 'ngDialog', 'ProductService', '$FormsSettings', 'ModalServic', '$filter',
    function ($rootScope, $scope, PersonalAreaService, $state, LogInService, localStorageService, NotificationService,
        MenuService, ngDialog, ProductService, $FormsSettings, ModalServic, $filter) {
        
        window.$scope = $scope;

        $scope.ShowForms = {};
        $scope.showIndex = 0;

        $scope.MenuService = MenuService;
        $scope.localStorageService = localStorageService;
        $scope.NotificationService = NotificationService;
        $scope.LogInService = LogInService;
        $scope.userCredentials = localStorageService.get('credentials');
        $scope.$Domain = $rootScope.$imageUrl;

        var NumberRow = {
            number: 0,
            Win: false,
            ExtraWin: false
        }

        $scope.FormsSettingsModel = $FormsSettings.data;
        if ($rootScope.ValidateDate(localStorageService.get('FormsSettingsModel')))
            localStorageService.set('FormsSettingsModel', $FormsSettings.data);

        $scope.$Type = 'OldForms';//'OldForms';//'FutureForms';//'Wins';//

        ///iner functions
        var SplitArrayToValObj = function (numbers) {
            var ValObj = new Array();
            var NumArray = numbers.split(',');
            for (var i in NumArray) {
                ValObj[parseInt(NumArray[i])] = true;
            }
            return ValObj;
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
                    return b - a;
                }) : NumArray;
        }
        var CombineImageUrl = function (imageUrl) {
            return $rootScope.$imageUrl + (imageUrl.indexOf('/') == 0 ? imageUrl.substring(1) : imageUrl);
        }
        var CheckIfHaveValue = function ($item) {
            return $item !== null && $item !== undefined && $item !== 'undefined'
                && $item !== '';
        }
        function convertDate(inputFormat, addTime) {
            if (inputFormat == null || !inputFormat || typeof inputFormat == 'undefined' || inputFormat.length < 5)
                return void [0];

            var val = inputFormat.split('T'), date = val[0].split('-'), time = val[1].split(':').slice(0, 2).join(':');
            if (parseInt(date[0]) > 2000)
                date[0] = String(parseInt(date[0]) - 2000);
            if(addTime ){
                return date.reverse().join('/') + ' ' + time;
            }else{
                return date.reverse().join('/');
            }
        }
        var SplitArrayToParts = function (parent, child) {
            child.sort(function (a, b) {
                return b.number - a.number;
            });
            if (child.length < 7) {
                parent.push(child);
            } else {
                var length = child.length;
                while (length > 0) {
                    length -= 6;
                    //var r1 = child.splice(child.length - 6, 6);
                    var r1 = child.splice(child.length - 6, child.length)
                    //var r1 = child.splice(0, 6);
                    parent.push(r1);
                }
            }
        }
        ///pager
        $scope.$Pager = {
            PageSize: 10,
            PageNumber: 1,
            Counter: 0,
            MaxPages: 0,
            pagerList: []
        };
        ///pager holder for types
        $scope.$Pagers = {
            'Withdrawals': angular.copy($scope.$Pager),
            'Deposits': angular.copy($scope.$Pager),
            'NamedForms': angular.copy($scope.$Pager),
            'OldForms': angular.copy($scope.$Pager),
            'Wins': angular.copy($scope.$Pager),
            'FutureForms': angular.copy($scope.$Pager),
        };
        $scope.FutureForms = new Array();
        $scope.FutureFormsArray = new Array();

        $scope.OldForms = new Array();
        $scope.OldFormsArray = new Array();

        $scope.Wins = new Array();
        $scope.WinsArray = new Array();

        $scope.NamedForms = new Array();
        $scope.NamedFormsArray = new Array();

        $scope.$Finances = new Array();

        $scope.$Deposits = new Array();
        $scope.$DepositsArray = new Array();

        $scope.$Withdrawals = new Array();
        $scope.$WithdrawalsArray = new Array();

        var CheckIfData = function ($Type, PageNumber) {
            switch ($Type) {
                case 'Withdrawals':
                    if (typeof $scope.$WithdrawalsArray[PageNumber] === "object") {
                        $scope.$Deposits = $scope.$WithdrawalsArray[PageNumber];
                        return true;
                    }
                    break;
                case 'Deposits':
                    if (typeof $scope.$DepositsArray[PageNumber] === "object") {
                        $scope.$Deposits = $scope.$DepositsArray[PageNumber];
                        return true;
                    }
                    break;
                case 'NamedForms':
                    if (typeof $scope.NamedFormsArray[PageNumber] === "object") {
                        $scope.NamedForms = $scope.NamedFormsArray[PageNumber];
                        return true;
                    }
                    break;
                case 'OldForms':
                    if (typeof $scope.OldFormsArray[PageNumber] === "object") {
                        $scope.FutureForms = $scope.OldFormsArray[PageNumber];
                        return true;
                    }
                    break;
                case 'Wins':
                    if (typeof $scope.WinsArray[PageNumber] === "object") {
                        $scope.WinForms = $scope.WinsArray[PageNumber];
                        return true;
                    }
                    break;
                case 'FutureForms':
                    if (typeof $scope.FutureFormsArray[PageNumber] === "object") {
                        $scope.FutureForms = $scope.FutureFormsArray[PageNumber];
                        return true;
                    }
                    break;
            }
            return false;
        }

        $scope.CallData = function ($Type, $PageNumber) {
            if (CheckIfData($Type, ($PageNumber > 0? $PageNumber : 1)))
                return;
            PersonalAreaService[$Type]({
                UserID: $scope.userCredentials.UserId,
                PageNumber: $PageNumber > 0? $PageNumber : $scope.$Pager.PageNumber,
                PageSize: $scope.$Pager.PageSize
            })
                .then(function (res) {
                    switch ($Type) {
                        case 'Deposits':
                            $scope.$Deposits = res.data.result;
                            $scope.$Deposits.filter(function (d, Index) {
                                d.CreatedString = convertDate(d.Created, true);
                                d.ConfirmedString = convertDate(d.Confirmed);
                                switch (d.IsConfirmed) {
                                    case null:
                                        d.IsConfirmed = "ממתין לאישור";
                                        break;
                                    case true:
                                        d.IsConfirmed = "מאושר";
                                        break;
                                    case false:
                                        d.IsConfirmed = "לא מאושר";
                                        break;
                                }
                            });
                            $scope.$DepositsArray[$scope.$Pager.PageNumber] = $scope.$Deposits;

                            if ($scope.$Pager.pagerList.length == 0) {
                                $scope.$Pager.Counter = res.data.Length;
                                $scope.$Pager.MaxPages = Math.ceil(res.data.Length / $scope.$Pager.PageSize);

                                for (var Index = 1; Index <= $scope.$Pager.MaxPages; Index++) {
                                    $scope.$Pager.pagerList.push(Index);
                                    $scope.$DepositsArray.push(Index);
                                    $scope.$DepositsArray.push(Index);
                                    $scope.$DepositsArray.push(Index);
                                }
                            }
                            break;
                        case 'Withdrawals':
                            $scope.$Deposits = res.data.result;
                            $scope.$Deposits.filter(function (d, Index) {
                                d.CreatedString = convertDate(d.Created, true);
                                d.ConfirmedString = convertDate(d.Confirmed);
                                switch (d.IsConfirmed) {
                                    case null:
                                        d.IsConfirmed = "ממתין לאישור";
                                        break;
                                    case true:
                                        d.IsConfirmed = "מאושר";
                                        break;
                                    case false:
                                        d.IsConfirmed = "לא מאושר";
                                        break;
                                }
                            });
                            $scope.$WithdrawalsArray[$scope.$Pager.PageNumber] = $scope.$Deposits;
                            if ($scope.$Pager.pagerList.length == 0) {
                                $scope.$Pager.Counter = res.data.Length;
                                $scope.$Pager.MaxPages = Math.ceil(res.data.Length / $scope.$Pager.PageSize);

                                for (var Index = 1; Index <= $scope.$Pager.MaxPages; Index++) {
                                    $scope.$Pager.pagerList.push(Index);
                                    $scope.$WithdrawalsArray.push(Index);
                                    $scope.$WithdrawalsArray.push(Index);
                                    $scope.$WithdrawalsArray.push(Index);
                                }
                            }
                            break;
                        case 'FutureForms':
                            $scope.FutureForms = res.data.result;
                            $scope.FutureForms.filter(function (ff, Index) {
                                ff.raffle.RaffledateFormat = convertDate(ff.raffle.Raffledate);
                                ff.FillDateString = convertDate(ff.FillDate, true);
                            });
                            if ($scope.$Pager.pagerList.length == 0) {
                                $scope.$Pager.Counter = res.data.Length;
                                $scope.$Pager.MaxPages = Math.ceil(res.data.Length / $scope.$Pager.PageSize);

                                for (var Index = 1; Index <= $scope.$Pager.MaxPages; Index++) {
                                    $scope.$Pager.pagerList.push(Index);
                                    $scope.FutureFormsArray.push(Index);
                                    $scope.FutureFormsArray.push(Index);
                                    $scope.FutureFormsArray.push(Index);
                                }
                            }

                            $scope.FutureFormsArray[$scope.$Pager.PageNumber] = res.data.result;
                            break;
                        case 'OldForms':
                            $scope.FutureForms = res.data.result;
                            $scope.FutureForms.filter(function (ff, Index) {
                                ff.raffle.RaffledateFormat = convertDate(ff.raffle.Raffledate);
                                ff.FillDateString = convertDate(ff.FillDate, true);
                            });
                            if ($scope.$Pager.pagerList.length == 0) {
                                $scope.$Pager.Counter = res.data.Length;
                                $scope.$Pager.MaxPages = Math.ceil(res.data.Length / $scope.$Pager.PageSize);

                                for (var Index = 1; Index <= $scope.$Pager.MaxPages; Index++) {
                                    $scope.$Pager.pagerList.push(Index);
                                    $scope.OldFormsArray.push(Index);
                                    $scope.OldFormsArray.push(Index);
                                    $scope.OldFormsArray.push(Index);
                                }
                            }
                            
                            $scope.OldFormsArray[$scope.$Pager.PageNumber] = res.data.result;
                            break;
                        case 'NamedForms':
                            $scope.NamedForms = res.data.result;
                            if ($scope.$Pager.pagerList.length == 0) {
                                $scope.$Pager.Counter = res.data.Length;
                                $scope.$Pager.MaxPages = Math.ceil(res.data.Length / $scope.$Pager.PageSize);

                                for (var Index = 1; Index <= $scope.$Pager.MaxPages; Index++) {
                                    $scope.$Pager.pagerList.push(Index);
                                    $scope.NamedFormsArray.push(Index);
                                    $scope.NamedFormsArray.push(Index);
                                    $scope.NamedFormsArray.push(Index);
                                }
                            }
                            $scope.NamedFormsArray[$scope.$Pager.PageNumber] = res.data.result;
                            break;
                        case 'Wins':
                            $scope.WinForms = res.data.result;
                            $scope.WinForms.filter(function (ff, Index) {
                                ff.raffle.RaffledateFormat = convertDate(ff.raffle.Raffledate);
                                ff.FillDateString = convertDate(ff.FillDate, true);
                                ff.SealDateString = convertDate(ff.SealDate, true);
                                
                            });
                            if ($scope.$Pager.pagerList.length == 0) {
                                $scope.$Pager.Counter = res.data.Length;
                                $scope.$Pager.MaxPages = Math.ceil(res.data.Length / $scope.$Pager.PageSize);

                                for (var Index = 1; Index <= $scope.$Pager.MaxPages; Index++) {
                                    $scope.$Pager.pagerList.push(Index);
                                    $scope.WinsArray.push(Index);
                                    $scope.WinsArray.push(Index);
                                    $scope.WinsArray.push(Index);
                                }
                            }
                            $scope.WinsArray[$scope.$Pager.PageNumber] = res.data.result;
                            break;
                    }

                });
        }

        $scope.$watch('$Type', function (NewVal, OldVal) {
            if (OldVal === NewVal || OldVal === null || NewVal === null)
                return void [0];
            $scope.$Pagers[OldVal] = angular.copy($scope.$Pager);
            $scope.$Pager = angular.copy($scope.$Pagers[NewVal]);
            $scope.CallData(NewVal);
        });

        $scope.$watch('$Pager.PageNumber', function (NewVal, OldVal) {
            if (OldVal === NewVal || OldVal === null || NewVal === null)
                return void [0];
            $scope.CallData($scope.$Type, NewVal);
            
        }, true);

        $scope.Duplicate = function ($form) {
            $form.$Tables = new Array();

            var FormsSettings = $scope.FormsSettingsModel.data[$form.BaseFormTypeID - 1].Value;

            var Table = {
                $error: {
                    HavError: false,
                    numbers: {
                        long: false,
                        longMessege: "יותר מדי מספרים",
                        short: false,
                        shortMessege: "לא מספיק מספרים",
                    },
                    strongNumbers: {
                        long: false,
                        longMessege: "יותר מדי מספרים חזקים",
                        short: false,
                        shortMessege: "מעט מדי מספרים חזקים",
                    }
                },
                Active: true,
                Show: true,
                CheckboxArray: new Array,
                StrongArray: new Array,
                StrongValArray: new Array,
                ValArray: new Array,
                tableNumber: null,
            };
            //re-create the tables
            $form.Tables.filter(function (T, Index) {
                var $table = angular.copy(Table);
                $table.tableNumber = (Index + 1);
                $table.Show = $table.tableNumber > 1 ? false : true;
                $table.CheckboxArray = SplitArrayToValObj(T.Numbers);
                $table.StrongArray = SplitArrayToValObj(T.StrongNumbers);
                $table.StrongValArray = SplitToIntArray(T.StrongNumbers);
                $table.ValArray = SplitToIntArray(T.Numbers);
                $form.$Tables.push($table);
            });

            for (var i = $form.$Tables.length; i < FormsSettings.MaxTables ; i++) {
                var $table = angular.copy(Table);
                $table.tableNumber = i;
                $form.$Tables.push($table);
            }
            ///set the number of regolar numbers selected option
            var $ChoiceNumber = 6;
            var $StrongNumber = 1;
            if (FormsSettings.ID == 5 || FormsSettings.ID == 6) {
                $ChoiceNumber = 7;
                $StrongNumber = $form.RaffleType;
            }
            if (FormsSettings.ID == 3 || FormsSettings.ID == 4) {
                $ChoiceNumber = $form.RaffleType;
            }

            var Form = {
                FormsSettingsModel: {
                    AmountChoicePerTable: FormsSettings.AmountChoicePerTable,
                    AmountTables: FormsSettings.AmountTables,
                    ChoiceNumber: $ChoiceNumber,
                    CurrentTableCounter: $form.TableCount,
                    ExtraPrice: 0,
                    ID: FormsSettings.ID,
                    MaxTables: FormsSettings.MaxTables,
                    MinTables: FormsSettings.MinTables,
                    Name: FormsSettings.Name,
                    Selected_SelectionOptions: $form.RaffleType,
                    SelectionOptions: FormsSettings.SelectionOptions,
                    StrongAmountPerTable: null,
                    StrongNumber: $StrongNumber,
                    Tables: $form.$Tables,
                    ThenksPage: null,
                    Total: 0,
                    TotalCommission: 0,
                    TotalLottery: 0,
                },
                CalcFormData: {
                    Extra: $form.Extra,
                    formType: $form.RaffleType,
                    numberForms: $form.TableCount,
                    numberRuffels: 1,
                    numberRuffels_Selected: { id: 1, name: 1 },
                }
            }

            localStorageService.add('SavedPageForMony', Form);
            $state.go("Product.form", { ProdId: FormsSettings.ProductID });
            //console.log(FormsSettings.ProductID);
        }

        ///select number/type of form pop up - cant close b-4 selecting
        $scope.ShowForm = function ($form) {
            $scope.ShowForm.Check = false;
            $scope.$ShowForm = angular.copy($form);
            if (typeof $scope.$ShowForm.raffle == 'object' && $scope.$ShowForm.raffle !== null) {
                $scope.ShowForm.Check = CheckIfHaveValue($scope.$ShowForm.raffle.Numbers) && CheckIfHaveValue($scope.$ShowForm.raffle.Strong) && CheckIfHaveValue($scope.$ShowForm.raffle.ExtraNumbers);

                if (CheckIfHaveValue($scope.$ShowForm.raffle.Numbers)) {
                    $scope.$ShowForm.raffle.Numbers = SplitToSortArray($scope.$ShowForm.raffle.Numbers);
                }
                else {
                    $scope.$ShowForm.raffle.Numbers = new Array();
                }
                if (CheckIfHaveValue($scope.$ShowForm.raffle.Strong)) {
                    $scope.$ShowForm.raffle.Strong = SplitToSortArray($scope.$ShowForm.raffle.Strong);

                }
                else {
                    $scope.$ShowForm.raffle.Strong = new Array();
                }
                if (CheckIfHaveValue($scope.$ShowForm.raffle.ExtraNumbers)) {
                    $scope.$ShowForm.raffle.ExtraNumbers = SplitToIntArray($scope.$ShowForm.raffle.ExtraNumbers);

                }
                else {
                    $scope.$ShowForm.raffle.ExtraNumbers = new Array();
                }
            }

            $scope.$ShowForm.ExtraNumbersArray = new Array();
            if ($scope.$ShowForm.Extra && $scope.ShowForm.Check) {
                $scope.$ShowForm.ExtraNumbers = SplitToIntArray($scope.$ShowForm.ExtraNumbers);

                $scope.$ShowForm.ExtraNumbers.filter(function (N, Index) {
                    var Row = angular.copy(NumberRow);
                    Row.number = N;
                    Row.Win = $scope.$ShowForm.raffle.ExtraNumbers[Index] === N;
                    $scope.$ShowForm.ExtraNumbersArray.push(Row);
                });
            }

            $scope.$ShowForm.Tables.filter(function (t) {
                t.NumbersObj = new Array();
                t.StrongObj = new Array();

                t.NumbersArray = SplitToSortArray(t.Numbers);
                t.StrongArray = SplitToSortArray(t.StrongNumbers);
                ///check numbers for win/extra
                t.NumbersArray.filter(function (TN) {
                    var Row = angular.copy(NumberRow);
                    Row.number = TN;
                    if ($scope.ShowForm.Check) {
                        Row.Win = $scope.$ShowForm.raffle.Numbers.indexOf(TN) >= 0;
                    }
                    t.NumbersObj.push(Row);
                });

                ///check stron for win
                t.StrongArray.filter(function (TSN) {
                    var Row = angular.copy(NumberRow);
                    Row.number = TSN;
                    if ($scope.ShowForm.Check) {
                        Row.Win = $scope.$ShowForm.raffle.Strong.indexOf(TSN) >= 0;
                    }
                    t.StrongObj.push(Row);
                });
            });

            ngDialog.close();

            ngDialog.open({
                template: '/Html/Ng-Dialog/Show-Form.html',
                scope: $scope,
                backdrop: 'static',
                showClose: true
            });
        };

        $scope.Actions = function ($form) {
            $scope.$form = $form;
            $scope.$form.ShowScan =
                ($scope.$Type == 'NamedForms') ?
                    false : ($scope.$form.FormReception !== null && typeof $scope.$form.FormReception == 'object'
                            && typeof $scope.$form.FormReception.Link == 'string' && $scope.$form.FormReception.Link.length > 5
                            && $scope.$form.FormReception.Link.indexOf('Exception') < 0);

            ngDialog.open({
                template: '/Html/Ng-Dialog/Actions-PopUp.html',
                scope: $scope,
                backdrop: 'static',
                showClose: true
            });
        }

        $scope.ShowScandForm = function ($form) {
            $scope.$form = $form;
            $scope.ScandImage = $form.FormReception.Link.replace('www.dropbox.com', 'dl.dropboxusercontent.com');
            ngDialog.close();

            ngDialog.open({
                template: '/Html/Ng-Dialog/Scand-Form.html',
                scope: $scope,
                backdrop: 'static',
                showClose: true
            });
        };

        $scope.openModal = function (form, formsList) {
            if (typeof form.showModal === 'undefined') {
                form.showModal = false;
                $scope.SetForm(form);
            }

            form.showModal = !form.showModal;
            $.map(formsList, function (item) {
                if (typeof item.showModal !== 'undefined' && item.ID !== form.ID) {
                    item.showModal = false;
                }
            })
        };

        PersonalAreaService.Eraser();
        $scope.CallData($scope.$Type);

        ///close the nav-bar after redirection
        $rootScope.$broadcast('Close-NavBar');
        ngDialog.close();

        $scope.SetForm = function ($form) {
            $scope.$$form = $form;
            $form.Check = false;
            if (typeof $form.raffle == 'object' && $form.raffle !== null) {
                $form.Check = CheckIfHaveValue($form.raffle.Numbers) && CheckIfHaveValue($form.raffle.Strong) && CheckIfHaveValue($form.raffle.ExtraNumbers);

                if (CheckIfHaveValue($form.raffle.Numbers)) {
                    $form.raffle.Numbers = SplitToSortArray($form.raffle.Numbers);
                }
                else {
                    $form.raffle.Numbers = new Array();
                }
                if (CheckIfHaveValue($form.raffle.Strong)) {
                    $form.raffle.Strong = SplitToSortArray($form.raffle.Strong);

                }
                else {
                    $form.raffle.Strong = new Array();
                }
                if (CheckIfHaveValue($form.raffle.ExtraNumbers)) {
                    $form.raffle.ExtraNumbers = SplitToIntArray($form.raffle.ExtraNumbers);
                    $form.raffle.ExtraNumbers.reverse();
                }
                else {
                    $form.raffle.ExtraNumbers = new Array();
                }
            }

            $form.ExtraNumbersArray = new Array();
            if ($form.Extra && $form.ExtraNumbers && $form.ExtraNumbers.length > 0) {
                $form.ExtraNumbers = SplitToIntArray($form.ExtraNumbers);
                $form.ExtraNumbers.reverse();

                $form.ExtraNumbers.filter(function (N, Index) {
                    var Row = angular.copy(NumberRow);
                    Row.number = N;
                    if ($form.State !== 5) Row.Win = $form.raffle.ExtraNumbers[Index] === N;
                    $form.ExtraNumbersArray.push(Row);
                });
            }
            
            $form.Tables.filter(function (t) {
                t.HNumbersObj = new Array();
                t.NumbersObj = new Array();
                t.HStrongObj = new Array();
                t.StrongObj = new Array();

                t.NumbersArray = SplitToSortArray(t.Numbers);
                t.StrongArray = SplitToSortArray(t.StrongNumbers);
                ///check numbers for win/extra
                t.NumbersArray.filter(function (TN) {
                    var Row = angular.copy(NumberRow);
                    Row.number = TN;
                    if ($form.Check && $form.State !== 5) {
                        Row.Win = $form.raffle.Numbers.indexOf(TN) >= 0;
                    }
                    t.NumbersObj.push(Row);
                });
                SplitArrayToParts(t.HNumbersObj,angular.copy(t.NumbersObj));
                ///check stron for win
                t.StrongArray.filter(function (TSN) {
                    var Row = angular.copy(NumberRow);
                    Row.number = TSN;
                    if ($form.Check && $form.State !== 5) {
                        Row.Win = $form.raffle.Strong.indexOf(TSN) >= 0;
                    }
                    t.StrongObj.push(Row);
                });
                SplitArrayToParts(t.HStrongObj, angular.copy(t.StrongObj));
            });

            $form.$$winShow = ['OldForms', 'Wins'].indexOf($scope.$Type) >= 0;

            $form.ShowScan =
                ($scope.$Type == 'NamedForms') ?
                    false : ($form.FormReception !== null && typeof $form.FormReception == 'object'
                            && typeof $form.FormReception.Link == 'string' && $form.FormReception.Link.length > 5);
        };
    }]);
