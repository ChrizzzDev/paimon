import { EmbedBuilder } from '@discordjs/builders';
import { RegisterSubCommand, Command } from '@kaname-png/plugin-subcommands-advanced';
import GenshinDB, { Language } from 'genshin-db';

@RegisterSubCommand('characters', (builder) =>
	builder
		.setName('search')
		.setDescription('Busca a un personaje.')
		.addStringOption((opt) => opt.setName('character').setDescription('Nombre del personaje. (ES, EN)').setRequired(true).setAutocomplete(true))
)
export class UserCommand extends Command {
	public override async chatInputRun(interaction: Command.ChatInputInteraction) {
		const character = interaction.options.getString('character', true);

		const result = GenshinDB.characters(character, {
			queryLanguages: [Language.Spanish, Language.English],
			resultLanguage: Language.Spanish
		})!;

		const content = [
			`*\`Elemento:\`* [${this.getElement(result.element) ?? ''}] ${result.element || 'Multi-elemental'}`,
			`*\`Rareza:\`* [${result.rarity}] ${'⭐'.repeat(Number(result.rarity))}`,
			`*\`Región:\`* [${this.getRegion(result.region) ?? ''}] ${result.region || 'Fuera de este mundo.'}`,
			`*\`Arma:\`* ${result.weapontype}`,
			`*\`Afiliación:\`* ${result.affiliation || 'Multi-afiliación.'}`,
			`*\`Constelación:\`* ${result.constellation}`,
			`*\`Cumpleaños:\`* ${result.birthday || '...'}`
		];

		const embed = new EmbedBuilder()
			.setTitle(`${result.name} - “${result.title || 'Viajero de Teyvat'}”`)
			.setThumbnail(result.images.icon)
			.setDescription(`"${result.description}"\nInformación general:\n${content.map((s) => '› ' + s).join('\n')}`)
			.setColor(0x2f3136);

		return await interaction.reply({ content: '¡Listo!', embeds: [embed] });
	}

	private getElement(element: string) {
		return this.container.client.guilds.cache.get('1063215136925556826')!.emojis.cache.find((e) => e.name === element);
	}

	private getRegion(region: string) {
		return this.container.client.guilds.cache
			.get('1063215136925556826')!
			.emojis.cache.find((e) => e.name?.toLowerCase() === region.toLowerCase());
	}
}
