import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Affiche la liste des commandes disponibles"),

    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle("Commandes QuantumCraft Studios")
            .setColor(0x5865f2)
            .setDescription("Voici toutes les commandes disponibles :")
            .addFields({
                name: "Commandes Utiles",
                value: "`/help` - Affiche ce message\n`/ping` - Vérifie la latence du bot\n",
                inline: false,
            })
            .setFooter({ text: "QuantumCraft Studios" })
            .setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};
