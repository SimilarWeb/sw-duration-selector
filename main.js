/**
 * Created by vlads on 18/5/2015.
 */

angular.module('main', ['ui.router', 'sw.durationSelector'])
	.config(function($stateProvider) {
		$stateProvider
			.state('state', {
				abstract: true,
				url: '',
				template: '<div style="float:right;">' +
					'<sw-duration-selector duration="duration" presets="presets" min-date="minDate" max-date="maxDate"></sw-duration-selector>'+
					'<a ui-sref="state.1({duration: \'1m\'})">1m</a>'+
					'<a ui-sref="state.2({duration: \'3m\'})">3m</a>'+
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
	.controller('mainCtrl', function ($scope, $state, $rootScope) {
		$rootScope.$on('$stateChangeStart', function (evt, toState, toParams, fromState, fromParams) {
			if (toState.name == 'state.1') {
				$scope.minDate = moment('2014-09-01T00:00:00');
			}
			else {
				$scope.minDate = moment('2015-01-01T00:00:00');
			}
		});
		$scope.duration = $state.params.duration;//'2015.01-2015.04'
		$scope.minDate = moment('2014-09-01T00:00:00');
		$scope.maxDate = moment('2015-04-30T00:00:00');
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
				displayText: "Feb, 2015 - Apr, 2015 (3 months)",
				enabled: true,
				value: "3m"
			},
			{
				buttonText: "6 months",
				displayText: "Dec, 2014 - Apr, 2015 (6 months)",
				enabled: true,
				value: "6m"
			},
			{
				buttonText: "12 months",
				displayText: "Apr, 2014 - Apr, 2015 (12 months)",
				enabled: true,
				value: "12m"
			},
			{
				buttonText: "24 months",
				displayText: "Apr, 2013 - Apr, 2015 (24 months)",
				enabled: false,
				value: "24m"
			}
		]
	});