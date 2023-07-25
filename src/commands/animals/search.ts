import { EmbedBuilder } from '@discordjs/builders';
import { RegisterSubCommand, Command } from '@kaname-png/plugin-subcommands-advanced';
import { animals, Language } from 'genshin-db';

@RegisterSubCommand('animals', (builder) =>
	builder
		.setName('search')
		.setDescription('Busca un animal.')
		.addStringOption((opt) => opt.setName('animal').setDescription('Nombre del animal. (ES, EN)').setRequired(true).setAutocomplete(true))
)
export default class extends Command {
	public override async chatInputRun(interaction: Command.ChatInputInteraction) {
		const animal = interaction.options.getString('animal', true);

		const result = animals(animal, {
			queryLanguages: [Language.Spanish, Language.English],
			resultLanguage: Language.Spanish
		})!;

		const content = [`*\`Desde la versión:\`* ${result.version}`];

		const embed = new EmbedBuilder()
			.setTitle(`${result.name} - ${result.category}`)
			.setDescription(`"${result.description}"\n\nInformación general:\n${content.map((s) => '› ' + s).join('\n')}`)
			.setColor(0x2f3136);

		return await interaction.reply({ content: '¡Listo!', embeds: [embed] });
	}
}
