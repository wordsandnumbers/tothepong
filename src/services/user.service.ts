import {Injectable} from '@angular/core';
import {User} from "../types/user";
import {AngularFireDatabase, FirebaseListObservable} from "angularfire2/database";
import Thenable = firebase.Thenable;
import {Observable} from "rxjs/Observable";
import {mergeMap} from "rxjs/operators";
import {fromPromise} from "rxjs/observable/fromPromise";
import {Match} from "../types/match";

const FIREBASE_USER_PATH: string = "/users";

@Injectable()
export class UserService {
	users: FirebaseListObservable<any[]>;

	constructor(
		public db: AngularFireDatabase,
	) {
		this.users = db.list(FIREBASE_USER_PATH);
	}

	public getUserByHidId(cardId: string): Observable<User[]> {
		return this.db.list(FIREBASE_USER_PATH, {
			query: {
				orderByChild: 'cardId',
				equalTo: cardId,
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

	public newMatch(user: User, match: Match): Observable<Match> {
		return fromPromise(
			this.db.list(FIREBASE_USER_PATH + "/" + user.$key + "/matches").push(match)
		).pipe(
			mergeMap((newMatch: Match) => {
				return this.db.object(FIREBASE_USER_PATH + "/" + user.$key + "/matches/" + newMatch.$key)
			})
		);
	}

}
