import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';

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
		db.object('/tableStatus').subscribe(game => {
			this.active = game.occupied === 'true' ? true : false;
			return game;
		});
	}

	toggle(toggle) {
		//console.log(toggle);
		this.db.object('/tableStatus').set({'occupied': toggle.checked === true ? 'true' : 'false', 'ts': new Date().toISOString()});
	}
}
