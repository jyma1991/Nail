angular.module('starter.controllers', [])

  .controller('DashCtrl', function ($scope) { })

  .controller('UsersCtrl', function ($scope, Users, $state) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // $scope.users = Users.all();
    $scope.remove = function (user) {
      Users.remove(user);
    };


    $scope.add = function () {
      $state.go('tab.user-detail');
    };

    $scope.$on("$ionicView.beforeEnter", function (event, data) {
      // handle event
      $scope.users = Users.all();
    });

  })

  .controller('UserDetailCtrl', function ($scope, $stateParams, Users, $state, $cordovaSQLite) {

    $scope.user = Users.get($stateParams.userId);
    if (!$scope.user) {
      $scope.user = { id: -1 };
    }

    $scope.save = function () {
      console.log($scope.user);
      if ($scope.user.id == -1) {

        addItem($scope.user);
        //window.plugins.toast.show("Here's a message", 'long', 'bottom')
      } else {
        updateItem(user);
      }
      $state.go('tab.users');
    };

    function addItem(user) {
      // window.plugins.toast.show('add user', 'long', 'bottom');
      var db = window.sqlitePlugin.openDatabase({ name: 'nail.db', location: 'default' });
      db.transaction(function (tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS Users ([id] INTEGER PRIMARY KEY NOT NULL,name,mobile,[birthday] DATE,[addDate] DATE,[editDate] DATE,[balance] INTEGER,extInfo)');

        var query = "INSERT INTO Users (name,mobile,birthday,addDate,editDate,balance) VALUES (?,?,?,?,?,?)";

        tx.executeSql(query, [user.name, user.mobile, user.birthday, new Date(), new Date(), user.balance]);
      }, function (error) {
        window.plugins.toast.show('transaction error: ' + error.message, 'long', 'bottom');
      }, function () {
        window.plugins.toast.show('transaction ok', 'short', 'bottom');
      });
    }

    function updateItem(user) {

      var db = window.sqlitePlugin.openDatabase({ name: 'nail.db', location: 'default' });
      db.transaction(function (tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS Users ([id] INTEGER PRIMARY KEY NOT NULL,name,mobile,[birthday] DATE,[addDate] DATE,[editDate] DATE,[balance] INTEGER,extInfo)');

        var query = "UPDATE Users set (name,mobile,birthday,addDate,editDate,balance) VALUES (?,?,?,?,?,?) Where id=" + user.id;

        tx.executeSql(query, [user.name, user.mobile, user.birthday, new Date(), new Date(), user.balance], function (tx, res) {
          tx.executeSql('CREATE TABLE IF NOT EXISTS Record ([id] INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,userId,name,mobile,[inDate] DATE,type,[amount] INTEGER ,ext1)');
          //插入流水
          var query = "INSERT INTO Record (userId,name,mobile,inDate,type,amount) VALUES (?,?,?,?,?,?)";

          tx.executeSql(query, [user.id, user.name, user.mobile, new Date(), user.InOut, user.amount, ''], function (tx, res) {
            window.plugins.toast.show('更新流水: ' + error.message, 'long', 'bottom');
          });

        },
          function (tx, error) {
            window.plugins.toast.show('更新出错: ' + error.message, 'long', 'bottom');
          });
      }, function (error) {
        window.plugins.toast.show('transaction error: ' + error.message, 'long', 'bottom');
      }, function () {
        window.plugins.toast.show('transaction ok', 'short', 'bottom');
      });
    }

  });

// .controller('AccountCtrl', function($scope) {
//   $scope.settings = {
//     enableFriends: true
//   };
// });
