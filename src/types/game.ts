export enum GameState {
	NEW,
	ACTIVE,
	COMPLETE,
	CANCELED,
	ARCHIVED
}

export class Game {
	startDate: string;
	endDate: string;
	players: string[];
	score: number[];
	sensorId: string;
	state: GameState;
	$key: string;
	
	constructor(players: string[]) {
		this.players = players;
		this.startDate = new Date().toISOString();
		this.score = [0,0];
		this.state = GameState.NEW;
	}
}