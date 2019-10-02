import {Injectable} from '@angular/core';
import {User} from "../types/user";
import {AngularFireDatabase, FirebaseListObservable} from "angularfire2/database";
import {Observable} from "rxjs/Observable";
import {mergeMap} from "rxjs/operators";
import {fromPromise} from "rxjs/observable/fromPromise";
import {Match} from "../types/match";

const FIREBASE_MATCH_PATH: string = "/matches";

@Injectable()
export class MatchService {
	matches: FirebaseListObservable<Match[]>;

	constructor(
		public db: AngularFireDatabase,
	) {
		this.matches = db.list(FIREBASE_MATCH_PATH);
	}

	public newMatch(user: User, match: Match): Observable<Match> {
		return fromPromise(
			this.db.list(FIREBASE_MATCH_PATH + "/" + user.$key).push(match)
		).pipe(
			mergeMap((newMatch: Match) => {
				return this.db.object(FIREBASE_MATCH_PATH + "/" + user.$key + "/" + newMatch.$key);
			})
		);
	}

}
