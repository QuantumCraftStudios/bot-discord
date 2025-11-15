import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import {
    addPromo,
    isPromoValid,
    loadPromos,
    removePromo,
} from "../../utils/promosManager.js";

export default {
    data: new SlashCommandBuilder()
        .setName("code-promos")
        .setDescription("Affiche ou gère les codes promotionnels")
        .addSubcommand((subcommand) =>
            subcommand
                .setName("list")
                .setDescription("📋 Affiche tous les codes promos disponibles")
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("add")
                .setDescription(
                    "➕ Ajoute un nouveau code promo (Admin uniquement)"
                )
                .addStringOption((option) =>
                    option
                        .setName("code")
                        .setDescription("Le code promo (ex: BIENVENUE)")
                        .setRequired(true)
                        .setMaxLength(20)
                )
                .addStringOption((option) =>
                    option
                        .setName("reduction")
                        .setDescription(
                            "Montant de la réduction (ex: -20% ou -5€)"
                        )
                        .setRequired(true)
                        .setMaxLength(50)
                )
                .addStringOption((option) =>
                    option
                        .setName("description")
                        .setDescription("Description du code promo")
                        .setRequired(true)
                        .setMaxLength(200)
                )
                .addStringOption((option) =>
                    option
                        .setName("validite")
                        .setDescription(
                            "Date de fin de validité (format: JJ/MM/AAAA)"
                        )
                        .setRequired(false)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("remove")
                .setDescription("🗑️ Supprime un code promo (Admin uniquement)")
                .addStringOption((option) =>
                    option
                        .setName("code")
                        .setDescription("Le code promo à supprimer")
                        .setRequired(true)
                        .setAutocomplete(true)
                )
        ),

    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        // Vérifier les permissions pour add et remove
        if (subcommand === "add" || subcommand === "remove") {
            if (!interaction.member.permissions.has("Administrator")) {
                return interaction.reply({
                    content:
                        "❌ Vous devez être administrateur pour utiliser cette commande.",
                    flags: [64], // MessageFlags.Ephemeral
                });
            }
        }

        if (subcommand === "list") {
            await handleList(interaction);
        } else if (subcommand === "add") {
            await handleAdd(interaction);
        } else if (subcommand === "remove") {
            await handleRemove(interaction);
        }
    },

    // Autocomplétion pour la suppression
    async autocomplete(interaction) {
        const focusedValue = interaction.options.getFocused();
        const promos = loadPromos();

        const filtered = promos
            .filter((promo) =>
                promo.code.toLowerCase().includes(focusedValue.toLowerCase())
            )
            .slice(0, 25)
            .map((promo) => ({
                name: `${promo.code} - ${promo.reduction}`,
                value: promo.code,
            }));

        await interaction.respond(filtered);
    },
};

/**
 * Affiche la liste des codes promos
 */
async function handleList(interaction) {
    const promos = loadPromos();

    if (promos.length === 0) {
        return interaction.reply({
            content: "📭 Aucun code promo disponible pour le moment.",
            flags: [64], // MessageFlags.Ephemeral
        });
    }

    // Séparer les codes valides et expirés
    const validPromos = promos.filter(isPromoValid);
    const expiredPromos = promos.filter((p) => !isPromoValid(p));

    const embed = new EmbedBuilder()
        .setTitle("🎟️ Codes Promotionnels QuantumCraft Studios")
        .setDescription("Profitez de nos offres exclusives !")
        .setColor(0x5865f2)
        .setFooter({ text: "Copyright © 2025 QuantumCraft Studios" })
        .setTimestamp();

    if (validPromos.length > 0) {
        validPromos.forEach((promo) => {
            let validityText = "";
            if (promo.validUntil) {
                const date = new Date(promo.validUntil);
                validityText = `\n⏰ Valide jusqu'au ${date.toLocaleDateString(
                    "fr-FR"
                )}`;
            }

            embed.addFields({
                name: `🎁 ${promo.code}`,
                value: `💰 **${promo.reduction}**\n📝 ${promo.description}${validityText}`,
                inline: false,
            });
        });
    }

    if (expiredPromos.length > 0) {
        embed.addFields({
            name: "\u200B",
            value: `⚠️ **Codes expirés** (${expiredPromos.length})`,
            inline: false,
        });
    }

    await interaction.reply({ embeds: [embed] });
}

/**
 * Ajoute un nouveau code promo
 */
async function handleAdd(interaction) {
    const code = interaction.options.getString("code");
    const reduction = interaction.options.getString("reduction");
    const description = interaction.options.getString("description");
    const validite = interaction.options.getString("validite");

    let validUntil = null;
    if (validite) {
        // Convertir JJ/MM/AAAA en date
        const parts = validite.split("/");
        if (parts.length === 3) {
            const [day, month, year] = parts;
            validUntil = new Date(`${year}-${month}-${day}`).toISOString();
        }
    }

    const result = addPromo(code, reduction, description, validUntil);

    if (result.success) {
        const embed = new EmbedBuilder()
            .setTitle("✅ Code Promo Ajouté")
            .setColor(0x00ff00)
            .addFields(
                { name: "🎁 Code", value: result.promo.code, inline: true },
                {
                    name: "💰 Réduction",
                    value: result.promo.reduction,
                    inline: true,
                },
                {
                    name: "📝 Description",
                    value: result.promo.description,
                    inline: false,
                }
            );

        if (validUntil) {
            embed.addFields({
                name: "⏰ Validité",
                value: `Jusqu'au ${new Date(validUntil).toLocaleDateString(
                    "fr-FR"
                )}`,
                inline: false,
            });
        }

        await interaction.reply({
            embeds: [embed],
            flags: [64], // MessageFlags.Ephemeral
        });
    } else {
        await interaction.reply({
            content: `❌ ${result.message}`,
            flags: [64], // MessageFlags.Ephemeral
        });
    }
}

/**
 * Supprime un code promo
 */
async function handleRemove(interaction) {
    const code = interaction.options.getString("code");
    const result = removePromo(code);

    if (result.success) {
        await interaction.reply({
            content: `✅ Le code promo **${code.toUpperCase()}** a été supprimé.`,
            flags: [64], // MessageFlags.Ephemeral
        });
    } else {
        await interaction.reply({
            content: `❌ ${result.message}`,
            flags: [64], // MessageFlags.Ephemeral
        });
    }
}
