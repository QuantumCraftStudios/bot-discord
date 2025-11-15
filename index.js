// 🌌 QuantumCraft Studios - Bot Discord
// Auteur : Jessy D
// Version : 1.0.0

import { Client, Collection, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import { readdir } from "fs/promises";
import { join } from "path";

dotenv.config();

// Configuration du client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});

// Collection pour stocker les commandes slash
client.slashCommands = new Collection();

// Chargement des commandes slash
const loadSlashCommands = async () => {
    const foldersPath = join(process.cwd(), "SlashCommands");
    const commandFolders = await readdir(foldersPath);

    for (const folder of commandFolders) {
        const commandsPath = join(foldersPath, folder);
        const commandFiles = (await readdir(commandsPath)).filter((file) =>
            file.endsWith(".js")
        );

        for (const file of commandFiles) {
            const command = await import(`./SlashCommands/${folder}/${file}`);
            if (command.default?.data && command.default?.execute) {
                client.slashCommands.set(
                    command.default.data.name,
                    command.default
                );
                console.log(
                    `Slash commands chargée : /${command.default.data.name} (${folder})`
                );
            }
        }
    }
};

// Chargement des événements
const loadEvents = async () => {
    const eventsPath = join(process.cwd(), "events");
    const eventFiles = (await readdir(eventsPath)).filter((file) =>
        file.endsWith(".js")
    );

    for (const file of eventFiles) {
        const event = await import(`./events/${file}`);
        if (event.default?.name) {
            if (event.default.once) {
                client.once(event.default.name, (...args) =>
                    event.default.execute(...args)
                );
            } else {
                client.on(event.default.name, (...args) =>
                    event.default.execute(...args)
                );
            }
            console.log(`Événement chargé : ${event.default.name}`);
        }
    }
};

// Initialisation
const init = async () => {
    try {
        await loadSlashCommands();
        await loadEvents();

        if (!process.env.DISCORD_TOKEN) {
            throw new Error("Token Discord manquant dans .env");
        }

        await client.login(process.env.DISCORD_TOKEN);
    } catch (error) {
        console.error("Erreur lors de l'initialisation :", error);
        process.exit(1);
    }
};

init();
