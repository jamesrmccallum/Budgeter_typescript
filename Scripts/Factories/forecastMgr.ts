///<reference path="../../all.d.ts"/>

module Budgeter.Services {

	export class forecastMgr {

		private http: ng.IHttpService;
		private config: ng.IRequestConfig;
		private sessionSrv: Budgeter.Services.sessionService;

		static $inject = ['$http', 'sessionService'];

		constructor($http: angular.IHttpService, sessionService: Budgeter.Services.sessionService) {
			this.http = $http;
			this.sessionSrv = sessionService; 
			this.config = {
				method: 'GET',
				url: this.sessionSrv.apiURL + '/api/Forecast',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + this.sessionSrv.Token
				},
			}
		}

		getForecast(forecastParams: IBudgetParams): ng.IHttpPromise<any> {
			this.config.params = forecastParams;
			return this.http(this.config)
		}
	}
}