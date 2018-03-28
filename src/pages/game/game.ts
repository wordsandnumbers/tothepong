import {Component, OnDestroy} from '@angular/core';
import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';
import {Game} from '../../types/game';
import {AlertController} from "ionic-angular";
import {BleControllerService} from "../../services/ble-controller.service";
import {ControllerEventType, ControllerEventValue} from "../../types/controller-event";
import {Message} from "../../types/message";
import {Subscription} from "rxjs/Subscription";

@Component({
	selector: 'page-game',
	templateUrl: 'game.html'
})

export class GamePage implements OnDestroy {

	active: boolean;
	games: FirebaseListObservable<any>;
	activeGame: Game;
	service: number;
	bleConnected: boolean;
	subscription: Subscription;

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

		this.subscription = this.controllerService.controllerEvents.subscribe(event => {
			if (event) {
				switch (event.type) {
					case ControllerEventType.B1:
						switch (event.value) {
							case ControllerEventValue.LP:
								this.subtractPoint(0);
								break;
							case ControllerEventValue.DP:
							case ControllerEventValue.SP:
								this.addPoint(0);
						}
						break;
					case ControllerEventType.B2:
						switch (event.value) {
							case ControllerEventValue.LP:
								this.subtractPoint(1);
								break;
							case ControllerEventValue.DP:
							case ControllerEventValue.SP:
								this.addPoint(1);
						}
						break;
					case ControllerEventType.HID:
						this.showAlert(event.value, 'HID');
						break;
				}
			}
		});

		this.subscription.add(this.controllerService.connected.subscribe(connected => {
			this.bleConnected = connected;
		}));

		this.subscription.add(this.controllerService.messages.subscribe((message: Message) => {
			if (message) {
				this.showAlert(message.content, message.subject);
			}
		}));
	}

	connect() {
		this.controllerService.reconnect();
	}

	showAlert(message, title?) {
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

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}
}
