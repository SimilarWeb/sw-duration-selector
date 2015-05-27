/**
 * Created by vlads on 18/5/2015.
 */
angular.module('sw.components', [])
	.constant('swDurationConfig', {
		cssClass: 'durationSelector',
		displayFormat: 'MMM, YYYY',
		customFormat: 'YYYY.MM'
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
				var duration = $scope.duration.split('-');
				this.minDate = moment($scope.minDate);
				this.maxDate = moment($scope.maxDate);
				this.model = duration.length > 1
					? {startDate: moment(duration[0]), endDate: moment(duration[1])}
					: {startDate: this.maxDate, endDate: this.maxDate};
				this.updateModel = function (value) {
					$scope.model = value;
				};
			},
			compile: function compile ($templateElement, $templateAttributes) {
				return function link ($scope, $linkElement, $linkAttributes) {
					var duration = $scope.duration.split('-');
					$scope.options = swDurationConfig;
					if (duration.length > 1) {
						$scope.model.displayText = moment(duration[0]).format($scope.options.displayFormat) + ' - ' + moment(duration[1]).format($scope.options.displayFormat) + ' (Custom)';
					}
					else {
						$scope.model = $scope.presets.find(function(element) {
							return element.value == $scope.duration;}
						);
					}

					$scope.setCustom = function () {
						var model = $scope.model;
						if ($scope.showCustom) {
							$scope.model.displayText = model.startDate.format($scope.options.displayFormat) + ' - ' + model.endDate.format($scope.options.displayFormat) + ' (Custom)';
							$scope.duration = model.startDate.format($scope.options.customFormat) + '-' + model.endDate.format($scope.options.customFormat);
							$scope.showPresets = false;
						}
						else $scope.showCustom = true;
					};

					$scope.setPreset = function (preset) {
						$scope.model = preset;
						$scope.duration = preset.value;
						$scope.showPresets = false;
						$scope.showCustom = false;
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