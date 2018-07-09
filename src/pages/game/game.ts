import {Component, OnDestroy, OnInit} from '@angular/core';
import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';
import {Game} from '../../types/game';
import {AlertController, ModalController} from "ionic-angular";
import {BleControllerService} from "../../services/ble-controller.service";
import {ControllerEventType, ControllerEventValue} from "../../types/controller-event";
import {Message} from "../../types/message";
import {Subscription} from "rxjs/Subscription";
import {HidUserService} from "../../services/hid-user.service";
import {UserModalMode, UserModalPage} from "../user-modal/user-modal";
import {User} from "../../types/user";
import 'rxjs/add/operator/first';

@Component({
	selector: 'page-game',
	templateUrl: 'game.html'
})

export class GamePage implements OnDestroy, OnInit {

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
		private userService: HidUserService,
		private modalCtrl: ModalController,
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
						//this.showAlert(event.value, 'HID');
						this.handleHidScan(event.value as string);
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

	public ngOnInit() {
		this.handleHidScan("12444");
	}

	private handleHidScan(hidId: string) {
		this.userService.getUserByHidId(hidId as string).first().subscribe((users: User[]) => {
			if (users.length === 0) {
				this.modalCtrl.create(UserModalPage, {
					user: new User(hidId as string, "Player"),
					mode: UserModalMode.CREATE
				}).present();
			} else {
				//this.activeGame.players[0] = users[0];
				this.modalCtrl.create(UserModalPage, {
					user: users[0],
					mode: UserModalMode.UPDATE
				}).present();
			}
		});
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
		let game = new Game([{displayName: 'Player 1'}, {displayName: 'Player 2'}]);
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
