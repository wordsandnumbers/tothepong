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
	pointScores: Array<PointScore>;
	totalPoints: number;
	state: GameState;

	get standings(): any {
		let standings = this.pointScores.reduce((totals, pointScore: PointScore) => {
			if (!totals[pointScore.team.id]) {
				totals[pointScore.team.id] = 0;
			}
			totals[pointScore.team.id] += pointScore.points;
			return totals;
		}, {});
		return standings;
	}

	constructor() {
		this.startDate = new Date().toISOString();
		this.pointScores = [];
		this.state = GameState.NEW;
	}
}
