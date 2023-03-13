import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import type { AutocompleteFocusedOption, AutocompleteInteraction } from 'discord.js';
import genshindb, { Language } from 'genshin-db';

const query = {
	matchAliases: true,
	matchCategories: true,
	verboseCategories: true,
	queryLanguages: [Language.Spanish, Language.English],
	resultLanguage: Language.Spanish
} satisfies genshindb.QueryOptions;

@ApplyOptions<InteractionHandler.Options>({
	interactionHandlerType: InteractionHandlerTypes.Autocomplete
})
export class AutocompleteHandler extends InteractionHandler {
	public override async run(interaction: AutocompleteInteraction, result: InteractionHandler.ParseResult<this>) {
		return interaction.respond(result);
	}

	public override async parse(interaction: AutocompleteInteraction) {
		const focusedValue = interaction.options.getFocused(true);
		switch (focusedValue.name) {
			case 'character': {
				const result = genshindb.characters('names', { ...query });

				const map = result
					.filter((c) => c.name.toLowerCase().startsWith(focusedValue.value.toLowerCase()))
					.map((character) => ({ name: character.name, value: character.name }));
				return this.some(result.length > 25 ? map.slice(0, 25) : map);
			}

			case 'weapon': {
				const result = genshindb.weapons('names', { ...query });

				return this.map(result, focusedValue)
			}

			default: {
				return this.none();
			}
		}
	}

	private map(result: any[], focused: AutocompleteFocusedOption) {
		const map = result.filter((c) => c.name.toLowerCase().startsWith(focused.value.toLowerCase()))
		.map((_) => ({ name: _.name, value: _.name }));

		return this.some(result.length > 25 ? map.slice(0,25) : map);
	}
}