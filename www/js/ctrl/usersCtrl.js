controllersModel.controller('UsersCtrl', function ($scope, Users, $state, $ionicPopup) {

  //$scope.users = Users.all();
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
    var title = '输入充值金额';
    var template='<input type="number" ng-model="user.amount">';
    if (!inOut) {
      title = '输入消费金额和类型';
      template='<div class="list"><label class="item item-input"><span class="input-label">金额</span><input type="number" ng-model="user.amount"></label><label class="item item-input"><span class="input-label">类型</span><input ng-model="user.remark" type="text"></label></div>'
    }

    // An elaborate, custom popup
    var myPopup = $ionicPopup.show({
      template: template,
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
              return $scope.user;
            }
          }
        }
      ]
    });

    myPopup.then(function (res) {
      //alert(JSON.stringify($scope.user));
      Users.update($scope.user);
      $scope.users = Users.all();
      //$state.go($state.current, {}, { reload: true });   
      //$state.go('tab.user-detail',{userId:$scope.user.id});
    });

  }

  $scope.add = function () {
    $state.go('tab.user-detail');
  };
});