controllersModel.controller('DashCtrl', function ($scope, dash, $rootScope) {
  //$scope.status = dash.all();
  $scope.$on("$ionicView.beforeEnter", function (event, data) {
    // handle event
    $scope.status = dash.all();
  });

});