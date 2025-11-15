import { MessageFlags, SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Vérifie la latence du bot"),

    async execute(interaction) {
        await interaction.reply({
            content: "Calcul...",
            flags: MessageFlags.Ephemeral,
        });

        const sent = await interaction.fetchReply();
        const latency = sent.createdTimestamp - interaction.createdTimestamp;

        await interaction.editReply(`**Latence :** ${latency}ms`);
    },
};
