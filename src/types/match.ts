import {Game} from "./game";
import {Team} from "./team";
import {PointScore} from "./point-score";

export enum MatchState {
	NEW = "NEW",
	ACTIVE = "ACTIVE",
	COMPLETE = "COMPLETE",
	CANCELLED = "CANCELLED",
	ARCHIVED = "ARCHIVED"
}

export class Match {
	endDate: Date;
	location: string;
	games: Array<Game>;
	startDate: Date;
	state: MatchState;
	teams: Array<Team>;
	totalGames: number;
	$key?: number;

	constructor(totalGames: number, teams: Array<Team>) {
		this.games = [];
		this.games.push(new Game(11, teams));
		this.startDate = new Date();
		this.state = MatchState.NEW;
		this.teams = teams;
		return this;
	}

	addScore(team: Team, pointAmount?: number) {
		this.games[this.games.length - 1].pointScores.push(new PointScore(team));
	}

	get currentGame(): Game {
		return this.games[this.games.length - 1];
	}

	subtractScore(team: Team): Match {
		let foundIndex = this.currentGame.pointScores.reverse().findIndex((pointScore: PointScore) => {
			return pointScore.team.id === team.id;
		});
		if (foundIndex > -1) {
			this.currentGame.pointScores.splice(foundIndex, 1);
		}
		this.currentGame.pointScores.reverse();
		return this;
	}

}
