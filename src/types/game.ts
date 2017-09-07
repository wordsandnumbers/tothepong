export class Game {
	createDate: string;
	players: string[];
	score: number[];
	
	constructor(players: string[]) {
		this.players = players;
		this.createDate = new Date().toISOString();
		this.score = [0,0];
	}
}