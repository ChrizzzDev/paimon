import { Subcommand } from '@kaname-png/plugin-subcommands-advanced';
import { ApplyOptions } from '@sapphire/decorators';

@ApplyOptions<Subcommand.Options>({
	name: 'achivements',
	description: 'Obtén información sobre logros dentro del juego.'
})
export default class extends Subcommand {
	public override registerApplicationCommands(registry: Subcommand.Registry) {
		registry.registerChatInputCommand((ctx) => {
			this.hooks.subcommands(this, ctx);

			return ctx.setName(this.name).setDescription(this.description);
		});
	}
}
