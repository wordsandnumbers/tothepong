import {Component, OnDestroy, OnInit} from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';
//import {Game} from '../../types/game';
import {AlertController, ModalController} from "ionic-angular";
import {BleControllerService} from "../../services/ble-controller.service";
import {ControllerEventType, ControllerEventValue} from "../../types/controller-event";
import {Message} from "../../types/message";
import {Subscription} from "rxjs/Subscription";
import {UserModalMode, UserModalPage} from "../user-modal/user-modal";
import {User} from "../../types/user";
import 'rxjs/add/operator/first';
import {UserService} from "../../services/user.service";
import {Match, MatchState} from "../../types/match";
import {Team} from "../../types/team";
import {MatchService} from "../../services/match.service";
import {DebugGameModal} from "./debug-game-modal";

@Component({
	selector: 'page-game',
	templateUrl: 'game.html'
})

export class GamePage implements OnDestroy, OnInit {

	active: boolean;
	activeMatch: Match;
	service: number;
	bleConnected: boolean;
	subscription: Subscription;
	activeTeams: Array<Team> = [];

	constructor(
		public db: AngularFireDatabase,
		private controllerService: BleControllerService,
		private alertCtrl: AlertController,
		private matchService: MatchService,
		private userService: UserService,
		private modalCtrl: ModalController,
	) {
		db.object('/game').subscribe(game => {
			this.active = game.active === 'true' ? true : false;
			return game;
		});

		this.subscription = this.controllerService.controllerEvents.subscribe(event => {
			if (event) {
				switch (event.type) {
					case ControllerEventType.B1:
						switch (event.value) {
							case ControllerEventValue.LP:
								this.subtractScore(this.activeMatch.teams[0]);
								break;
							case ControllerEventValue.DP:
							case ControllerEventValue.SP:
								this.addScore(this.activeMatch.teams[1]);
						}
						break;
					case ControllerEventType.B2:
						switch (event.value) {
							case ControllerEventValue.LP:
								this.subtractScore(this.activeMatch.teams[0]);
								break;
							case ControllerEventValue.DP:
							case ControllerEventValue.SP:
								this.addScore(this.activeMatch.teams[1]);
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
		this.handleHidScan("44444");
	}

	private handleHidScan(cardId: string) {
		// If users already logged in, and game is active, don't do anything.
		if (this.activeTeams.length < 2) {
			this.userService.getUserByHidId(cardId as string).first().subscribe((user: User) => {
				if (!user) {
					this.modalCtrl.create(UserModalPage, {
						user: new User(cardId as string, "Player"),
						mode: UserModalMode.CREATE
					}).present();
				} else {
					let team = new Team();
					team.players.push(user);
					//this.activeGame.players[0] = user;
					this.activeTeams.push(team);
					if (this.activeTeams.length === 2) {
						this.newMatch();
					}
				}
			});
		} else {
			//TODO: end match / start new match dialog?
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
		this.activeMatch = new Match(3, this.activeTeams);
		this.matchService.newMatch(this.activeTeams[0].players[0], this.activeMatch);
	}

	endMatch(match: Match) {
		this.activeMatch.state = MatchState.COMPLETE;
	}

	newGame() {
		// TODO: add new game to match
	}

	endGame() {
		/*this.games.update(this.activeGame.$key, {endDate: new Date().toISOString()});
		this.db.object('/game').set({'active': 'false'});*/
	}

	addScore(team: Team) {
		this.activeMatch.addScore(team);
	}

	subtractScore(team: Team) {
		this.activeMatch.subtractScore(team);
	}

	setScore() {
		//this.db.object(`/games/${this.activeGame.$key}`).set(this.activeGame);
	}

	debugModal() {
		this.modalCtrl.create(DebugGameModal, {
			teams: this.activeTeams,
			match: this.activeMatch
		}).present();
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}
}
