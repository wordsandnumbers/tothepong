import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';

@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})

export class HomePage {

	game: FirebaseObjectObservable<any>;

	constructor(
		public db: AngularFireDatabase,
		public navCtrl: NavController
	) {
		this.game = db.object('/game');
	}

}
