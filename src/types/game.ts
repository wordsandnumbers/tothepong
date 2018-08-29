import {PointScore} from "./point-score";
import {Team} from "./team";

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
		let standings: object = {};

		this.pointScores.forEach((pointScore: PointScore) => {
			if (standings[pointScore.team.id]) {
				standings[pointScore.team.id] += pointScore.points;
			} else {
				standings[pointScore.team.id] = pointScore.points;
			}
		});
		return standings;
	}

	public isComplete(): boolean {
		return !!this.winner();
	}

	public winner(): Team | undefined {
		let highTeam: Team;
		this.standings.forEach((score: number, team: Team) => {
		});
		return highTeam;
	}

	constructor() {
		this.startDate = new Date().toISOString();
		this.pointScores = new Array<PointScore>();
		this.state = GameState.NEW;
	}
}
