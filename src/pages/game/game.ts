import {Component, OnDestroy, OnInit} from '@angular/core';
import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';
import {Game} from '../../types/game';
import {AlertController, ModalController} from "ionic-angular";
import {BleControllerService} from "../../services/ble-controller.service";
import {ControllerEventType, ControllerEventValue} from "../../types/controller-event";
import {Message} from "../../types/message";
import {Subscription} from "rxjs/Subscription";
import {UserModalMode, UserModalPage} from "../user-modal/user-modal";
import {User} from "../../types/user";
import 'rxjs/add/operator/first';
import {UserService} from "../../services/user.service";
import {Match} from "../../types/match";
import {Team} from "../../types/team";

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
	activeTeams: Array<Team> = [];

	constructor(
		public db: AngularFireDatabase,
		private controllerService: BleControllerService,
		private alertCtrl: AlertController,
		private userService: UserService,
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
		this.handleHidScan("11111");
	}

	private handleHidScan(cardId: string) {
		// If users already logged in, and game is active, don't do anything.
		if (this.activeTeams.length < 2) {
			this.userService.getUserByHidId(cardId as string).first().subscribe((users: User[]) => {
				if (users.length === 0) {
					this.modalCtrl.create(UserModalPage, {
						user: new User(cardId as string, "Player"),
						mode: UserModalMode.CREATE
					}).present();
				} else {
					let team = new Team();
					team.players.push(users[0]);
					this.activeGame.players[0] = users[0];
					this.activeTeams.push(team);
				}
			});
		}

	}

	connect() {
		this.controllerService.reconnect();
	}

	editPlayer(user: User) {
		this.modalCtrl.create(UserModalPage, {
			user: user,
			mode: UserModalMode.UPDATE
		}).present();
	}

	showAlert(message, title?) {
		let alert = this.alertCtrl.create({
			title: title,
			subTitle: message,
			buttons: ['OK']
		});
		alert.present();
	}

	newMatch() {
		let match = new Match();
		match.teams = this.activeTeams;
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
