IlottoApp.directive("otcDynamic", function ($compile) {
    return {
        replace: true,
        link: function (scope, element, attrs) {
            var content = $compile(attrs.html)(scope);
            element.append(content);
        }
    }
});