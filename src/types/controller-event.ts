export enum ControllerEventValue {
	SP,
	DP,
	LP,
}

export enum ControllerEventType {
	B1,
	B2,
	HID,
}

export class ControllerEvent {
	type: ControllerEventType;
	value: ControllerEventValue | string;

	constructor(type: ControllerEventType, value: ControllerEventValue | string) {
		this.type = type;
		this.value = value;
	}
}
