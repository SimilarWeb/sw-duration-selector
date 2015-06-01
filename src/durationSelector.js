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
	//.controller('monthPickerCtrl', function ($scope, durationSelectorService) {
	//	var type = $scope.type,
	//		self = this;
	//
	//	this.init = function (mainCtrl){
	//		self.mainCtrl = mainCtrl;
	//		self.model = mainCtrl.model;
	//		self.minDate = mainCtrl.minDate;
	//		self.maxDate = mainCtrl.maxDate;
	//
	//	};
	//
	//	// populate month-picker years and months
	//	$scope.years = durationSelectorService.yearsRange(self.minDate.year(), self.maxDate.year());
	//	$scope.months = durationSelectorService.monthsRange();
	//
	//	$scope.selectedDate = {
	//		year: self.model[type + 'Date'].year(),
	//		month: self.model[type + 'Date'].month()
	//	};
	//	$scope.selectedYear = $scope.selectedDate.year;
	//
	//	$scope.selectDate = function (month) {
	//		$scope.selectedDate = {
	//			year: $scope.selectedYear,
	//			month: month
	//		};
	//		self.model[type + 'Date'] = moment().year($scope.selectedDate.year).month($scope.selectedDate.month);
	//		self.mainCtrl.updateModel(self.model);
	//	};
	//
	//	$scope.allowedYear = function (year) {
	//		var date = moment().year(year),
	//			result;
	//		switch (type) {
	//			case 'start':
	//				result = date.isBetween(self.minDate.clone().startOf('year'), self.model.endDate.clone().endOf('year'));
	//				break;
	//			case 'end':
	//				result = date.isBetween(self.model.startDate.clone().startOf('year'), self.maxDate.clone().endOf('year'));
	//				break;
	//		}
	//		return result;
	//	};
	//
	//	$scope.allowedMonth = function (month) {
	//		var date = moment().year($scope.selectedYear).month(month);
	//		return type === 'start' ? durationSelectorService.monthInRange(date, self.minDate, self.model.endDate) : durationSelectorService.monthInRange(date, self.model.startDate, self.maxDate);
	//	};
	//
	//	$scope.inRangeMonth = function (month) {
	//		var date = moment().year($scope.selectedYear).month(month);
	//		return durationSelectorService.monthInRange(date, self.model.startDate, self.model.endDate);
	//	};
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

				$scope.$watch(function(){return ctrl.model;}, function (val) {
					$scope.selectedDate = {
						year: val[type + 'Date'].year(),
						month: val[type + 'Date'].month()
					};
					$scope.selectedYear = $scope.selectedDate.year;
					model[type + 'Date'] = moment().year($scope.selectedDate.year).month($scope.selectedDate.month);
				});
			}
		}
	})
	.controller('durationSelectorCtrl', function ($scope, $timeout, durationSelectorConfig) {
		var self = this,
			ngModelCtrl;

		this.init = function (_ngModelCtrl) {
			ngModelCtrl = _ngModelCtrl;
			ngModelCtrl.$viewChangeListeners.push(function(){
				ngModelCtrl.$render();
				ngModelCtrl.$$rawModelValue = $scope.duration;
			});
			$timeout(function() {
				$scope.duration = ngModelCtrl.$viewValue;
			});

		};
		this.minDate = moment.isMoment($scope.minDate) ? $scope.minDate : moment($scope.minDate);
		this.maxDate = moment.isMoment($scope.maxDate) ? $scope.maxDate : moment($scope.maxDate);
		this.model = {startDate: self.maxDate, endDate: self.maxDate};
		this.updateModel = function (value) {
			self.model = value;
		};

		$scope.setPreset = function (preset) {
			$scope.duration = preset.value;
			$scope.showPresets = false;
			$scope.showCustom = false;
		};

		$scope.setCustom = function () {
			if ($scope.showCustom) {
				$scope.duration = self.model.startDate.format(durationSelectorConfig.customFormat) + '-' + self.model.endDate.format(durationSelectorConfig.customFormat);
				$scope.showPresets = false;
			}
			else $scope.showCustom = true;
		};

		$scope.$watch('duration', function (val) {
			if (val) {
				var duration = val.split('-');
				if (duration.length > 1) {
					var startMoment = moment(new Date(duration[0])),
						endMoment = moment(new Date(duration[1]));
					self.model = {startDate: startMoment, endDate: endMoment};
					ngModelCtrl.$setViewValue(startMoment.format(durationSelectorConfig.displayFormat) + ' - ' + endMoment.format(durationSelectorConfig.displayFormat) + ' (Custom)');
					$scope.showCustom = true;
				}
				else {
					self.model = {startDate: self.maxDate, endDate: self.maxDate};
					ngModelCtrl.$setViewValue($scope.presets.find(function(element) {
						return element.value == duration[0];}
					).displayText);
				}
			}
		});

	})
	.directive('swDurationSelector', function ($compile, $document) {
		return {
			restrict: 'E',
			scope: {
				minDate: '=',
				maxDate: '=',
				presets: '='
			},
			replace: true,
			templateUrl: 'src/duration-selector.html',
			require: ['swDurationSelector', '^ngModel'],
			controller: 'durationSelectorCtrl',
			link: function ($scope, element, attrs, ctrls) {
				var durationSelectorCtrl = ctrls[0],
					ngModelCtrl = ctrls[1];

				ngModelCtrl.$render = function() {
					element.children()[0].value = ngModelCtrl.$viewValue;
				};
				durationSelectorCtrl.init(ngModelCtrl);

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