/**
 * Created by vlads on 18/5/2015.
 */
angular.module('sw.components', [])
	.constant('swDurationConfig', {
		cssClass: 'durationSelector',
		presetFormat: 'MMM, YYYY',
		customFormat: 'MMM DD'
	})
	.filter('monthShort', function() {
		return function(value) {
			return moment.monthsShort(value);
		};
	})
	.filter('startEndDate', function() {
		return function(value) {
			return moment().year(value.year).month(value.month).format('MMMM YYYY');
		};
	})
	.directive('monthPicker', function () {
		return {
			restrict: 'AE',
			require: '^swDurationSelector',
			scope: {
				type: '@' //start or end
			},
			templateUrl: 'src/month-picker.html',
			replace: true,
			compile: function ($templateElement, $templateAttributes) {
				var months = Array.apply(null, {length: 12}).map(Number.call, Number),// array of months [0, 1,..]
					years = function (start, end) { // array of years [2013, 2014, ..]
						return Array.apply(null, {length: end - start + 1}).map(function(num, index) {
							return start + index;
						});
					},
					monthInRange = function (moment, start, end) {
						return moment.isBetween(start, end, 'month') || moment.isSame(start, 'month') || moment.isSame(end, 'month');
					};
				return function ($scope, $linkElement, $linkAttributes, ctrl) {
					var type = $scope.type,
						model = ctrl.model,
						minDate = ctrl.minDate,
						maxDate = ctrl.maxDate;

					// populate month-picker years and months
					$scope.years = years(minDate.year(), maxDate.year());
					$scope.months = months;

					$scope.selectedDate = {
						year: model[type + 'Date'].year(),
						month: model[type + 'Date'].month()
					};
					$scope.selectedYear = $scope.selectedDate.year;

					$scope.selectDate = function (month) {
						$scope.selectedDate = {
							year: $scope.selectedYear,
							month: month
						};
						model[type + 'Date'] = moment().year($scope.selectedDate.year).month($scope.selectedDate.month);
						ctrl.updateModel(model);
					};

					$scope.allowedYear = function (year) {
						var date = moment().year(year),
							result;
						switch (type) {
							case 'start':
								result = date.isBetween(minDate.clone().startOf('year'), model.endDate.clone().endOf('year'));
								break;
							case 'end':
								result = date.isBetween(model.startDate.clone().startOf('year'), maxDate.clone().endOf('year'));
								break;
						}
						return result;
					};

					$scope.allowedMonth = function (month) {
						var date = moment().year($scope.selectedYear).month(month);
						return type === 'start' ? monthInRange(date, minDate, model.endDate) : monthInRange(date, model.startDate, maxDate);
					};

					$scope.inRangeMonth = function (month) {
						var date = moment().year($scope.selectedYear).month(month);
						return monthInRange(date, model.startDate, model.endDate);
					};
				};
			}
		}
	})
	.directive('swDurationSelector', function (swDurationConfig, $document) {
		return {
			restrict: 'AE',
			scope: {
				minDate: '@',
				maxDate: '@',
				presets: '=',
				duration: '='
			},
			templateUrl: 'src/sw-duration-selector.html',
			replace: true,
			controller: function ($scope) {
				var model = $scope.duration.split('-');
				this.minDate = moment($scope.minDate);
				this.maxDate = moment($scope.maxDate);
				this.model = model.length > 1
					? {startDate: moment(model[0]), endDate: moment(model[1])}
					: {startDate: this.maxDate, endDate: this.maxDate};
				this.updateModel = function (value) {
					$scope.model = value;
				}
			},
			compile: function compile ($templateElement, $templateAttributes) {
				return function link ($scope, $linkElement, $linkAttributes) {
					$scope.model = $scope.presets.find(function(element) {
						return element.value == $scope.duration;}
					);

					$scope.options = swDurationConfig;
					$scope.updateModel = function (preset) {
						if (preset.value === 'custom') {
							$scope.showCustom = true;
							preset.value = 'apply';
						}
						else if (preset.value === 'apply') {
							$scope.showCustom = false;
							preset.value = 'custom';
						}
						else {
							// change model to one of the presets
							$scope.duration = preset;
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