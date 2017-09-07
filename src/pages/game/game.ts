import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import {Game} from '../../types/game';

@Component({
	selector: 'page-game',
	templateUrl: 'game.html'
})

export class GamePage {

	active: boolean;
	games: FirebaseListObservable<any>;

	constructor(
		public db: AngularFireDatabase,
		public navCtrl: NavController
	) {
		db.object('/game').subscribe(game => {
			this.active = game.active === 'true' ? true : false;
			return game;
		});
		
		this.games = db.list('/games');
	}

	toggle(toggle) {
		//console.log(toggle);
		this.db.object('/game').set({'active': toggle.checked === true ? 'true' : 'false'});
	}

	newGame() {
		let game = new Game(['Player 1', 'Player 2']);
		console.log(game);
		this.games.push(game);
	}
	
	delete(key) {
		this.games.remove(key);
	}
	
	addPoint() {
		
	}
	
	subtractPoint() {
		
	}

}
