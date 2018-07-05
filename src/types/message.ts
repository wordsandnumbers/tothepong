export enum MessageLevel {
	INFO,
	WARNING,
	SUCCESS,
	ERROR,
}

export class Message {
	subject?: string;
	content: string;
	level?: MessageLevel;

	constructor(content: string, subject?: string, level?: MessageLevel) {
		this.content = content;
		this.subject = subject;
		this.level = level;
	}
}

