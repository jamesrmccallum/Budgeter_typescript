///<reference path="../all.d.ts"/>

module utilities {
	/** takes a date and a month number to offset */
	export function lastDay(date: Date, offset: number): Date {
		return new Date(date.getFullYear(), date.getMonth() + offset, 0);
	};

	export function getUTCDate(indate: Date) {

		var d = new Date();	
		return indate.setDate(indate.getDate() + (d.getTimezoneOffset() * 60000));

		//return new Date(Date.UTC(n.getFullYear(),n.getMonth(),n.getDate()));
    }
	
	export function stringifyDate(d: Date): string {
		return d.toLocaleDateString();
	}
}
