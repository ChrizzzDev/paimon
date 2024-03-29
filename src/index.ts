import './lib/setup';
import '@kaname-png/plugin-subcommands-advanced/register';
import { LogLevel, SapphireClient } from '@sapphire/framework';
import { GatewayIntentBits } from 'discord.js';
import { envParseString } from '@skyra/env-utilities';
import Statcord from 'statcord.js';
console.clear();

const client = new SapphireClient({
	defaultPrefix: 'Paimon',
	regexPrefix: /^(hey +)?Paimon[.!]/i,
	caseInsensitiveCommands: true,
	caseInsensitivePrefixes: true,
	logger: {
		level: LogLevel.Info
	},
	intents: [GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildMessages, GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent],
	loadMessageCommandListeners: true
});

const statcord = new Statcord.Client({
	client,
	key: envParseString('STATCORD_KEY')
});

statcord.on('post', (status) => {
	if (!status) console.log('Succesfull post');
	else console.error(status);
});

statcord.on('autopost-start', () => console.log('Started autopost'));

const main = async () => {
	try {
		client.logger.info('Iniciando sesión...');
		await client.login(Buffer.from(envParseString('DISCORD_TOKEN'), 'base64').toString());
		client.logger.info('Sesión iniciada.');
	} catch (error) {
		client.logger.fatal(error);
		client.destroy();
		process.exit(1);
	}
};

void main();
