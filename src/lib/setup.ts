// Unless explicitly defined, set NODE_ENV as development:
process.env.NODE_ENV ??= 'development';

import '@sapphire/plugin-logger/register';
import { setup } from '@skyra/env-utilities';
import * as colorette from 'colorette';
import { join } from 'node:path';
import { srcDir } from './constants';
import type Util from './structures/Util';

// Read env var
setup({ path: join(srcDir, '.env') });

// Enable colorette
colorette.createColors({ useColor: true });

declare module '@skyra/env-utilities' {
	interface Env {
		DISCORD_TOKEN: string;
		CLIENT_SECRET: string;
		STATCORD_KEY: string;
		DATABASE_URI: string;
		OWNERS: never;
	}
}

declare module '@sapphire/pieces' {
	interface Container {
		utility: Util;
	}
}
