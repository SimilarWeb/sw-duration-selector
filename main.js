/**
 * Created by vlads on 18/5/2015.
 */
angular.module('main', ['sw.components'])
	.controller('mainCtrl', function ($scope) {
		$scope.duration = '3m';
		$scope.options = {
			cssClass: 'sw-duration-selector',
			presets: [
				{
					buttonText: "Last 28 Days",
					displayText: "Last 28 Days (As of May 15)",
					enabled: true,
					value: "28d"
				},
				{
					buttonText: "1 month",
					displayText: "Apr, 2015 - Apr, 2015 (1 month)",
					enabled: true,
					value: "1m"
				},
				{
					buttonText: "Custom",
					displayText: "Apr, 2015 - Apr, 2015 (1 month)",
					enabled: true,
					value: "custom"
				}
			],
			minDate: moment(),
			maxDate: moment()
		}
	});