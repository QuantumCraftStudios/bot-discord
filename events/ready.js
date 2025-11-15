import { ActivityType, Events } from "discord.js";

export default {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        console.log(`\nBot connecté en tant que ${client.user.tag}`);
        console.log(`${client.slashCommands.size} commandes slash chargées\n`);

        // Statut personnalisé
        client.user.setPresence({
            activities: [
                {
                    name: "vos serveurs | /help",
                    type: ActivityType.Watching,
                },
            ],
            status: "online",
        });
    },
};
