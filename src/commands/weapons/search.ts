import { EmbedBuilder } from "@discordjs/builders";
import { RegisterSubCommand, Command } from "@kaname-png/plugin-subcommands-advanced";
import { isNullish } from "@sapphire/utilities";
import { ButtonStyle, ComponentType } from "discord-api-types/v10";
import { ActionRowBuilder, ButtonBuilder } from "discord.js";
import GenshinDB, { Language } from "genshin-db";

@RegisterSubCommand('weapons', 
  (builder) => builder
    .setName("search")
    .setDescription("Busca una arma.")
    .addStringOption(
      opt => opt
        .setName('weapon')
        .setDescription("Nombre del arma. (ES, EN)")
        .setRequired(true)
        .setAutocomplete(true))
)
export class UserCommand extends Command {
  public override async chatInputRun(interaction: Command.ChatInputInteraction) {
    const weapon = interaction.options.getString('weapon', true);

    const result = GenshinDB.weapons(weapon, {
      queryLanguages: [Language.Spanish, Language.English],
      resultLanguage: Language.Spanish
    });

    if (isNullish(result) || Array.isArray(result)) {
      return await interaction.reply("Paimon no pudo encontrar esa arma. ¿Estás seguro de que existe?");
    }

    const row = new ActionRowBuilder<ButtonBuilder>()
    .addComponents([
      new ButtonBuilder()
      .setLabel("Historia")
      .setStyle(ButtonStyle.Success)
      .setCustomId("story"),
      new ButtonBuilder()
      .setLabel("Mejoras")
      .setStyle(ButtonStyle.Success)
      .setCustomId("costs")
    ]);

    const Base = new EmbedBuilder()
      .setTitle(result!.name)
      .setThumbnail(result!.images.icon!)
      .setColor(0x2f3136)

    Base
      .setDescription(`"${result!.description}"\n
      Información general:
      › \`Tipo de arma:\` ${result!.weapontype}
      › \`Rareza:\` [${result!.rarity}] ${'⭐'.repeat(Number(result!.rarity))}
      › \`Versión:\` ${result!.version}
      `);

    return await interaction.reply({ 
      content: "¡Listo!",
      embeds: [Base],
      components: [row]
    }).then(async (i) => {
      const collector = i.createMessageComponentCollector({
        componentType: ComponentType.Button
      });
  
      collector.on('collect', async (b) => {
        switch (b.customId) {
          case "story": {
            Base
              .setDescription(result!.story)

            await b.message.edit({ embeds: [Base] });
            await b.deferUpdate();
            break;
          }
  
          case "costs": {
            const { ascend1, ascend2, ascend3, ascend4, ascend5, ascend6 } = result.costs;
            const ascend1_content = ascend1.map((item) => `› \`${item.name}:\` ${item.count ?? 0}`).join("\n");
            const ascend2_content = ascend2.map((item) => `› \`${item.name}:\` ${item.count}`).join("\n");
            const ascend3_content = ascend3.map((item) => `› \`${item.name}:\` ${item.count}`).join("\n");
            const ascend4_content = ascend4.map((item) => `› \`${item.name}:\` ${item.count}`).join("\n");
            const ascend5_content = ascend5 === undefined ? 
            "No disponible" : 
            ascend5.map((item) => `› \`${item.name}:\` ${item.count}`).join("\n");
            const ascend6_content = ascend6 === undefined ? 
            "No disponible" : 
            ascend6.map((item) => `› \`${item.name}:\` ${item.count}`).join("\n");

            Base
              .setDescription('Materiales de ascenso.')
              .addFields([
                { name: "Nivel 1", value: ascend1_content },
                { name: "Nivel 2", value: ascend2_content },
                { name: "Nivel 3", value: ascend3_content },
                { name: "Nivel 4", value: ascend4_content },
                { name: "Nivel 5", value: ascend5_content },
                { name: "Nivel 6", value: ascend6_content }
              ]);

            await b.message.edit({ embeds: [Base] })
            await b.deferUpdate();
            break;
          }
        }
      });
    });
  }
  /* this.mora */
  // private mora = this.container.client.emojis.resolve("1084853707943972875");
}