import { REST, Routes } from "discord.js";
import dotenv from "dotenv";
import { readdir } from "fs/promises";
import { join } from "path";

dotenv.config();

const commands = [];
const foldersPath = join(process.cwd(), "SlashCommands");

// Chargement des commandes
const commandFolders = await readdir(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = join(foldersPath, folder);
    const commandFiles = (await readdir(commandsPath)).filter((file) =>
        file.endsWith(".js")
    );

    for (const file of commandFiles) {
        const command = await import(`./SlashCommands/${folder}/${file}`);
        if (command.default?.data && command.default?.execute) {
            commands.push(command.default.data.toJSON());
        }
    }
}

// Déploiement des commandes
const rest = new REST().setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log(`Déploiement de ${commands.length} commandes slash...`);

        const data = await rest.put(
            Routes.applicationGuildCommands(
                process.env.CLIENT_ID,
                process.env.GUILD_ID
            ),
            { body: commands }
        );

        console.log(`${data.length} commandes slash déployées avec succès !`);
    } catch (error) {
        console.error("Erreur lors du déploiement :", error);
    }
})();
