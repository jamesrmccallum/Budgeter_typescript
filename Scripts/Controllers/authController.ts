///<reference path="../../all.d.ts"/>

module Budgeter.Controllers {

	export class AuthController {

		public static $inject = ['authSvc', 'sessionService', '$modal'];

		public $modalInstance: ng.ui.bootstrap.IModalServiceInstance;

		constructor(public authSvc: Budgeter.Services.authSvc,
			public sessionService: Budgeter.Services.sessionService, public $modal: ng.ui.bootstrap.IModalService) {
		}

		loggedIn(): boolean {
			return this.sessionService.Token !== undefined;
		}

		openModal() {
			this.$modalInstance = this.$modal.open({
				templateUrl: '/Views/Templates/LoginRegister.html',
				controllerAs: 'loginModalCtrl',
				controller: LoginModalController,
				size: 'sm',
			})
		}

		logOut() {
			this.sessionService.destroySession();
		}
	}

	interface tab { Header: string, title: string, url: string };
    
    interface IAuthError {error:string, error_description: string}
	class LoginModalController {

		public loginForm: ILoginModel;
		public registerForm: IRegistrationModel;
		public tabs: Array<tab>;
		public currentTab: string;

		static $inject = ['authSvc', 'sessionService', '$modalInstance', '$rootScope'];

		constructor(public authSvc: Services.authSvc, private sessionService: Services.sessionService,
			private $modalInstance: angular.ui.bootstrap.IModalServiceInstance, private $rootScope: ng.IRootScopeService) {

			this.tabs = [
				{ Header: "Log in", title: 'Login', url: 'Login.html' },
				{ Header: "Create an account", title: 'Register', url: 'Register.html' }
			];

			this.loginForm = { username: '', password: '', errorMessage: '' };
			this.registerForm = { Email: '', password: '', confirmPassword: '', errorMessage: '' }
			this.currentTab = 'Login.html'
		}
       
		/** hit the token endpoint, store the access token in cookies */
		login() {
			this.authSvc.login(this.loginForm)
				.then(r => {
					this.sessionService.Token = r.data.access_token;
					this.$modalInstance.close();
					this.$rootScope.$emit('refresh');
				})
				.catch((err: ng.IHttpPromiseCallbackArg<IAuthError>) => {
					this.loginForm.errorMessage = err.data.error_description;
				})
		}

		register(registerForm: IRegistrationModel) {
			this.authSvc.register(this.registerForm)
				.then((success: ITokenResponse) => console.log(success))
		}

		onClickTab(tab: tab): void {
			this.currentTab = tab.url;
		}

		isActiveTab(tabUrl: string): boolean {
			return tabUrl === this.currentTab;
		}

	}

}