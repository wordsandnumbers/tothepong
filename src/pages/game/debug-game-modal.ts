import {Component} from '@angular/core';
import {NavController, NavParams, ViewController} from "ionic-angular";
import {Team} from "../../types/team";
import {Match} from "../../types/match";

@Component({
	selector: 'debug-game-modal',
	templateUrl: 'debug-game-modal.html',
})
export class DebugGameModal {
	match: Match;
	teams: Array<Team>;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public viewCtrl: ViewController,
	) {
		this.teams = navParams.data.teams;
		this.match = this.navParams.data.match;
	}

	public dismiss() {
		this.viewCtrl.dismiss();
	}
}
