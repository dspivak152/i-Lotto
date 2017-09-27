'use strict';
IlottoApp.filter('ValidateFilter', function () {
    return function (Items, Settings) {
        if (typeof Items == 'undefined' || Items.length <= 0 || typeof Settings == 'undefined')
            return void [0];
        
        return Items.filter(function (table) {
            if (table.Active) {
                if (typeof table.$error == 'undefined')
                    return table;
                
                ///revalidate the table
                table.$error.numbers.short = false;
                table.$error.strongNumbers.short = false;
                table.$error.HavError = false;
                if (table.ValArray.length < Settings.ChoiceNumber) {
                    table.$error.numbers.short = true;
                    table.$error.HavError = true;
                }
                if (table.ValArray.length > Settings.ChoiceNumber) {
                    table.$error.numbers.long = true;
                    table.$error.HavError = true;
                }
                if (table.StrongValArray.length < Settings.StrongNumber) {
                    table.$error.strongNumbers.short = true;
                    table.$error.HavError = true;
                }
                if (table.StrongValArray.length > Settings.StrongNumber) {
                    table.$error.strongNumbers.long = true;
                    table.$error.HavError = true;
                }
                return table;
            }
                
        });
    };
});
IlottoApp.filter('ShowList', function () {
    return function (obj, vars) {
        if (typeof obj === 'object') {
            var start = vars.PageSize * (vars.PageNumber - 1);
            var end = vars.PageSize * vars.PageNumber;
            return obj.slice(start, end);
        }
        return obj;
    }
});
IlottoApp.filter('RafflesShowList', function () {
    return function (obj, vars) {
        if (typeof obj === 'object') {
            var arr = $.grep(obj, function (r) {
                return r.Numbers != null && r.Numbers.length > 0
            });
            obj = arr;

            var start = vars.PageSize * (vars.PageNumber - 1);
            var end = vars.PageSize * vars.PageNumber;
            return obj.slice(start, end);
        }
        return obj;
    }
});
IlottoApp.filter('pagingFilter', function () {
    return function (obj, properties) {
        if (typeof obj === 'object') {
            
            var startAt = 0;
            var endAt = angular.copy(properties.MaxPages);
            
            if (properties.MaxPages > 4) {
                startAt = properties.PageNumber - 2 > 0 ? properties.PageNumber - 2 : 0;
                endAt = properties.PageNumber + 2 > properties.MaxPages ? properties.MaxPages : properties.PageNumber + 2;
            }

            return obj.slice(startAt, endAt);
        }
        return obj;
    }
});