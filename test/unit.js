describe('filters', function () {
	beforeEach(module('sw.durationSelector'));
	it('monthShort should return month string given month number', inject(function ($filter) {
		var filter = $filter('monthShort');
		expect(filter(0)).toEqual('Jan');
		expect(filter(11)).toEqual('Dec');
	}));

	it('startEndDate should return month string given month number', inject(function ($filter) {
		var filter = $filter('startEndDate');
		expect(filter({year: 2015, month: 0})).toEqual('January 2015');
	}));
});

describe('durationSelectorService', function () {
	var service;
	beforeEach(module('sw.durationSelector'));
	beforeEach(inject(function(durationSelectorService){
		service = durationSelectorService;
	}));

	it('monthsRange should return an array [0,..,11]', function () {
		expect(service.monthsRange()).toEqual([0, 1, 2, 3, 4 , 5, 6, 7, 8, 9, 10, 11]);
	});

	it('yearsRange should return an array of years', function () {
		expect(service.yearsRange(2012, 2015)).toEqual([2012, 2013, 2014, 2015]);
	});

	it('monthInRange should check if some moment is [start, end]', function() {
		var start = moment().year(2015).month(1),
			end = moment().year(2015).month(10);
		expect(service.monthInRange(moment().year(2015).month(5), start, end)).toBe(true);
		expect(service.monthInRange(moment().year(2015).month(1), start, end)).toBe(true);
		expect(service.monthInRange(moment().year(2015).month(10), start, end)).toBe(true);
		expect(service.monthInRange(moment().year(2015).month(11), start, end)).toBe(false);
	});

	it('parseDate should create Date from string', function() {
		expect(service.parseDate('2015.05')).toEqual(new Date('2015-05'));
	});

	it('customDuration should create Date from string', function() {
		expect(service.customDuration({startDate: moment().year(2014).month(0), endDate: moment().year(2015).month(4)})).toEqual('2014.01-2015.05');
	});
});

describe('durationSelectorCtrl', function() {
	var ctrl, scope;
	beforeEach(module('sw.durationSelector'));
	beforeEach(inject(function(_$rootScope_, _$controller_){
		//Simulating isolate scope variables from the directive
		scope = _$rootScope_.$new();
		var data = {
			duration:'3m',
			minDate:moment('2014-09-01T00:00:00'),
			maxDate: moment('2015-04-30T00:00:00'),
			presets: [
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
		};
		angular.extend(scope, data);
		ctrl = _$controller_('durationSelectorCtrl', { $scope: scope });
	}));

	it('should set ctrl.model according to start and end dates', function() {
		expect(ctrl.customModel).toEqual({startDate: scope.maxDate, endDate: scope.maxDate});
	});

	it('should behave properly on clicking on custom duration preset', inject(function(durationSelectorService) {
		scope.setCustom();
		expect(scope.showCustom).toBe(true);

		scope.setCustom();
		expect(scope.showCustom).toBe(true);
		expect(scope.showPresets).toBe(false);
		expect(scope.duration).toBe(durationSelectorService.customDuration(ctrl.customModel));
	}));
});