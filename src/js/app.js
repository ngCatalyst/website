console.log('app.js');

var app = angular.module('catalyst', []);

app.controller('homeCtrl', ['$scope', function ($scope) {
    var home = this;
    
    home.message = 'homeCtrl loaded...';

    $scope.imageSlider = {};
    $scope.imageSlider.images = [
        'microsoft-1.jpg',
        'microsoft-2.jpg',
        'microsoft-3.jpg',
        'microsoft-4.jpg',
    ];

}]);

app.directive('imageSlider', function() {
  return {
    templateUrl: 'image-slider.html'
  };
});