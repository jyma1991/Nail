angular.module('starter.controllers', []).controller('DashCtrl',function ($scope,dash) {

    $scope.$on("$ionicView.beforeEnter", function (event, data) {
      // handle event
      $scope.records = dash.all();
    });
 });