import { Subcommand } from '@kaname-png/plugin-subcommands-advanced';
import { ApplyOptions } from '@sapphire/decorators';

@ApplyOptions<Subcommand.Options>({
	name: 'animals',
	description: 'Obtén información sobre animales dentro del juego.'
})
export class ParentCommand extends Subcommand {
	public override registerApplicationCommands(registry: Subcommand.Registry) {
		registry.registerChatInputCommand((ctx) => {
			this.hooks.subcommands(this, ctx);

			return ctx.setName(this.name).setDescription(this.description);
		});
	}
}
