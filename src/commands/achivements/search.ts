import { RegisterSubCommand, Command } from '@kaname-png/plugin-subcommands-advanced';
import { achievements, Language } from 'genshin-db';

@RegisterSubCommand('achivements', (builder) =>
	builder
		.setName('search')
		.setDescription('Busca un logro.')
		.addStringOption((opt) => opt.setName('achivement').setDescription('Nombre del logro. (ES, EN)').setRequired(true).setAutocomplete(true))
)
export default class extends Command {
	public override async chatInputRun(interaction: Command.ChatInputInteraction) {
		const achivement = interaction.options.getString('achivement', true);

		const result = achievements(achivement, {
			queryLanguages: [Language.Spanish, Language.English],
			resultLanguage: Language.Spanish
		});

		return await interaction.reply(result!.name);
	}
}
