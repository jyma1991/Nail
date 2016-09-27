angular.module('starter.controllers', [])

  .controller('DashCtrl', function ($scope,dash) {

     $scope.$on("$ionicView.beforeEnter", function (event, data) {
      // handle event
      $scope.records = dash.all();
    });
   })

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
    
    $scope.user = Users.get($stateParams.userId);
    if (!$scope.user) {
        $scope.user = {
            id: -1,
            birthday: new Date()
        };
    }
    if ($scope.user.birthday) {
        $scope.user.birthday = $scope.user.birthday.toLocaleString();
    }

    $scope.save = function () {
        console.log($scope.user);
        if ($scope.user.id == -1) {
            //新增会员
            Users.add($scope.user);
        } else {
            //编辑或者消费
            Users.update($scope.user);
        }
        $state.go('tab.users');
    };
  });

// .controller('AccountCtrl', function($scope) {
//   $scope.settings = {
//     enableFriends: true
//   };
// });
