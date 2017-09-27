IlottoApp.factory('ModalServic', ['$rootScope', function ( $rootScope) {
    var $ShowForm1 = new Object();
    var NumberRow = {
        number: 0,
        Win: false,
        ExtraWin: false
    }
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
                return a - b;
            }) : NumArray;
    }

    return {
        GetForm: function () {
            return $ShowForm;
        },
        SetForm: function ($form) {
            var $ShowForm = new Object();
            $ShowForm = angular.copy($form);
            $ShowForm.Check = false;
            console.log($ShowForm.raffle)
            if (typeof $ShowForm.raffle == 'object' && $ShowForm.raffle !== null) {
                $ShowForm.Check = CheckIfHaveValue($ShowForm.raffle.Numbers) && CheckIfHaveValue($ShowForm.raffle.Strong) && CheckIfHaveValue($ShowForm.raffle.ExtraNumbers);
                
                if (CheckIfHaveValue($ShowForm.raffle.Numbers)) {
                    $ShowForm.raffle.Numbers = SplitToSortArray($ShowForm.raffle.Numbers);
                }
                else {
                    $ShowForm.raffle.Numbers = new Array();
                }
                if (CheckIfHaveValue($ShowForm.raffle.Strong)) {
                    $ShowForm.raffle.Strong = SplitToSortArray($ShowForm.raffle.Strong);

                }
                else {
                    $ShowForm.raffle.Strong = new Array();
                }
                if (CheckIfHaveValue($ShowForm.raffle.ExtraNumbers)) {
                    $ShowForm.raffle.ExtraNumbers = SplitToIntArray($ShowForm.raffle.ExtraNumbers);

                }
                else {
                    $ShowForm.raffle.ExtraNumbers = new Array();
                }
            }

            $ShowForm.ExtraNumbersArray = new Array();
            if ($ShowForm.Extra && $ShowForm.Check) {
                $ShowForm.ExtraNumbers = SplitToIntArray($ShowForm.ExtraNumbers);

                $ShowForm.ExtraNumbers.filter(function (N, Index) {
                    var Row = angular.copy(NumberRow);
                    Row.number = N;
                    Row.Win = $ShowForm.raffle.ExtraNumbers[Index] === N;
                    $ShowForm.ExtraNumbersArray.push(Row);
                });                
            }

            $ShowForm.Tables.filter(function (t) {
                t.NumbersObj = new Array();
                t.StrongObj = new Array();

                t.NumbersArray = SplitToSortArray(t.Numbers);
                t.StrongArray = SplitToSortArray(t.StrongNumbers);
                ///check numbers for win/extra
                t.NumbersArray.filter(function (TN) {
                    var Row = angular.copy(NumberRow);
                    Row.number = TN;
                    if ($ShowForm.Check) {
                        Row.Win = $ShowForm.raffle.Numbers.indexOf(TN) >= 0;
                    }
                    t.NumbersObj.push(Row);
                });
                
                ///check stron for win
                t.StrongArray.filter(function (TSN) {
                    var Row = angular.copy(NumberRow);
                    Row.number = TSN;
                    if ($ShowForm.Check) {
                        Row.Win = $ShowForm.raffle.Strong.indexOf(TSN) >= 0;
                    }
                    t.StrongObj.push(Row);
                });                
            });
            $form.extended = $ShowForm;
            //return $ShowForm;
        }
    }
}]);