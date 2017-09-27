IlottoApp.factory('DataModelsService', ['$rootScope', function ( $rootScope) {
    return {
        formModel: function (userData) {
            return {
                ID: 0,
                BaseFormTypeID: 0,
                UserID: 0,
                Name: '',
                RaffleID: 0,
                TableCount: 0,
                Extra: null, //bool
                SystematicType: 0,
                RaffleType: 0,
                TotalFormCost: 0,
                FormCost: 0,
                TotalCommission: 0,
                FormCommission: 0,
                IsActive: 0,
                Tables: new Array(),
            }
        },
        FormTableModel: function (userData) {
            return {
                ID: 0,
                FormID: 0,
                Numbers: 0,
                StrongNumbers: 0,
            }
        },
        FormErrorModel: function () {
            return {
                OkRules: {
                    required: false,
                    requiredMessege: 'Agree To Rules Is Required!',
                },
            };
        },
        TableErrorModel: function () {
            return {
                HavError: false,
                numbers: {
                    short: false,
                    shortMessege: 'Not Enough Regular Numbers',
                    long:false,
                    longMessege: 'Too Many Regular Numbers',
                },
                strongNumbers: {
                    short: false,
                    shortMessege: 'Not Enough Strong Numbers',
                    long: false,
                    longMessege: 'Too Many Strong Numbers',
                },
            };
        },
        depositModel: function (model) {
            return {
                ID : model[0],
                UserID : model[1],
                RefrenceNumber : model[2],
                Amount : model[3],
                IsConfiremed : model[4],
                IsWithdrawal : model[5],
                ContactPhone: model[6],
                DepositDetailsID: model[7],
                BankName: model[8],
                UserName: (model[9] !== null ? model[9] : null),
                userPassword: model[10],
                AccountNumber: (model[11] !== null ? model[11] : null),
                Recipient: (model[12] !== null ? model[12] : null),
                BranchNumber: (model[13] !== null ? model[13] : null),
            }            
        },
    }
}]);