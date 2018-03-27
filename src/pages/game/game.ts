import {Component} from '@angular/core';
import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';
import {Game} from '../../types/game';
import {AlertController} from "ionic-angular";
import {BleControllerService} from "../../services/ble-controller.service";
import {ControllerEventType} from "../../types/controller-event";
import {Message} from "../../types/message";

@Component({
	selector: 'page-game',
	templateUrl: 'game.html'
})

export class GamePage {

	active: boolean;
	games: FirebaseListObservable<any>;
	activeGame: Game;
	service: number;
	bleConnected: boolean;
	message: string;

	constructor(
		public db: AngularFireDatabase,
		private controllerService: BleControllerService,
		private alertCtrl: AlertController,
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

		this.controllerService.controllerEvents.subscribe(event => {
			if (event) {
				this.showAlert(event.value);
				switch (event.type) {
					case ControllerEventType.B1:

						this.addPoint(0);
						break;
					case ControllerEventType.B2:
						this.addPoint(1);
						break;
					case ControllerEventType.HID:
						break;
				}
			}
		});

		this.controllerService.connected.subscribe(connected => {
			this.bleConnected = connected;
		});

		this.controllerService.messages.subscribe((message: Message) => {
			if (message) {
				this.showAlert(message.content, message.subject);
			}
		});
	}

	connect() {
		this.controllerService.reconnect();
	}

	showAlert(message, title?) {
		this.message = message;
		let alert = this.alertCtrl.create({
			title: title,
			subTitle: message,
			buttons: ['OK']
		});
		alert.present();
	}

	newGame() {
		let game = new Game(['Player 1', 'Player 2']);
		this.db.object('/game').set({'active': 'true'});
		this.games.push(game);
	}

	endGame() {
		this.games.update(this.activeGame.$key, {endDate: new Date().toISOString()});
		this.db.object('/game').set({'active': 'false'});
	}

	addPoint(playerIndex) {
		if (this.activeGame.score[playerIndex] < 11 && this.active) {
			this.activeGame.score[playerIndex]++;
			this.setScore();
		}
	}

	subtractPoint(playerIndex) {
		if (this.activeGame.score[playerIndex] > 0 && this.active) {
			this.activeGame.score[playerIndex]--;
			this.setScore();
		}
	}

	setScore() {
		this.db.object(`/games/${this.activeGame.$key}`).set(this.activeGame);
	}
}
