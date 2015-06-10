'use strict';
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
	.directive('monthPicker', function (durationSelectorService, $timeout) {
		return {
			restrict: 'AE',
			require: '^swDurationSelector',
			scope: {
				type: '@', //start or end
				minDate: '=',
				maxDate: '='
			},
			templateUrl: 'src/month-picker.html',
			replace: true,
			link: function ($scope, $linkElement, $linkAttributes, ctrl) {
				var type = $scope.type,
					model = ctrl.model;

				// populate month-picker years and months
				$scope.years = durationSelectorService.yearsRange($scope.minDate.year(), $scope.maxDate.year());
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
							result = date.isBetween($scope.minDate.clone().startOf('year'), model.endDate.clone().endOf('year'));
							break;
						case 'end':
							result = date.isBetween(model.startDate.clone().startOf('year'), $scope.maxDate.clone().endOf('year'));
							break;
					}
					return result;
				};

				$scope.allowedMonth = function (month) {
					var date = moment().year($scope.selectedYear).month(month);
					return type === 'start' ? durationSelectorService.monthInRange(date, $scope.minDate, model.endDate) : durationSelectorService.monthInRange(date, model.startDate, $scope.maxDate);
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

				$scope.$watch('minDate', function (val) {
					$scope.selectedYear = $scope.selectedDate.year;
				});
			}
		}
	})
	.controller('durationSelectorCtrl', function ($scope, $timeout, durationSelectorConfig) {
		var self = this;

		this.model = {startDate: $scope.maxDate, endDate: $scope.maxDate};
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
					$scope.model = {displayText: startMoment.format(durationSelectorConfig.displayFormat) + ' - ' + endMoment.format(durationSelectorConfig.displayFormat) + ' (Custom)'};
					$scope.showCustom = true;
				}
				else {
					self.model = {startDate: $scope.maxDate, endDate: $scope.maxDate};
					$scope.model = $scope.presets.find(function(element) {
						return element.value == duration[0];}
					);
					$scope.showCustom = false;
				}
			}
		});

	})
	.directive('swDurationSelector', function ($document) {
		return {
			restrict: 'AE',
			scope: {
				minDate: '=',
				maxDate: '=',
				presets: '=',
				duration: '='
			},
			templateUrl: 'src/duration-selector.html',
			replace: true,
			controller: 'durationSelectorCtrl',
			link: function ($scope, $linkElement, $linkAttributes) {
				// for closing when clicking outside of the element
				$document.on('click', function (e) {
					if (!$linkElement.find(e.target.localName).length) {
						$scope.$apply(function () {
							$scope.showPresets = false;
						})
					}
				});
			}
		}
	});
angular.module('sw.durationSelector').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('src/duration-selector.html',
    "<div class=\"durationSelector {{options.cssClass}}\">\n" +
    "    <span class=\"durationSelector-input\" ng-click=\"showPresets = !showPresets\">{{model.displayText}}</span>\n" +
    "    <div class=\"durationSelector-popup\" ng-class=\"{custom:showCustom}\" ng-show=\"showPresets\">\n" +
    "        <div class=\"durationSelector-customPicker\" ng-show=\"showPresets && showCustom\">\n" +
    "            <month-picker class=\"left\" type=\"start\" min-date=\"minDate\" max-date=\"maxDate\"></month-picker>\n" +
    "            <month-picker class=\"right\" type=\"end\" min-date=\"minDate\" max-date=\"maxDate\"></month-picker>\n" +
    "        </div>\n" +
    "        <ul class=\"durationSelector-presets\">\n" +
    "            <li class=\"durationSelector-preset\" ng-repeat=\"preset in presets\" ng-click=\"setPreset(preset)\" ng-class=\"{'is-selected': preset.value == model.value && !showCustom, 'is-disabled': !preset.enabled}\">\n" +
    "                {{preset.buttonText}}\n" +
    "            </li>\n" +
    "            <li class=\"durationSelector-preset\" ng-click=\"setCustom()\" ng-class=\"{'is-selected': showCustom}\">\n" +
    "                {{showCustom ? 'Click to apply' : 'Custom Range'}}\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('src/month-picker.html',
    "<div class=\"monthPicker\">\n" +
    "    <div class=\"monthPicker-box\">\n" +
    "        <div class=\"monthPicker-years\">\n" +
    "            <span class=\"monthPicker-year\" ng-class=\"{'is-disabled': !allowedYear(selectedYear - 1)}\" ng-click=\"selectedYear=selectedYear-1\">< {{selectedYear - 1}}</span>\n" +
    "            <span class=\"monthPicker-year\">{{selectedYear}}</span>\n" +
    "            <span class=\"monthPicker-year\" ng-class=\"{'is-disabled': !allowedYear(selectedYear + 1)}\" ng-click=\"selectedYear=selectedYear+1\">{{selectedYear + 1}} ></span>\n" +
    "        </div>\n" +
    "        <div class=\"monthPicker-months\">\n" +
    "            <div class=\"monthPicker-month\" ng-class=\"{'is-selected': month == selectedDate.month && selectedYear == selectedDate.year, 'is-range': inRangeMonth(month), 'is-disabled': !allowedMonth(month)}\" ng-repeat=\"month in months\" ng-click=\"selectDate(month)\">{{month | monthShort}}</div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"monthPicker-date\">\n" +
    "        <span class=\"'is-disabled'\">{{type == 'start' ? 'From ' : 'To '}}</span>\n" +
    "        <span style=\"font-weight: 500\">{{selectedDate | startEndDate}}</span>\n" +
    "    </div>\n" +
    "</div>"
  );

}]);

//# sourceMappingURL=sw-duration-selector.js.map