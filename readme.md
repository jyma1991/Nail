##用户信息表
=============

id uid
姓名 name
手机号 mobile
生日 birthday
加入时间 addDate
修改时间 editDate
余额   balance
头像 avatar
extInfo 

流水表
===========
id rid
用户 userId
时间  inDate
消费/充值  0/1 inOut
金额  amount
ext1

##Plugins
============
sqlite-storage
---------
cordova plugin add https://github.com/litehelpers/Cordova-sqlite-storage.git

# 问题解决
I have solved the error by referring this link : https://www.thepolyglotdeveloper.com/2014/11/use-sqlite-instead-local-storage-ionic-framework/

step-1 : Download this : Link and copy ng-cordova.min.js into your "www/js" directory.

step-2 : use this command to in cmd

cordova plugin add https://github.com/brodysoft/Cordova-SQLitePlugin.git
step-3 : Open your index.html file and add the following line:
'''<script src="js/ng-cordova.min.js"></script>
It is very important you add it above the cordova.js line otherwise it will not work.

step-4 : One more thing must be added before we can start using ngCordova. We need to inject it into our angular.module, found in app.js, like the following:

angular.module('starter', ['ionic', 'ngCordova'])
That's it. Now sqlite is usable.

##Toast
-----------------
cordova plugin add https://github.com/EddyVerbruggen/Toast-PhoneGap-Plugin.git

$cordovaDatePicker
-------------------------
cordova plugin add https://github.com/VitaliiBlagodir/cordova-plugin-datepicker.git

Add a class="nativedatepicker" to your element for which you want the native datepicker
Add the following jQuery fragment to handle the click on these input elements:
'''javascript
    $scope.nativedatepicker = function () {

        var myNewDate = $scope.user.birthday;

        var options = {
            date: myNewDate,
            maxDate: new Date(),
            androidTheme: 5
        };

        function onSuccess(date) {
            //alert('Selected date: ' + date.toLocaleDateString());
            $scope.user.birthday = date.toLocaleDateString();
            $state.go($state.current, {}, {reload: true});
        }

        datePicker.show(options, onSuccess);
    };
'''


## 问题 
===============
分离controller
--------------------
参考 https://forum.ionicframework.com/t/how-can-i-have-one-file-per-controller/1269/5


调试
-----------
ionic run android --livereload --consolelogs      


