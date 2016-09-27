controllersModel.controller('DashCtrl',function ($scope,dash) {

    $scope.$on("$ionicView.beforeEnter", function (event, data) {
      // handle event
      $scope.status = dash.all();
    });
 });