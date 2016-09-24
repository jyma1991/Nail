angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('UsersCtrl', function($scope,Users,$state) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.users = Users.all();
  $scope.remove = function(user) {
    Users.remove(user);
  };


  $scope.add = function(){
    $state.go('tab.user-detail');
  };

})

.controller('UserDetailCtrl', function($scope, $stateParams, Users,$state) {
  $scope.user = Users.get($stateParams.userId);



 $scope.add = function(){
    console.log("add");
    console.log($scope.user);
    $state.go('tab.users');
  };

   $scope.save = function(){
     console.log('save');
     console.log($scope.user);
    $state.go('tab.users');
  };

});

// .controller('AccountCtrl', function($scope) {
//   $scope.settings = {
//     enableFriends: true
//   };
// });
