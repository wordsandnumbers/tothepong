import {User} from "./user";
import {Team} from "./team";

export class PointScore {
	user: User;
	team: Team;
	points: number;
	timeStamp: Date;

	constructor(team: Team, points?: number, user?: User) {
		this.points = points || 1;
		this.team = team;
		this.user = user;
		this.timeStamp = new Date();
	}
}
