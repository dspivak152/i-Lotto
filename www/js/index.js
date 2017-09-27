/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        // document.getElementById("toggleBtn").addEventListener('click', this.toggle, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        app.push = PushNotification.init({
            "android": {
                "senderID": "994611551395",
                "forceShow": true,
                "large_icon": "logo2", // notification icon
                "icon": "logo2",
                "show_in_foreground": true,
                "color": '#ED1D24',
                "vibrate": 300,
                "lights": true,
            },
            "ios": {
                "sound": true,
                "vibration": true,
                "badge": true
            },
            "windows": {}
        });

        app.push.on('registration', function (data) {
            localStorage.removeItem('IsNewRegistrationId');
            var oldRegId = localStorage.getItem('registrationId');
            var deviceType = 0;
            if (device.platform == 'Android')
            { 
                deviceType = 1;
            }
            else
            { 
                deviceType = 2;
            }
            if (oldRegId !== data.registrationId) {
                // Save new registration ID
                localStorage.setItem('registrationId', data.registrationId);
                localStorage.setItem('deviceType', deviceType);
                // Post registrationId to your app server as the value has changed
                localStorage.setItem('IsNewRegistrationId', true);
            }
        });

        app.push.on('error', function (e) {
            console.log("push error = " + e.message);
        });

        app.push.on('notification', function (data) {
            // console.log('notification event');
            app.push.finish(function () {
                // console.log('success');
            }, function () {
                console.log('error');
            });
        });
    }
};

app.initialize();
