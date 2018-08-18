import {User} from "./user";
import {Team} from "./team";

export enum GameState {
	NEW,
	ACTIVE,
	COMPLETE,
	CANCELLED,
	ARCHIVED
}

class Score {
	user: User;
	team: Team;
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
	totalPoints: number;
	state: GameState;
	$key: string;

	standings(): any {
		return this.pointScores.reduce((totals, pointScore: Score) => {
			return totals[pointScore.team.id] += pointScore.points;
		}, {});
	}

	constructor(players: Array<User>) {
		this.players = players;
		this.startDate = new Date().toISOString();
		this.score = [0,0];
		this.state = GameState.NEW;
	}
}
