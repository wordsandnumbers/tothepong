import {User} from "./user";
import {Guid} from "../util/guid";

export class Team {
	id: string;
	name: string;
	players: Array<User>;

	constructor() {
		this.id = Guid.newGuid();
		this.players = new Array();
	}
}
