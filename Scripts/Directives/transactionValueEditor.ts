///<reference path="../../all.d.ts"/>

module Budgeter.Directives {
	export function transactionValueEditor(): ng.IDirective {
		return {
			restrict: 'EA',
			scope: { listState: '=', transactionID: '=' },
			require: '^transaction',
			controllerAs: 'tvEditCtrl',
			bindToController: true,
			controller: Budgeter.Controllers.transactionValueEditorCtrl,
			templateUrl: 'Views/Templates/TransactionValueEditor.html'
		}
	}
}

module Budgeter.Controllers {

	export class transactionValueEditorCtrl {

		static $inject = ['transactionValueMgr', 'notify', '$rootScope', 'listOptionsDataSvc'];

		public tv: ITransactionValueClientModel;
		public frequencies: Array<string>;
		public newitem: boolean;
		public listState: ITransValueListState;
		public transactionID: number;

		constructor(public transactionValueMgr: Services.transactionValueMgr, public notify: ng.cgNotify.INotifyService
			, public $rootscope: ng.IRootScopeService, public listOptionsDataSvc: Budgeter.Services.listOptionsDataSvc) {
			
			// If there's already a transactionvalue to edit then load it - otherwise give us a new one. 
			if (this.listState.tvToEdit != undefined) {
				this.tv = this.listState.tvToEdit;
				this.newitem = false;
			} else {
				this.tv = this.transactionValueMgr.getnewTransactionValue(this.listState.tID);
				this.newitem = true;
			}

			this.getfrequencies();
		}
		
		/** Load available transaction frequencies to the dropdown list */
		private getfrequencies() {
			this.listOptionsDataSvc.transactionfrequencies
				.then((d: string[]) => {
					this.frequencies = d;
				})
				.catch(e => {
					this.notify({ message: 'There was a problem loading data', classes: 'alert-danger' })
				})
		}
		
		/** either post or put a transactionvalue depending on values in liststate */
		submit() {
			if (this.newitem) {
				this.transactionValueMgr.post(this.tv)
					.success(d=> {
						this.notify({ message: 'Item created successfully', classes: 'alert-success' })
						this.clearandClose();
					})
					.error((e: Error) => {
						this.notify({ message: 'There was a problem submitting the item: ' + e.message, classes: 'alert-danger' })
					});
			} else {
				this.transactionValueMgr.put(this.tv)
					.success(d=> {
						this.notify({ message: 'Item created successfully', classes: 'alert-success' })
						this.clearandClose();
					})
					.error((e: Error) => {
						this.notify({ message: 'There was a problem submitting the item: ' + e.message, classes: 'alert-danger' })
					});
			}
		}

		private clearandClose() {
			this.listState.addEdit = false;
			this.listState.tvToEdit = undefined;
		}

		delete() {
			this.transactionValueMgr.delete(this.tv.ID)
				.then(() => {
					this.notify({ message: 'Item deleted successfully', classes: 'alert-success' })
					this.clearandClose();
				})
				.catch((e: Error) => {
					this.notify({ message: 'Error' + e.message, classes: 'alert-danger' })
				})
		}
	}
}
