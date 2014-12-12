'use strict';
angular.module('Ministero.controllers', [])

.controller('DashCtrl', ['$scope', 'Status', '$cordovaGeolocation',
function($scope, Status, $cordovaGeolocation) {
	$scope.gettingStatus = false;
	$scope.currentStatus = 'notFetched';
	$scope.showResult = null;
	$scope.buttonIcon = null;

	var possibleResults = {
		'notFetched': 'কিচ্ছু খুঁজি হাই না কিল্লাই। বাটনে গুতান!!',
		'fetching'	: 'খাড়াই থান, লড়িয়েন না!',
		'evaluation': 'কাম ছইলতেছে!',
		'done'		: 'কাম হই গেছে মিষ্টি খাবান !',
		'none'		: 'সমইস্যা হই গেলো!'
	};

	$scope.getStatus = function () {
		$scope.gettingStatus = true;

		Status.get().success(function (res) {
			if (angular.isUndefined(res.result)) {
				$scope.currentStatus = 'none';
				return;
			}

			$scope.currentStatus = res.result;
		}).error(function (err) {
			console.log(err);
			$scope.currentStatus = 'none';
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

.controller('FriendsCtrl', function($scope, Friends) {
  $scope.friends = Friends.all();
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})

.controller('AccountCtrl', function($scope) {
	$scope.test = 'test';
});
