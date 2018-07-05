import {User} from "./user";

export enum GameState {
	NEW,
	ACTIVE,
	COMPLETE,
	CANCELLED,
	ARCHIVED
}

class Score {
	user: User;
	points: number;
	timeStamp: Date;
}

export class Game {
	startDate: string;
	endDate: string;
	players: Array<User>;
	score: Array<number>;
	location: string;
	pointScores: Array<Score>;
	state: GameState;
	$key: string;

	constructor(players: Array<User>) {
		this.players = players;
		this.startDate = new Date().toISOString();
		this.score = [0,0];
		this.state = GameState.NEW;
	}
}
