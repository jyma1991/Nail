controllersModel.controller('DashCtrl', function ($scope, dash, $rootScope, $window) {
  $scope.$on("$ionicView.beforeEnter", function (event, data) {
      $scope.status = dash.all();
  });
});