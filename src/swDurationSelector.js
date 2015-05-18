/**
 * Created by vlads on 18/5/2015.
 */
angular.module('sw.components', [])
	.directive('swDurationSelector', function() {
		return {
			restrict: 'AE',
			scope: {
				options: '=',
				ngModel: '='
			},
			templateUrl: 'src/sw-duration-selector.html',
			replace: true,
			compile: function CompilingFunction($templateElement, $templateAttributes) {

				console.log('compile: ' + $templateElement + ', ' + $templateAttributes);
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

					console.log('link: ' + $scope + ', ' + $linkElement + ', ' +$linkAttributes);
					$scope.updateModel = function (preset) {
						$scope.ngModel = preset.value;
						$scope.showPresets = false;
					}

				};
			}
		}
	});