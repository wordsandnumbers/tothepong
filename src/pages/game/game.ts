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
	activeGame: Game;

	constructor(
		public db: AngularFireDatabase,
		public navCtrl: NavController
	) {
		db.object('/game').subscribe(game => {
			this.active = game.active === 'true' ? true : false;
			return game;
		});
		
		this.games = db.list('/games', {
			query: {
				limitToLast: 1
			}
		});
			
		this.games.subscribe(games => {
			console.log(games);
			this.activeGame = games[0];
		});
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
	
	endGame() {
		this.games.update(this.activeGame.$key, {endDate: new Date().toISOString()});
	}
	
	addPoint() {
		
	}
	
	subtractPoint() {
		
	}

}
