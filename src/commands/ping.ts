import { Colors } from '@/lib/types/Colors';
import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { EmbedBuilder, Message } from 'discord.js';

@ApplyOptions<Command.Options>({
	description: 'Comprueba si Paimon sigue viva.'
})
export class UserCommand extends Command {
	public override async messageRun(message: Message) {
		this.getPing(message);
	}

	public override chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		this.getPing(interaction);
	}

	private getPing(messageOrInteraction: Message | Command.ChatInputCommandInteraction) {
		const msg = messageOrInteraction.createdTimestamp;
		const embed = new EmbedBuilder()
			.setColor(Colors.white)
			.setThumbnail(this.container.client.user!.displayAvatarURL())
			.setDescription(
				`¡Aquí estoy!\nAPI Latency: ${Math.round(msg - messageOrInteraction.createdTimestamp)}\nBot Latency: ${this.container.client.ws.ping}`
			);

		return messageOrInteraction.reply({ embeds: [embed] });
	}
}
