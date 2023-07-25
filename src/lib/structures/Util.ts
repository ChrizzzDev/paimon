import { setTimeout } from 'node:timers/promises';

export default class Util {
	public wait(ms: number): Promise<void> {
		return setTimeout(ms);
	}

	public getRandomEnumValue(_: any): any {
		const enumKeys = Object.entries(_);
		const index = Math.floor(Math.random() * enumKeys.length);

		return enumKeys[index];
	}
}
