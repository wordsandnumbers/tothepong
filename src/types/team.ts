import {User} from "./user";

export class Team {
	id: string;
	name: string;
	players: Array<User>;

	constructor() {
		this.players = new Array();
	}
}
