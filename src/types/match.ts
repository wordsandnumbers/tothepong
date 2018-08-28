import {Game} from "./game";
import {Team} from "./team";
import {PointScore} from "./point-score";

export enum MatchState {
	NEW,
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

	addScore(team: Team, pointAmount?: number) {
		this.games[this.games.length - 1].pointScores.push(new PointScore(team));
	}

	subtractScore(team: Team) {
		this.games[this.games.length - 1].pointScores.pop();
	}

	constructor(totalGames: number, teams: Array<Team>) {
		this.games = [];
		this.games.push(new Game());
		this.startDate = new Date();
		this.state = MatchState.NEW;
		this.teams = teams;
		return this;
	}
}
