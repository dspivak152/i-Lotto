'use strict';
IlottoApp.filter("objectFilter", function () {
    return function(input){
        angular.forEach(input,function(key,val){
            if(typeof input[val].item == "string"){
                input[val].item = JSON.parse(input[val].item);
            }
        })
        return input;
    }
});
IlottoApp.filter('FilterFormReception', function () {
    return function (obj, vars) {
        if (typeof obj === 'object' && obj.length > 0) {
            return $.map(obj, function (form) {
                if (form.FormReception !== null && typeof form.FormReception == 'object'
                    && typeof form.FormReception.Link == 'string' && form.FormReception.Link.length > 5) {
                    form.FormReception.Link = form.FormReception.Link.replace('www.dropbox.com', 'dl.dropboxusercontent.com');
                    return form;
                }
            });
        }
        return obj;
    }
});