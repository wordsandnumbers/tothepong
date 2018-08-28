import {PointScore} from "./point-score";

export enum GameState {
	NEW,
	ACTIVE,
	COMPLETE,
	CANCELLED,
	ARCHIVED
}

export class Game {
	startDate: string;
	endDate: string;
	pointScores: Map<string, Array<PointScore>>;
	totalPoints: number;
	state: GameState;

	get standings(): any {
		let standings: object = {};

		this.pointScores.forEach((teamScores: Array<PointScore>, team: string) => {
			standings[team] = teamScores.length;
		});
		return standings;
	}

	constructor() {
		this.startDate = new Date().toISOString();
		this.pointScores = new Map<string, Array<PointScore>>();
		this.state = GameState.NEW;
	}
}
