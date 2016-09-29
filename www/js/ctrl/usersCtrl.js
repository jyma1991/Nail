controllersModel.controller('UsersCtrl', function ($scope, Users, $state, $ionicPopup) {

  $scope.$on("$ionicView.beforeEnter", function (event, data) {
    // handle event
    $scope.users = Users.all();
  });

  $scope.remove = function (user) {
    Users.remove(user);
  };

  $scope.addmoney = function (user, inOut) {
    $scope.user = user;
    $scope.user.inOut = inOut;
    var title = '输入消费金额';
    if (inOut) {
      title = '输入充值金额';
    }

    // An elaborate, custom popup
    var myPopup = $ionicPopup.show({
      template: '<input type="number" ng-model="user.amount">',
      title: title,
      subTitle: '可用金额:' + user.balance,
      scope: $scope,
      buttons: [
        { text: '取消' },
        {
          text: '<b>确认</b>',
          type: 'button-positive',
          onTap: function (e) {
            if (!$scope.user.amount || ($scope.user.amount > $scope.user.balance && !inOut)) {
              //don't allow the user to close unless he enters wifi password
              e.preventDefault();
            } else {
              return $scope.user.amount;
            }
          }
        }
      ]
    });

    myPopup.then(function (res) {
      $scope.user.amount = parseInt(res);
      //alert(JSON.stringify($scope.user));
      Users.update($scope.user);
      //$scope.users = Users.all();
      $state.go($state.current, {}, { reload: true });
    });

  }

  $scope.add = function () {
    $state.go('tab.user-detail');
  };
});