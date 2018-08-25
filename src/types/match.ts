import {Game} from "./game";
import {Team} from "./team";

export enum MatchState {
	NEW = "NEW",
	ACTIVE = "ACTIVE",
	COMPLETE = "COMPLETE",
	CANCELLED = "CANCELLED",
	ARCHIVED = "ARCHIVED"
}

export class Match {
	games: Array<Game>;
	state: MatchState;
	teams: Array<Team>;
	totalGames: number;
	$key?: number;

	constructor(totalGames: number, teams: Array<Team>) {
		this.games = new Array<Game>();
		this.state = MatchState.NEW;
		this.teams = new Array<Team>();
		return this;
	}
}
