import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    SlashCommandBuilder,
} from "discord.js";
import { supportConfig } from "../../config/support.js";

export default {
    data: new SlashCommandBuilder()
        .setName("support")
        .setDescription(
            "🎫 Affiche les informations pour créer un ticket de support"
        ),

    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle("🎫 Support QuantumCraft Studios")
            .setDescription(
                "**Besoin d'aide ?** Créez un ticket de support en fonction de votre besoin !\n" +
                    "Cliquez sur un lien ci-dessous pour accéder directement au formulaire.\n\u200B"
            )
            .setColor(0x5865f2);

        // Ajouter chaque catégorie de support avec lien cliquable
        supportConfig.categories.forEach((category) => {
            embed.addFields({
                name: `${category.emoji} ${category.title}`,
                value: `${category.description}\n➡️ **[Créer un ticket ${category.title}](${category.url})**`,
                inline: false,
            });
        });

        embed.setFooter({
            text: "QuantumCraft Studios • Support Client",
        });
        embed.setTimestamp();

        // Bouton général
        const button = new ButtonBuilder()
            .setLabel("Portail Support")
            .setEmoji("🌐")
            .setURL(supportConfig.ticketUrl)
            .setStyle(ButtonStyle.Link);

        const row = new ActionRowBuilder().addComponents(button);

        await interaction.reply({
            embeds: [embed],
            components: [row],
        });
    },
};
