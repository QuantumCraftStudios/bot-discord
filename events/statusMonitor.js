import { EmbedBuilder, Events } from "discord.js";
import { services } from "../config/services.js";
import {
    checkServiceStatus,
    getStatusCodeDescription,
    getStatusEmoji,
} from "../utils/statusChecker.js";

const UPDATE_INTERVAL = 30000; // 30 secondes
let statusMessage = null;

export default {
    name: Events.ClientReady,
    once: false,

    async execute(client) {
        const channelId = process.env.STATUS_CHANNEL_ID;

        if (!channelId) {
            console.warn("STATUS_CHANNEL_ID non défini - Monitoring désactivé");
            return;
        }

        try {
            const channel = await client.channels.fetch(channelId);

            if (!channel) {
                console.error("Salon de statut introuvable");
                return;
            }

            // Chercher le message existant du bot
            await findExistingStatusMessage(channel, client);

            console.log("Monitoring de statut activé");

            // Première mise à jour
            await updateStatus(channel);

            // Mise à jour toutes les 30 secondes
            setInterval(() => updateStatus(channel), UPDATE_INTERVAL);
        } catch (error) {
            console.error("Erreur monitoring:", error);
        }
    },
};

/**
 * Cherche le dernier message du bot dans le salon
 */
async function findExistingStatusMessage(channel, client) {
    try {
        // Récupérer les derniers messages du salon
        const messages = await channel.messages.fetch({ limit: 10 });

        // Chercher un message du bot avec le titre spécifique
        const existingMessage = messages.find(
            (msg) =>
                msg.author.id === client.user.id &&
                msg.embeds.length > 0 &&
                msg.embeds[0].title === "📶 État des services QuantumCraft"
        );

        if (existingMessage) {
            statusMessage = existingMessage;
            console.log("Message de statut existant trouvé - Réutilisation");
        } else {
            console.log(
                "ℹAucun message de statut existant - Création d'un nouveau"
            );
        }
    } catch (error) {
        console.error(
            "Erreur lors de la recherche du message existant:",
            error
        );
    }
}

/**
 * Met à jour le message de statut
 */
async function updateStatus(channel) {
    try {
        // Vérifier tous les services
        const results = await Promise.all(
            services.map(async (service) => ({
                ...service,
                status: await checkServiceStatus(service.url),
            }))
        );

        const onlineCount = results.filter((r) => r.status.online).length;
        const offlineCount = results.length - onlineCount;

        const embed = new EmbedBuilder()
            .setTitle("📶 État des services QuantumCraft Studios")
            .setColor(0x5865f2)
            .setDescription(
                `🔧 Surveillance active\n<:en_ligne:1372242870035021967> En ligne : **${onlineCount}** | <:hors_ligne:1372242968618078380> Hors ligne : **${offlineCount}**\n\u200B`
            );

        // Ajouter chaque service
        results.forEach((service) => {
            const emoji = getStatusEmoji(service.status.online);
            let value;

            if (service.status.online) {
                const codeDesc = getStatusCodeDescription(
                    service.status.statusCode
                );
                value = `Réponse : ${service.status.statusCode} ${codeDesc} • ${service.status.responseTime} ms`;
            } else {
                value = service.status.error || "Injoignable";
            }

            embed.addFields({
                name: `${emoji} ${service.name}`,
                value: value,
                inline: false,
            });
        });

        // Légende
        embed.addFields({
            name: "\u200B",
            value:
                "**📘 Légende des codes HTTP**\n" +
                "`200-299` ✅ OK : Service fonctionnel\n" +
                "`404` ❌ Introuvable\n" +
                "`500+` ⚠️ Erreur serveur",
            inline: false,
        });

        const timestamp = new Date().toLocaleString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });

        embed.setFooter({
            text: `⏱ Mise à jour toutes les 30 sec. • ${timestamp}`,
        });
        embed.setTimestamp();

        // Créer ou éditer le message
        if (!statusMessage) {
            statusMessage = await channel.send({ embeds: [embed] });
            console.log("Nouveau message de statut créé");
        } else {
            try {
                await statusMessage.edit({ embeds: [embed] });
            } catch (error) {
                // Si le message a été supprimé, en créer un nouveau
                if (error.code === 10008) {
                    // Unknown Message
                    console.log("Message supprimé - Création d'un nouveau");
                    statusMessage = await channel.send({ embeds: [embed] });
                } else {
                    throw error;
                }
            }
        }
    } catch (error) {
        console.error("Erreur mise à jour statut:", error);
    }
}
