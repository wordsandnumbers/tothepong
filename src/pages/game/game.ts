import {Component, NgZone} from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import {Game} from '../../types/game';
import {BLE} from "@ionic-native/ble";
import {AlertController} from "ionic-angular";

@Component({
	selector: 'page-game',
	templateUrl: 'game.html'
})

export class GamePage {

	active: boolean;
	games: FirebaseListObservable<any>;
	activeGame: Game;
	service: number;
	peripheral: any;
	data: any;
	device: any;

	constructor(
		public db: AngularFireDatabase,
		private ble: BLE,
		private ngZone: NgZone,
		private alertCtrl: AlertController
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
		this.ble.scan([], 5).subscribe(device => {
			if (device.name === 'Adafruit Bluefruit LE') {
				this.device = device;
			}
		});
	}

	connect() {
		this.ble.connect(this.device.id).subscribe(peripheral => {
			this.peripheral = peripheral;
			this.ble.startNotification(this.peripheral.id, "6E400001-B5A3-F393-E0A9-E50E24DCCA9E", "6E400003-B5A3-F393-E0A9-E50E24DCCA9E").subscribe(
				data => this.onButtonStateChange(data),
				() => this.showAlert('Unexpected Error', "Couldn't subscribe to controller events.")
			);
		});
	}

	onButtonStateChange(buffer:ArrayBuffer) {
		var data = new Uint8Array(buffer);
		console.log(data);

		this.ngZone.run(() => {
			this.data = String.fromCharCode.apply(null, data);
			() => this.showAlert('Button', this.data);
		});

	}

	showAlert(title, message) {
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
