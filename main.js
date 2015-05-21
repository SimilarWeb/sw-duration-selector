/**
 * Created by vlads on 18/5/2015.
 */
angular.module('main', ['sw.components'])
	.controller('mainCtrl', function ($scope) {
		$scope.duration = '3m';//'2015.01-2015.04'
		$scope.minDate = '2013-01-01T00:00:00';
		$scope.maxDate = '2015-04-30T00:00:00';
	});