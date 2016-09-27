controllersModel.controller('UsersCtrl', function ($scope, Users, $state, $ionicPopup) {

  $scope.$on("$ionicView.beforeEnter", function (event, data) {
    // handle event
    $scope.users = Users.all();
  });

  $scope.remove = function (user) {
    Users.remove(user);
  };

  $scope.addmoney = function (user, inOut) {
    $scope.user=user;

    var title ='输入消费金额';
    if(inOut){
      title='输入充值金额';
    }

    // An elaborate, custom popup
    var myPopup = $ionicPopup.show({
      template: '<input type="number" ng-model="user.amount" placeholder="可用金额:{{$scope.user.balance}}">',
      title: title,
      subTitle: '',
      scope: $scope,
      buttons: [
        { text: '取消' },
        {
          text: '<b>确认</b>',
          type: 'button-positive',
          onTap: function (e) {
            if (!$scope.user.amount || $scope.user.amount>$scope.user.balance) {
              //don't allow the user to close unless he enters wifi password
              e.preventDefault();
            } else {
              return $scope.user.amount;
            }
          }
        }
      ]
    });

  }

  $scope.add = function () {
    $state.go('tab.user-detail');
  };
});