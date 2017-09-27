IlottoApp.factory('PersonalAreaService', ['$http', '$rootScope', function ($http, $rootScope) {
    var futureForms, deposits, namedForms, withdrawals, oldForms, wins;

    function getSetFuture(data) {
        if (data !== 'undefined' && typeof data === 'object') {
            futureForms = data;
            return void [0];
        }
        return futureForms;
    };
    function getSetDeposits(data) {
        if (data !== 'undefined' && typeof data === 'object') {
            deposits = data;
            return void [0];
        }
        return deposits;
    };
    function getSetNamedForms(data) {
        if (data !== 'undefined' && typeof data === 'object') {
            namedForms = data;
            return void [0];
        }
        return namedForms;
    };
    function getSetWithdrawals(data) {
        if (data !== 'undefined' && typeof data === 'object') {
            withdrawals = data;
            return void [0];
        }
        return withdrawals;
    };
    function getSetOldForms(data) {
        if (data !== 'undefined' && typeof data === 'object') {
            oldForms = data;
            return void [0];
        }
        return oldForms;
    };
    function getSetWins(data) {
        if (data !== 'undefined' && typeof data === 'object') {
            wins = data;
            return void [0];
        }
        return wins;
    };
    function Eraser() {
        futureForms = null, deposits = null, namedForms = null, withdrawals = null, oldForms = null, wins = null;
    };

    var setAction = function (action, params) {
        var _Url = $rootScope.baseUrl + 'PersonalArea' + '/' + action;
        if (params && typeof params === 'object') {
            for (var i in params) {
                _Url += (_Url.indexOf('?') < 0 ? '?' : '&') + i + '=' + params[i];
            }
        }
        return _Url;
    }
    return {
        Eraser:Eraser,
        GetSetFuture: getSetFuture,
        GetSetDeposits: getSetDeposits,
        GetSetNamedForms: getSetNamedForms,
        GetSetWithdrawals: getSetWithdrawals,
        GetSetOldForms: getSetOldForms,
        GetSetWins: getSetWins,
        FutureForms: function (Data) {
            return $http.post(setAction('FutureForms', Data), "json", "application/json; charset=utf-8");
        },        
        Deposits: function (Data) {
            return $http.post(setAction('GetDeposits', Data), "json", "application/json; charset=utf-8");
        },
        NamedForms: function (Data) {
            return $http.post(setAction('GetNamedForms', Data), "json", "application/json; charset=utf-8");
        },
        OldForms: function (Data) {
            return $http.post(setAction('GetOldForms', Data), "json", "application/json; charset=utf-8");
        },
        Wins: function (Data) {
            return $http.post(setAction('GetWins', Data), "json", "application/json; charset=utf-8");
        },
        Withdrawals: function (Data) {
            return $http.post(setAction('GetWithdrawals', Data), "json", "application/json; charset=utf-8");
        },
        GetSweepstakes: function () {
            return $http.get(setAction('SweepstakesArchive'), "json", "application/json; charset=utf-8");
        },
    }
}]);