IlottoApp.service('NotificationService', ['$rootScope', 'Notification', '$timeout', function ($rootScope, Notification, $timeout) {
    var SetUpNotification = function (Note) {
        if (typeof _Note == 'undefined')
            _Note = {}
        _Note = {
            type: (Note.type && Note.type != '' ? Note.type : 'success'),
            message: (Note.message && Note.message != '' ? Note.message : null),
            title: (Note.title && Note.title != '' ? Note.title : null),
            delay: (isNaN(Note.delay) ? 6000 : Note.delay),
            replaceMessage: (Note.replaceMessage ? true : false),
            positionX: (Note.positionX && Note.positionX != '' ? Note.positionX : "center")
        };
        return _Note;
    }
    var PopTheMessege = function (Note, callback) {
        Notification(SetUpNotification(Note)).then(function () {
            if (typeof callback === 'function') {
                $timeout(function () {
                    callback();
                }, _Note.delay);
            }                
        });
    }
    return {
        Primary: function (Note, callback) {
            if (!Note.message || Note.message == '')
                return;
            Note.type = "primary";
            PopTheMessege(Note, callback);
        },
        Info: function (Note, callback) {
            if (!Note.message || Note.message == '')
                return;
            Note.type = "info";
            PopTheMessege(Note, callback);
        },
        Success: function (Note, callback) {
            if (!Note.message || Note.message == '')
                return;
            Note.type = "success";
            PopTheMessege(Note, callback);
        },
        Warning: function (Note, callback) {
            if (!Note.message || Note.message == '')
                return;
            Note.type = "warning";
            PopTheMessege(Note, callback);
        },
        Error: function (Note, callback) {
            if (!Note.message || Note.message == '')
                return;
            Note.type = "error";
            PopTheMessege(Note, callback);
        },        
        Pop: function (Note, callback) {
            if (!Note.message || Note.message == '')
                return;
            PopTheMessege(Note, callback);
        },
        KillPop: function (isHard, callback) {
            isHard = isHard ? isHard : false;
            PopTheMessege(Note, callback);
        },
    };
}
]);