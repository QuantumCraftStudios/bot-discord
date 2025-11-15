import { EmbedBuilder, Events } from "discord.js";
import { horaires } from "../config/horaires.js";

const UPDATE_INTERVAL = 3600000; // 1 heure en ms
const HORAIRES_TITLE = "🕒 Horaires d'ouverture de QuantumCraft Studios";
let horairesMessage = null;

export default {
    name: Events.ClientReady,
    once: false,

    async execute(client) {
        const channelId = process.env.HORAIRES_CHANNEL_ID;

        if (!channelId) {
            console.warn(
                "HORAIRES_CHANNEL_ID non défini - Horaires désactivés"
            );
            return;
        }

        try {
            const channel = await client.channels.fetch(channelId);

            if (!channel) {
                console.error("Salon des horaires introuvable");
                return;
            }

            // Chercher le message existant
            await findExistingHorairesMessage(channel, client);

            console.log("Affichage des horaires activé");

            // Première mise à jour
            await updateHoraires(channel);

            // Mise à jour toutes les heures
            setInterval(() => updateHoraires(channel), UPDATE_INTERVAL);
        } catch (error) {
            console.error("Erreur horaires:", error);
        }
    },
};

// Cherche le message existant des horaires
async function findExistingHorairesMessage(channel, client) {
    try {
        const messages = await channel.messages.fetch({ limit: 10 });

        const existingMessage = messages.find(
            (msg) =>
                msg.author.id === client.user.id &&
                msg.embeds.length > 0 &&
                msg.embeds[0].title === HORAIRES_TITLE
        );

        if (existingMessage) {
            horairesMessage = existingMessage;
            console.log("Message des horaires existant trouvé - Réutilisation");
        } else {
            console.log(
                "Aucun message d'horaires existant - Création d'un nouveau"
            );
        }
    } catch (error) {
        console.error("Erreur lors de la recherche du message:", error);
    }
}

// Met à jour le message des horaires
async function updateHoraires(channel) {
    try {
        const today = new Date().getDay(); // 0-6 (Dimanche = 0)
        const todayDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

        // Vérifier si fermeture exceptionnelle
        const isClosed = horaires.fermeturesExceptionnelles.includes(todayDate);

        // Construire la description avec tous les jours
        let description = "";
        for (let i = 1; i <= 7; i++) {
            const dayIndex = i === 7 ? 0 : i; // Dimanche en dernier
            const dayName = horaires.jours[dayIndex];
            const dayHours = horaires.semaine[dayIndex];
            const arrow = dayIndex === today ? "➡️ " : "";
            const bold = dayIndex === today ? "**" : "";

            description += `${arrow}${bold}${dayName}${bold} ${dayHours}\n`;
        }

        const embed = new EmbedBuilder()
            .setTitle(HORAIRES_TITLE)
            .setColor(0x5865f2)
            .setDescription(description)
            .addFields({
                name: "ℹ️ Informations",
                value:
                    `${horaires.infos.weekend}\n ${horaires.infos.fetes} \n` +
                    `${
                        isClosed
                            ? "⚠️ **Fermeture exceptionnelle aujourd'hui.**"
                            : "✅ Aucune fermeture exceptionnelle prévue cette semaine."
                    }\n` +
                    `🕒 Mise à jour quotidienne automatique avec le jour actuel.`,
                inline: false,
            })
            .setFooter({
                text: "Copyright © 2025 QuantumCraft Studios. Tous droits réservés.",
            })
            .setTimestamp();

        // Créer ou éditer le message
        if (!horairesMessage) {
            horairesMessage = await channel.send({ embeds: [embed] });
            console.log("Nouveau message d'horaires créé");
        } else {
            try {
                await horairesMessage.edit({ embeds: [embed] });
            } catch (error) {
                if (error.code === 10008) {
                    console.log("Message supprimé - Création d'un nouveau");
                    horairesMessage = await channel.send({ embeds: [embed] });
                } else {
                    throw error;
                }
            }
        }
    } catch (error) {
        console.error("Erreur mise à jour horaires:", error);
    }
}
