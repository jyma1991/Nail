controllersModel.controller('UsersCtrl', function ($scope, Users, $state) {

    $scope.$on("$ionicView.beforeEnter", function (event, data) {
      // handle event
      $scope.users = Users.all();
    });

    $scope.remove = function (user) {
      Users.remove(user);
    };

    $scope.add = function () {
      $state.go('tab.user-detail');
    };
  });