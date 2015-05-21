/**
 * Created by vlads on 18/5/2015.
 */
angular.module('sw.components', [])
	.filter('monthShort', function() {
		return function(value) {
			return moment.monthsShort(value);
		};
	})
	.directive('monthPicker', function () {
		return {
			restrict: 'AE',
			require: '^swDurationSelector',
			scope: {
				type: '=',
				ngModel: '='
			},
			templateUrl: 'src/month-picker.html',
			replace: true,
			compile: function ($templateElement, $templateAttributes) {
				var months = Array.apply(null, {length: 12}).map(Number.call, Number),//moment.monthsShort(),// array of months ['Jan', 'Feb',..]
					yearsArray = function (start, end) { // array of years [2013, 2014, ..]
						return Array.apply(null, {length: end - start + 1}).map(function(num, index) {
							return start + index;
						});
					};
				return function ($scope, $linkElement, $linkAttributes, mainCtrl) {
					var type = $linkAttributes.type,
						model = mainCtrl.model,
						minDate = mainCtrl.minDate,
						maxDate = mainCtrl.maxDate;
					// populate month-picker years and months
					$scope.years = yearsArray(minDate.year(), maxDate.year());
					$scope.months = months;

					$scope.selectedYear = model[type + 'Date'].year();
					$scope.selectedDate = {
						year: model[type + 'Date'].year(),
						month: model[type + 'Date'].month()
					};

					$scope.selectDate = function (month) {
						$scope.selectedDate = {
							year: $scope.selectedYear,
							month: month
						};
						model[type + 'Date'] = moment().year($scope.selectedDate.year).month($scope.selectedDate.month);
						console.log(model);
					};

					$scope.allowedMonth = function (month) {
						var date = moment().year($scope.selectedYear).month(month).startOf('month');
						return date.isAfter(minDate) && date.isBefore(maxDate);
					};
				};
			}
		}
	})
	.directive('swDurationSelector', function ($document) {
		return {
			restrict: 'AE',
			scope: {
				options: '=',
				ngModel: '='
			},
			templateUrl: 'src/sw-duration-selector.html',
			replace: true,
			controller: function ($scope) {
				var model = $scope.ngModel.split('-');
				this.minDate = $scope.options.minDate;
				this.maxDate = $scope.options.maxDate;
				this.model = model.length > 1
					? {startDate: moment(model[0]), endDate: moment(model[1])}
					: {startDate: this.maxDate, endDate: this.maxDate};
			},
			compile: function ($templateElement, $templateAttributes) {
				// === CompilingFunction === //
				// Logic is executed once (1) for every instance of ui-jq in your original UNRENDERED template.
				// Scope is UNAVAILABLE as the templates are only being cached.
				// You CAN examine the DOM and cache information about what variables
				//   or expressions will be used, but you cannot yet figure out their values.
				// Angular is caching the templates, now is a good time to inject new angular templates
				//   as children or future siblings to automatically run..

				return function ($scope, $linkElement, $linkAttributes) {
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
							$scope.showCustom = true;
						}
						else {
							// change model to one of the presets
							$scope.ngModel = preset.value;
							// and hide presets popup
							$scope.showPresets = false;
							$scope.showCustom = false;
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