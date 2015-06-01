angular.module('sw.durationSelector', [])
	.constant('durationSelectorConfig', {
		cssClass: 'durationSelector',
		displayFormat: 'MMM, YYYY',
		customFormat: 'YYYY.MM'
	})
	.service('durationSelectorService', function() {
		this.monthsRange = function () {
			return Array.apply(null, {length: 12}).map(Number.call, Number);
		};

		// given start and end years returns the array of years in between included
		this.yearsRange = function (start, end) {
			return Array.apply(null, {length: end - start + 1}).map(function(num, index) {
				return start + index;
			});
		};

		this.monthInRange = function (moment, start, end) {
			return moment.isBetween(start, end, 'month') || moment.isSame(start, 'month') || moment.isSame(end, 'month');
		};
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
	.controller('monthPickerCtrl', function ($scope, durationSelectorService) {
		var type = $scope.type,
			self = this;

		this.init = function (mainCtrl){
			self.mainCtrl = mainCtrl;
			self.model = mainCtrl.model;
			self.minDate = mainCtrl.minDate;
			self.maxDate = mainCtrl.maxDate;

		};

		// populate month-picker years and months
		$scope.years = durationSelectorService.yearsRange(self.minDate.year(), self.maxDate.year());
		$scope.months = durationSelectorService.monthsRange();

		$scope.selectedDate = {
			year: self.model[type + 'Date'].year(),
			month: self.model[type + 'Date'].month()
		};
		$scope.selectedYear = $scope.selectedDate.year;

		$scope.selectDate = function (month) {
			$scope.selectedDate = {
				year: $scope.selectedYear,
				month: month
			};
			self.model[type + 'Date'] = moment().year($scope.selectedDate.year).month($scope.selectedDate.month);
			self.mainCtrl.updateModel(self.model);
		};

		$scope.allowedYear = function (year) {
			var date = moment().year(year),
				result;
			switch (type) {
				case 'start':
					result = date.isBetween(self.minDate.clone().startOf('year'), self.model.endDate.clone().endOf('year'));
					break;
				case 'end':
					result = date.isBetween(self.model.startDate.clone().startOf('year'), self.maxDate.clone().endOf('year'));
					break;
			}
			return result;
		};

		$scope.allowedMonth = function (month) {
			var date = moment().year($scope.selectedYear).month(month);
			return type === 'start' ? durationSelectorService.monthInRange(date, self.minDate, self.model.endDate) : durationSelectorService.monthInRange(date, self.model.startDate, self.maxDate);
		};

		$scope.inRangeMonth = function (month) {
			var date = moment().year($scope.selectedYear).month(month);
			return durationSelectorService.monthInRange(date, self.model.startDate, self.model.endDate);
		};
	})
	//.directive('monthPicker', function () {
	//	return {
	//		restrict: 'AE',
	//		require: ['monthPicker', '^swDurationSelector'],
	//		scope: {
	//			type: '@' //start or end
	//		},
	//		templateUrl: 'src/month-picker.html',
	//		replace: true,
	//		controller: 'monthPickerCtrl',
	//		link: function ($scope, $linkElement, $linkAttributes, ctrls) {
	//			ctrls[0].init(ctrls[1]);
	//		}
	//	}
	//})
	.directive('monthPicker', function (durationSelectorService) {
		return {
			restrict: 'AE',
			require: '^swDurationSelector',
			scope: {
				type: '@' //start or end
			},
			templateUrl: 'src/month-picker.html',
			replace: true,
			link: function ($scope, $linkElement, $linkAttributes, ctrl) {
				var type = $scope.type,
					model = ctrl.model,
					minDate = ctrl.minDate,
					maxDate = ctrl.maxDate;

				// populate month-picker years and months
				$scope.years = durationSelectorService.yearsRange(minDate.year(), maxDate.year());
				$scope.months = durationSelectorService.monthsRange();

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
					return type === 'start' ? durationSelectorService.monthInRange(date, minDate, model.endDate) : durationSelectorService.monthInRange(date, model.startDate, maxDate);
				};

				$scope.inRangeMonth = function (month) {
					var date = moment().year($scope.selectedYear).month(month);
					return durationSelectorService.monthInRange(date, model.startDate, model.endDate);
				};
			}
		}
	})
	.controller('durationSelectorCtrl', function ($scope, durationSelectorConfig, $document) {
		var duration = $scope.duration.split('-'),
			self = this;
		this.init = function (_ngModelCtrl, _element) {
			self.ngModelCtrl = _ngModelCtrl;
			self.ngModelCtrl.$render = function() {
				var ngModelCtrl = this;
				var duration = ngModelCtrl.$modelValue.split('-');
				if (duration.length > 1) {
					ngModelCtrl.$viewValue = moment(duration[0]).format(durationSelectorConfig.displayFormat) + ' - ' + moment(duration[1]).format(durationSelectorConfig.displayFormat) + ' (Custom)';
				}
				else {
					ngModelCtrl.$viewValue = $scope.presets.find(function(element) {
						return element.value == ngModelCtrl.$modelValue;}
					).displayText;
				}
				_element.children()[0].value = ngModelCtrl.$viewValue;
			};
		};

		this.setModel = function () {
			var model = $scope.model;
			if ($scope.showCustom) {
				//$scope.model.displayText = model.startDate.format($scope.options.displayFormat) + ' - ' + model.endDate.format($scope.options.displayFormat) + ' (Custom)';
				$scope.duration = model.startDate.format($scope.options.customFormat) + '-' + model.endDate.format($scope.options.customFormat);
				$scope.showPresets = false;
			}
			else $scope.showCustom = true;
		};

		this.minDate = moment.isMoment($scope.minDate) ? $scope.minDate : moment($scope.minDate);
		this.maxDate = moment.isMoment($scope.maxDate) ? $scope.maxDate : moment($scope.maxDate);
		this.model = duration.length > 1
			? {startDate: moment(duration[0]), endDate: moment(duration[1])}
			: {startDate: this.maxDate, endDate: this.maxDate};
		this.updateModel = function (value) {
			$scope.model = value;
		};
	})
	.directive('swDurationSelector', function ($compile, $document) {
		return {
			restrict: 'E',
			scope: {
				minDate: '=',
				maxDate: '=',
				presets: '=',
				duration: '='
			},
			replace: true,
			templateUrl: 'src/duration-selector.html',
			require: ['swDurationSelector', '^ngModel'],
			controller: 'durationSelectorCtrl',
			link: function ($scope, element, attrs, ctrls) {
				var durationSelectorCtrl = ctrls[0],
					ngModelCtrl = ctrls[1];

				//ngModelCtrl.$render = function () {
				//
				//};
				durationSelectorCtrl.init(ngModelCtrl, element);

				$scope.setPreset = function (preset) {
					$scope.model = preset;
					$scope.duration = preset.value;
					$scope.showPresets = false;
					$scope.showCustom = false;
				};

				// for closing when clicking outside of the element
				$document.on('click', function (e) {
					if (!element.find(e.target.localName).length) {
						$scope.$apply(function () {
							$scope.showPresets = false;
						})
					}
				});
			}
		}
	});