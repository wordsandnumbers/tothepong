import {Injectable} from '@angular/core';
import {User} from "../types/user";
import {AngularFireDatabase, FirebaseListObservable} from "angularfire2/database";
import Thenable = firebase.Thenable;

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
				orderByChild: 'hidId',
				equalTo: hidId,
				limitToFirst: 1,
			}
		});
	}

	public addUser(user: User): Thenable<User> {
		return this.users.push(user);
	}

	public updateUser(user: User): firebase.Promise<void> {
		return this.users.update(user.$key, user);
	}

}
