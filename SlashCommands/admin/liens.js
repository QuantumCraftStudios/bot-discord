import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    SlashCommandBuilder,
} from "discord.js";
import { liens } from "../../config/liens.js";

export default {
    data: new SlashCommandBuilder()
        .setName("liens")
        .setDescription("Affiche les liens importants de QuantumCraft Studios")
        .setDefaultMemberPermissions(0), // Réservé aux admins

    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle("QuantumCraft Studios")
            .setDescription(
                "Voici quelques informations sur QuantumCraft Studios"
            )
            .setColor(0x5865f2)
            .addFields(
                {
                    name: "📜 Le règlement",
                    value: `<#${liens.rules}>`,
                    inline: false,
                },
                {
                    name: "🟢 Notre page des statuts",
                    value: `[uptime.quantumcraft-studios.com](${liens.status})`,
                    inline: false,
                },
                {
                    name: "📘 Notre documentation",
                    value: `[docs.quantumcraft-studios.com](${liens.docs})`,
                    inline: false,
                },
                {
                    name: "👩🏻‍⚖️ Nos Mentions légales",
                    value: `[Consulter](${liens.legal})`,
                    inline: false,
                },
                {
                    name: "📝 Nos RGPD",
                    value: `[Consulter](${liens.rgpd})`,
                    inline: false,
                },
                {
                    name: "📨 Nous contacter",
                    value: `[Formulaire de contact](${liens.contact})`,
                    inline: false,
                }
            )
            .setFooter({
                text: "Copyright © 2025 QuantumCraft Studios - Tous droits réservés.",
            })
            .setTimestamp();

        // Création des boutons
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel("Visitez notre site")
                .setEmoji("🌐")
                .setURL(liens.website)
                .setStyle(ButtonStyle.Link),
            new ButtonBuilder()
                .setLabel("Nos Avis")
                .setEmoji("⭐")
                .setURL(liens.trustpilot)
                .setStyle(ButtonStyle.Link),
            new ButtonBuilder()
                .setLabel("Compte Twitter")
                .setEmoji("🐦")
                .setURL(liens.twitter)
                .setStyle(ButtonStyle.Link)
        );

        await interaction.reply({
            embeds: [embed],
            components: [row],
        });
    },
};
