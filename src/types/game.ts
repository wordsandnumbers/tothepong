import {PointScore} from "./point-score";
import {Team} from "./team";

export enum GameState {
	NEW,
	ACTIVE,
	COMPLETE,
	CANCELLED,
	ARCHIVED
}

class TeamScore {
	team: Team;
	score: number;
}

export class Game {
	startDate: string;
	endDate: string;
	pointScores: Array<PointScore>;
	totalPoints: number;
	state: GameState;
	readonly teams: Array<Team>;

	constructor(totalPoints: number, teams: Array<Team>) {
		this.startDate = new Date().toISOString();
		this.pointScores = new Array<PointScore>();
		this.state = GameState.NEW;
		this.totalPoints = totalPoints;
		this.teams = teams;
	}

	get score() {
		let score: any = {};

		this.pointScores.forEach((pointScore: PointScore) => {
			if (score[pointScore.team.id]) {
				score[pointScore.team.id] += pointScore.points;
			} else {
				score[pointScore.team.id] = pointScore.points;
			}
		});

		return Object.keys(score).reduce((scores, key) => {
			scores.push({team: key, score: score[key]});
			return scores;
		}, []);
	}

	public isComplete(): boolean {
		return !!this.winner;
	}

	get winner(): TeamScore {
		let sorted = this.score.sort((a: TeamScore, b: TeamScore) => a.score - b.score);
		let highTeam = sorted[sorted.length - 1];
		let nextTeam = sorted[sorted.length - 2];

		if (highTeam && nextTeam && highTeam.score >= this.totalPoints && highTeam.score - nextTeam.score >= 2) {
			return highTeam;
		}
	}

}
