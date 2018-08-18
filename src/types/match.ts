import {Game} from "./game";
import {Team} from "./team";

export class Match {
	teams: Array<Team>;
	games: Array<Game>;
	totalGames: number;
	$key?: number;
}
