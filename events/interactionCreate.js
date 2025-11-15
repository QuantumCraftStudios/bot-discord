import { Events } from "discord.js";
import { logger } from "../utils/logger.js";

export default {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.slashCommands.get(
            interaction.commandName
        );

        if (!command) {
            logger.error(`Commande /${interaction.commandName} introuvable`);
            return;
        }

        try {
            await command.execute(interaction);
            logger.command(interaction.commandName, interaction.user.tag);
        } catch (error) {
            logger.error(
                `Erreur lors de l'exécution de /${interaction.commandName}`,
                error
            );

            const errorMessage = {
                content:
                    "Une erreur est survenue lors de l'exécution de cette commande.",
                ephemeral: true,
            };

            if (interaction.replied || interaction.deferred) {
                await interaction.followUp(errorMessage);
            } else {
                await interaction.reply(errorMessage);
            }
        }
    },
};
