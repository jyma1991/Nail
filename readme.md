##用户信息表
-------------
id id
姓名 name
手机号 mobile
生日 birthday
加入时间 addDate
修改时间 editDate
余额   balance
extInfo 

流水表
----------
id id
用户 userId
姓名 name
手机号 mobile
时间  inDate
消费/充值  0/1 type
金额  amount
ext1

sqlite
-----------
I have solved the error by referring this link : https://www.thepolyglotdeveloper.com/2014/11/use-sqlite-instead-local-storage-ionic-framework/

step-1 : Download this : Link and copy ng-cordova.min.js into your "www/js" directory.

step-2 : use this command to in cmd

cordova plugin add https://github.com/brodysoft/Cordova-SQLitePlugin.git
step-3 : Open your index.html file and add the following line:

<script src="js/ng-cordova.min.js"></script>
It is very important you add it above the cordova.js line otherwise it will not work.

step-4 : One more thing must be added before we can start using ngCordova. We need to inject it into our angular.module, found in app.js, like the following:

angular.module('starter', ['ionic', 'ngCordova'])
That's it. Now sqlite is usable.

