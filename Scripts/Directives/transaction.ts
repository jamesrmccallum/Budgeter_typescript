///<reference path="../../all.d.ts"/>

module Budgeter.Directives {
	
	export function transaction (): ng.IDirective {
		
		return {
			restrict: 'EA',
			templateUrl: '/Views/Templates/Transaction.html',
			require: '^transactionList',
			bindToController: true,
			controllerAs: 'transCtrl',
			scope: { trans: '=', tliststate: '=', index: '=', deletefn: '&' },
			controller: Budgeter.Controllers.transactionController,
			replace: true,
			link: function(scope: Budgeter.Controllers.ITransactionScope, el: ng.IAugmentedJQuery,
				att: ng.IAttributes) {
					
				var v = scope.transCtrl.trans.TypeDescription
				var barclass = v == 'Income' ? 'progress-bar-success' : (v == 'Savings' ? 'progress-bar-warning' : 'progress-bar-danger'); 
				var labelclass = v == 'Income' ? 'label label-success' : (v == 'Savings' ? 'label label-warning' : 'label label-danger');
				
 				angular.element(el[0].querySelector('.label')).addClass(labelclass);
				angular.element(el[0].querySelector('.progress-bar')).addClass(barclass); 
			}
		}
	}
}

module Budgeter.Controllers {
	
	export interface ITransactionScope extends ng.IScope {
		transCtrl: Budgeter.Controllers.transactionController
	}
	
	export interface ITransValueListState {
		tvToEdit: ITransactionValueClientModel;
		addEdit: boolean; 
	}
	
	export class transactionController {
		
		trans: ITransactionModel;
		tliststate: Budgeter.Controllers.IListState;
		tvListState: ITransValueListState; 
		deletefn: Function;
		index: number;
		expanded: boolean; 
		tlist: transactionListController;
					
		constructor() {
			this.tvListState = {addEdit: false, tvToEdit: null};
		}
		
		/**expand this transaction - trigger the contraction of all others */
		expand() {
			if (!this.expanded) {
				this.tliststate.selectedItem = this.index;
				this.expanded = true;
			} else {
				this.tliststate.selectedItem = null;
				this.expanded = false;
			}
		}
		
		editToggle() {
			this.tliststate.transactionToEdit = this.trans;
			this.tliststate.addMode = true;			
		}
		
		/** inheriting from the list controller */
		delete() {
			this.deletefn(this.trans,this.index);	
		}
	}
}