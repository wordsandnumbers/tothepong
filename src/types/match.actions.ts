import {Action} from "@ngrx/store";

export const ADD_POINT = "Add Point";
export const SUBTRACT_POINT = "Subtract Point";
export const END_MATCH = "End Game";


export class AddPoint implements Action {
	readonly type = ADD_POINT;
}

export class SubtractPoint implements Action {
	readonly type = SUBTRACT_POINT;
}

