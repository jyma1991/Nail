
controllersModel.controller('UserDetailCtrl', function ($scope, $stateParams, Users, $state, toast) {

    $scope.user = Users.get($stateParams.userId);
    if (!$scope.user) {
        $scope.user = {
            id: -1,
            birthday: new Date().toLocaleDateString()
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
});