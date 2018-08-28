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
		let currentGame = this.games[this.games.length - 1];
		let currentGameTeamScores = currentGame.pointScores.get(team.id) || [];
		currentGameTeamScores.push(new PointScore(team));
		currentGame.pointScores.set(team.id, currentGameTeamScores);
	}

	subtractScore(team: Team) {
		let currentGame = this.games[this.games.length - 1];
		let currentGameTeamScores = currentGame.pointScores.get(team.id) || [];
		currentGameTeamScores.pop();
		currentGame.pointScores.set(team.id, currentGameTeamScores);
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
