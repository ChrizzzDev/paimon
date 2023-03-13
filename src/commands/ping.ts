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

	private getPing(message: Message) {
		const msg = message.createdTimestamp;
		const embed = new EmbedBuilder()
			.setColor(Colors.white)
			.setThumbnail(this.container.client.user!.displayAvatarURL())
			.setDescription(`¡Aquí estoy!\nAPI Latency: ${Math.round(msg - message.createdTimestamp)}\nBot Latency: ${this.container.client.ws.ping}`);

		return message.reply({ embeds: [embed] });
	}
}
