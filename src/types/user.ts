import {Match} from "./match";

export class User {
	cardId?: string;
	$uid?: string;
	displayName: string;
	photoURL?: string;
	firebaseUid?: string;
	matches?: Array<Match>;
	$key?: string;

	constructor(cardId?: string, displayName?: string) {
		this.cardId = cardId;
		this.displayName = displayName;
	}
}
