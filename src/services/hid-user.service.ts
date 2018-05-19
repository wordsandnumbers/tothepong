import {Injectable} from '@angular/core';
import {User} from "../types/user";
import {AngularFireDatabase, FirebaseListObservable} from "angularfire2/database";

const FIREBASE_USER_PATH: string = "/users";

@Injectable()
export class HidUserService {
	users: FirebaseListObservable<any[]>;

	constructor(
		public db: AngularFireDatabase,
	) {
		this.users = db.list(FIREBASE_USER_PATH);
	}

	public getUserByHidId(hidId: string): FirebaseListObservable<User[]> {
		return this.db.list(FIREBASE_USER_PATH, {
			query: {
				equalTo: {
					hidId: hidId
				}
			}
		});
	}

	public addUser(user: User) {

	}

	public updateUser(user: User) {

	}

}
