﻿/**
 * angular-ui-notification - Angular.js service providing simple notifications using Bootstrap 3 styles with css transitions for animating
 * @author Alex_Crack
 * @version v0.0.14
 * @link https://github.com/alexcrack/angular-ui-notification
 * @license MIT
 */
angular.module("ui-notification", []),
angular.module("ui-notification").provider("Notification", function () {
    this.options = {
        delay: 5e3,
        startTop: 10,
        startRight: 10,
        verticalSpacing: 10,
        horizontalSpacing: 10,
        positionX: "right",
        positionY: "top",
        replaceMessage: !1,
        templateUrl: "angular-ui-notification.html",
        type: "primary"
    },
    this.setOptions = function (t) {
        if (!angular.isObject(t))
            throw new Error("Options should be an object!");
        this.options = angular.extend({}, this.options, t)
    }
    ,
    this.$get = ["$timeout", "$http", "$compile", "$templateCache", "$rootScope", "$injector", "$sce", "$q", "$window", function (t, e, i, n, o, s, a, r, l) {
        var p = this.options
          , c = p.startTop
          , u = p.startRight
          , d = p.verticalSpacing
          , m = p.horizontalSpacing
          , g = p.delay
          , f = []
          , h = !1
          , v = function (s, v) {
              var y = r.defer();
              return "object" != typeof s && (s = {
                  message: s
              }),
              s.scope = s.scope ? s.scope : o,
              s.template = s.templateUrl ? s.templateUrl : p.templateUrl,
              s.delay = angular.isUndefined(s.delay) ? g : s.delay,
              s.type = v ? v : (s.type? s.type : ''),
              s.positionY = s.positionY ? s.positionY : p.positionY,
              s.positionX = s.positionX ? s.positionX : p.positionX,
              s.replaceMessage = s.replaceMessage ? s.replaceMessage : p.replaceMessage,
              e.get(s.template, {
                  cache: n
              }).success(function (e) {
                  debugger;
                  var n = s.scope.$new();
                  n.message = a.trustAsHtml(s.message),
                  n.title = a.trustAsHtml(s.title),
                  n.t = s.type.substr(0, 1),
                  n.delay = s.delay;
                  var o = function () {
                      for (var t = 0, e = 0, i = c, n = u, o = [], a = f.length - 1; a >= 0; a--) {
                          var r = f[a];
                          if (s.replaceMessage && a < f.length - 1)
                              r.addClass("killed");
                          else {
                              var l = parseInt(r[0].offsetHeight)
                                , p = parseInt(r[0].offsetWidth)
                                , g = o[r._positionY + r._positionX];
                              h + l > window.innerHeight && (g = c,
                              e++,
                              t = 0);
                              var h = i = g ? 0 === t ? g : g + d : c
                                , v = n + e * (m + p);
                              r.css(r._positionY, h + "px"),
                              "center" == r._positionX ? r.css("left", parseInt(window.innerWidth / 2 - p / 2) + "px") : r.css(r._positionX, v + "px"),
                              o[r._positionY + r._positionX] = h + l,
                              t++
                          }
                      }
                  }
                    , r = i(e)(n);
                  r._positionY = s.positionY,
                  r._positionX = s.positionX,
                  r.addClass(s.type),
                  r.bind("webkitTransitionEnd oTransitionEnd otransitionend transitionend msTransitionEnd click", function (t) {
                      t = t.originalEvent || t,
                      ("click" === t.type || "opacity" === t.propertyName && t.elapsedTime >= 1) && (r.remove(),
                      f.splice(f.indexOf(r), 1),
                      o())
                  }
                  ),
                  angular.isNumber(s.delay) && t(function () {
                      r.addClass("killed")
                  }
                  , s.delay),
                  angular.element(document.getElementsByTagName("body")).append(r);
                  var p = -(parseInt(r[0].offsetHeight) + 50);
                  r.css(r._positionY, p + "px"),
                  f.push(r),
                  n._templateElement = r,
                  n.kill = function (e) {
                      e ? (f.splice(f.indexOf(n._templateElement), 1),
                      n._templateElement.remove(),
                      t(o)) : n._templateElement.addClass("killed")
                  }
                  ,
                  t(o),
                  h || (angular.element(l).bind("resize", function () {
                      t(o)
                  }
                  ),
                  h = !0),
                  y.resolve(n)
              }
              ).error(function (t) {
                  throw new Error("Template (" + s.template + ") could not be loaded. " + t)
              }
              ),
              y.promise
          }
        ;
        return v.primary = function (t) {
            debugger;
            return this(t, "primary")
        }
        ,
        v.error = function (t) {
            return this(t, "error")
        }
        ,
        v.success = function (t) {
            return this(t, "success")
        }
        ,
        v.info = function (t) {
            return this(t, "info")
        }
        ,
        v.warning = function (t) {
            return this(t, "warning")
        }
        ,
        v.clearAll = function () {
            angular.forEach(f, function (t) {
                t.addClass("killed")
            }
            )
        }
        ,
        v
    }
    ]
}
),
angular.module("ui-notification").run(["$templateCache", function (t) {
    t.put("angular-ui-notification.html", '<div class="ui-notification"><h3 ng-show="title" ng-bind-html="title"></h3><div class="message" ng-bind-html="message"></div></div>')
}
]);
