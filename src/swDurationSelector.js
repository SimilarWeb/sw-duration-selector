/**
 * Created by vlads on 18/5/2015.
 */
angular.module('sw.components', [])
	.directive('monthView', function($document) {
		return {
			restrict: 'AE',
			scope: {
				options: '=',
				ngModel: '='
			},
			templateUrl: 'src/month-view.html',
			replace: true,
			compile: function CompilingFunction($templateElement, $templateAttributes) {
				// === CompilingFunction === //
				// Logic is executed once (1) for every instance of ui-jq in your original UNRENDERED template.
				// Scope is UNAVAILABLE as the templates are only being cached.
				// You CAN examine the DOM and cache information about what variables
				//   or expressions will be used, but you cannot yet figure out their values.
				// Angular is caching the templates, now is a good time to inject new angular templates
				//   as children or future siblings to automatically run..

				return function LinkingFunction($scope, $linkElement, $linkAttributes) {
					// === LinkingFunction === //
					// Logic is executed once (1) for every RENDERED instance.
					// Once for each row in an ng-repeat when the row is created.
					// Note that ng-if or ng-switch may also affect if this is executed.
					// Scope IS available because controller logic has finished executing.
					// All variables and expression values can finally be determined.
					// Angular is rendering cached templates. It's too late to add templates for angular
					//  to automatically run. If you MUST inject new templates, you must $compile them manually.

					$scope.months = moment.monthsShort();
				};
			}
		}
	})
	.directive('customSelector', function($document) {
		return {
			restrict: 'AE',
			scope: {
				options: '=',
				ngModel: '='
			},
			templateUrl: 'src/custom-selector.html',
			replace: true,
			controller: function ($scope) {

			},
			compile: function CompilingFunction($templateElement, $templateAttributes) {
				// === CompilingFunction === //
				// Logic is executed once (1) for every instance of ui-jq in your original UNRENDERED template.
				// Scope is UNAVAILABLE as the templates are only being cached.
				// You CAN examine the DOM and cache information about what variables
				//   or expressions will be used, but you cannot yet figure out their values.
				// Angular is caching the templates, now is a good time to inject new angular templates
				//   as children or future siblings to automatically run..

				return function LinkingFunction($scope, $linkElement, $linkAttributes) {
					// === LinkingFunction === //
					// Logic is executed once (1) for every RENDERED instance.
					// Once for each row in an ng-repeat when the row is created.
					// Note that ng-if or ng-switch may also affect if this is executed.
					// Scope IS available because controller logic has finished executing.
					// All variables and expression values can finally be determined.
					// Angular is rendering cached templates. It's too late to add templates for angular
					//  to automatically run. If you MUST inject new templates, you must $compile them manually.

					$scope.years = ['2013', '2014', '2015'];
				};
			}
		}
	})
	.directive('swDurationSelector', function($document) {
		return {
			restrict: 'AE',
			scope: {
				options: '=',
				ngModel: '='
			},
			//require: '^customSelector',
			templateUrl: 'src/sw-duration-selector.html',
			replace: true,
			compile: function CompilingFunction($templateElement, $templateAttributes) {
				// === CompilingFunction === //
				// Logic is executed once (1) for every instance of ui-jq in your original UNRENDERED template.
				// Scope is UNAVAILABLE as the templates are only being cached.
				// You CAN examine the DOM and cache information about what variables
				//   or expressions will be used, but you cannot yet figure out their values.
				// Angular is caching the templates, now is a good time to inject new angular templates
				//   as children or future siblings to automatically run..

				return function LinkingFunction($scope, $linkElement, $linkAttributes, customSelectorCtrl) {
					// === LinkingFunction === //
					// Logic is executed once (1) for every RENDERED instance.
					// Once for each row in an ng-repeat when the row is created.
					// Note that ng-if or ng-switch may also affect if this is executed.
					// Scope IS available because controller logic has finished executing.
					// All variables and expression values can finally be determined.
					// Angular is rendering cached templates. It's too late to add templates for angular
					//  to automatically run. If you MUST inject new templates, you must $compile them manually.

					$scope.updateModel = function (preset) {
						if (preset.value === 'custom') {

						}
						else {
							// change model to one of the presets
							$scope.ngModel = preset.value;
							// and hide presets popup
							$scope.showPresets = false;
						}
					};

					// for closing when clicking outside of the element
					$document.on('click', function (e) {
						if (!$linkElement.find(e.target.localName).length) {
							$scope.$apply(function () {
								$scope.showPresets = false;
							})
						}
					});

				};
			}
		}
	});