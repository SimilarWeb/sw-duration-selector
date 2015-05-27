/**
 * Created by vlads on 18/5/2015.
 */
if (!Array.prototype.find) {
	Array.prototype.find = function(predicate) {
		if (this == null) {
			throw new TypeError('Array.prototype.find called on null or undefined');
		}
		if (typeof predicate !== 'function') {
			throw new TypeError('predicate must be a function');
		}
		var list = Object(this);
		var length = list.length >>> 0;
		var thisArg = arguments[1];
		var value;

		for (var i = 0; i < length; i++) {
			value = list[i];
			if (predicate.call(thisArg, value, i, list)) {
				return value;
			}
		}
		return undefined;
	};
}

angular.module('main', ['ui.router', 'sw.components'])
	.config(function($stateProvider) {
		$stateProvider
			.state('state', {
				abstract: true,
				url: '',
				template: '<div style="float:right;">' +
					'<sw-duration-selector ng-model="duration" presets="presets" min-date="{{minDate}}" max-date="{{maxDate}}"></sw-duration-selector>'+
					'<a ui-sref="state.1({duration: \'1m\'})">1m</a>'+
					'<a ui-sref="state.1({duration: \'3m\'})">3m</a>'+
					'<div ui-view></div>'+
				'</div>',
				controller: 'mainCtrl'
			})
			.state('state.1', {
				url: '/state1/:duration',
				template: '<h1>State 1m</h1>'
			})
			.state('state.2', {
				url: '/state2/:duration',
				template: '<h1>State 3m</h1>'
			});
	})
	.run(function($rootScope) {
		$rootScope.$on('$stateChangeStart', function (evt, toState, toParams, fromState, fromParams) {

		});
	})
	.controller('mainCtrl', function ($scope, $state) {
		$scope.duration = {value: $state.params.duration};//'2015.01-2015.04'
		$scope.minDate = '2011-01-01T00:00:00';
		$scope.maxDate = '2015-04-30T00:00:00';
		$scope.presets = [
			{
				buttonText: "Last 28 days",
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
				buttonText: "3 months",
				displayText: "Feb, 2015 - Apr, 2015 (3 month)",
				enabled: true,
				value: "3m"
			},
			{
				buttonText: "6 months",
				displayText: "Apr, 2015 - Apr, 2015 (1 month)",
				enabled: true,
				value: "6m"
			},
			{
				buttonText: "12 months",
				displayText: "Feb, 2015 - Apr, 2015 (3 month)",
				enabled: true,
				value: "12m"
			},
			{
				buttonText: "24 months",
				displayText: "Feb, 2015 - Apr, 2015 (3 month)",
				enabled: false,
				value: "24m"
			}
		]
	});