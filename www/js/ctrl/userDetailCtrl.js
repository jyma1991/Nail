controllersModel.controller('UserDetailCtrl', function ($scope, $stateParams, Users, $state, toast) {

    $scope.user = Users.get($stateParams.userId);
    if (!$scope.user) {
        $scope.user = {
            id: -1,
            birthday: new Date()
        };
    }

    $scope.save = function (valid) {
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