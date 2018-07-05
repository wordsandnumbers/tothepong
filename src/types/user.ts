export class User {
	hidId?: string;
	displayName: string;
	photoURL?: string;
	firebaseUid?: string;
	$key?: string;

	constructor(hidId?: string, displayName?: string) {
		this.hidId = hidId;
		this.displayName = displayName;
	}
}
