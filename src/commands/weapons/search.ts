import { EmbedBuilder } from 'discord.js';
import { RegisterSubCommand, Command } from '@kaname-png/plugin-subcommands-advanced';
import { isNullish } from '@sapphire/utilities';
import { ButtonStyle } from 'discord-api-types/v10';
import { ActionRowBuilder, ButtonBuilder, StringSelectMenuBuilder } from 'discord.js';
import GenshinDB, { Language } from 'genshin-db';

@RegisterSubCommand('weapons', (builder) =>
	builder
		.setName('search')
		.setDescription('Busca una arma.')
		.addStringOption((opt) => opt.setName('weapon').setDescription('Nombre del arma. (ES, EN)').setRequired(true).setAutocomplete(true))
)
export default class UserCommand extends Command {
	public override async chatInputRun(interaction: Command.ChatInputInteraction) {
		const weapon = interaction.options.getString('weapon', true);

		const result = GenshinDB.weapons(weapon, {
			queryLanguages: [Language.Spanish, Language.English],
			resultLanguage: Language.Spanish
		})!;

		if (isNullish(result) || Array.isArray(result)) {
			return await interaction.reply('Paimon no pudo encontrar esa arma. ¿Estás seguro de que existe?');
		}

		const row = new ActionRowBuilder<ButtonBuilder>().addComponents([
			new ButtonBuilder().setLabel('Inicio').setCustomId('home').setStyle(ButtonStyle.Primary),
			new ButtonBuilder().setLabel('Historia').setStyle(ButtonStyle.Success).setCustomId('story')
		]);

		const content = [
			`*\`Tipo de arma:\`* ${result.weapontype}`,
			`*\`Rareza:\`* [${result.rarity}] ${'⭐'.repeat(Number(result.rarity))}`,
			`*\`Versión:\`* ${result.version}`
		];

		const levels = new StringSelectMenuBuilder()
			.setCustomId('levels')
			.setPlaceholder('Niveles')
			.setMaxValues(1)
			.setMinValues(1)
			.addOptions(Object.keys(result.costs).map((cost) => ({ value: cost, label: this.parseCost(cost) })));

		const Base = new EmbedBuilder().setTitle(result.name).setThumbnail(result.images.icon!).setColor(0x2f3136);

		Base.setDescription(`"${result.description}"\nInformación general:\n${content.map((s) => '› ' + s).join('\n')}`);

		return await interaction
			.reply({
				content: '¡Listo!',
				embeds: [Base],
				components: [row, new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(levels)]
			})
			.then(async (i) => {
				const collector = i.createMessageComponentCollector();

				collector.on('collect', async (i) => {
					if (i.isStringSelectMenu()) {
						if (i.customId === 'levels') {
							const content: GenshinDB.Items[] = (result.costs as any)[i.values[0]];

							const Level = EmbedBuilder.from(Base)
								.setTitle(this.parseCost(i.values[0]))
								.setDescription(content.map((c: GenshinDB.Items) => `› *\`${c.name}:\`* ${c.count}`).join('\n'));

							await i.message.edit({ embeds: [Level] });
							await i.deferUpdate();
						}
					}

					if (i.isButton()) {
						switch (i.customId) {
							case 'home': {
								await i.message.edit({ embeds: [EmbedBuilder.from(Base)] });
								await i.deferUpdate();
								break;
							}

							case 'story': {
								const Story = EmbedBuilder.from(Base);
								Story.setDescription(result.story);

								await i.message.edit({ embeds: [Story] });
								await i.deferUpdate();
								break;
							}
						}
					}
				});
			});
	}
	/* this.mora */
	// private mora = this.container.client.emojis.resolve("1084853707943972875");

	private parseCost(str: string): string {
		const n = str.replace(/[^0-9]/g, '');
		return `Nivel de ascensión ${n}`;
	}
}
