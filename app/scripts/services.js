'use strict';
angular.module('Ministero.services', [])

.factory('Status', ['$http', 'ENV', 'Credentials', function ($http, ENV, Credentials) {
	return {
		get: function () {
			return $http.get(ENV.apiEndpoint, {params: Credentials.get()});
		}
	};
}])

.factory('Credentials', ['localStorageService', function (storage) {
	return {
		set: function (credentials) {
			if (credentials.username)
				storage.set('username', credentials.username);
			if (credentials.password)
				storage.set('password', credentials.password);
		},
		get: function () {
			if (!this.isSet())
				return {};

			return {
				username: storage.get('username'),
				password: storage.get('password'),
			};
		},
		isSet: function () {
			return (storage.get('username') && storage.get('password'));
		},
		clear: function () {
			storage.remove('username');
			storage.remove('password');
		}
	};
}])
;
