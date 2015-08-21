'use strict';
angular.module('Ministero.controllers', [])

.controller('DashCtrl', ['$scope', '$state', 'Status', '$cordovaGeolocation', 'Credentials',
function($scope, $state, Status, $cordovaGeolocation, Credentials) {
	// console.log(Credentials);
	if (!Credentials.isSet())
		return $state.go('tab.settings');

	$scope.gettingStatus = false;
	$scope.currentStatus = 'notFetched';
	$scope.showResult = null;
	$scope.buttonIcon = null;

	var possibleResults = {
		'notFetched'	: 'কিচ্ছু খুঁজি হাই না কিল্লাই। বাটনে গুতান!!',
		'fetching'		: 'খাড়াই থান, লড়িয়েন না!',
		'evaluation_running'	: 'কাম ছইলতেছে!',
		'evaluation_finished'	: 'শেষ পর্যায়!',
		'initialized' 	: 'কাম শুরু হই গেছে',
		'done'			: 'কাম হই গেছে মিষ্টি খাবান !',
		'none'			: 'সমইস্যা হই গেলো!'
	};

	$scope.getStatus = function () {
		if ($scope.gettingStatus)
			return;

		$scope.gettingStatus = true;

		Status.get().success(function (res) {
			if (angular.isUndefined(res.status)) {
				$scope.currentStatus = 'none';
				$scope.currentStatusText = null;
				return;
			}

			$scope.currentStatus = res.status;
			$scope.currentStatusText = res.text;
		}).error(function (err) {
			console.log(err);
			$scope.currentStatus = 'none';
			$scope.currentStatusText = null;
		}).finally(function () {
			$scope.gettingStatus = false;
		});
	};

	$scope.$watch('currentStatus', function (_new) {
		$scope.showResult = possibleResults[_new];

		if (_new === 'none') {
			$scope.showCallButton = true;
		} else {
			$scope.showCallButton = false;
		}
	});

	$scope.$watch('gettingStatus', function (_new) {
		if (_new === true) {
			$scope.buttonIcon = 'ion-loading-c';
			$scope.currentStatus = 'fetching';
			$scope.buttonText = 'খাড়ান খুঁজি ছাই !!';
			return;
		}

		$scope.buttonIcon = 'ion-help-circled';
		$scope.buttonText = 'কি অবস্থা?';
	});

	$cordovaGeolocation
		.getCurrentPosition()
		.then(function (position) {
			var lat  = position.coords.latitude;
			var long = position.coords.longitude;

			console.log(lat, long);
		}, function(err) {
			console.log(err);
		});
}])

.controller('SettingsCtrl', ['$scope', '$state', 'Credentials',
function($scope, $state, Credentials) {
	$scope.credentials = Credentials.get();

	$scope.save = function () {
		Credentials.set($scope.credentials);
		$state.go('tab.dash');
	};
}]);
