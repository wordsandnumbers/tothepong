import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';

@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})

export class HomePage {

	active: boolean;

	constructor(
		public db: AngularFireDatabase,
		public navCtrl: NavController
	) {
		db.object('/game').subscribe(game => {
			this.active = game.active === 'true' ? true : false;
			return game;
		});
	}

	toggle(toggle) {
		//console.log(toggle);
		this.db.object('/game').set({'active': toggle.checked === true ? 'true' : 'false'});
	}
}
