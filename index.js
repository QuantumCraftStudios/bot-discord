// 🌌 QuantumCraft Studios - Bot Discord de base
// Auteur : Jessy D
// Version : 1.0.0

import { Client, Events, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";

// Chargement des variables d'environnement (token, etc.)
dotenv.config();

// Configuration du client Discord
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, // Connexion au serveur
        GatewayIntentBits.GuildMessages, // Réagir aux messages
        GatewayIntentBits.MessageContent, // Lire le contenu des messages
    ],
});

// Événements de base

// Lorsque le bot est prêt
client.once(Events.ClientReady, () => {
    console.log(`Connecté en tant que ${client.user.tag}`);
});

// Connexion au bot
const TOKEN = process.env.DISCORD_TOKEN;

if (!TOKEN) {
    console.error(
        "Erreur : le token Discord est manquant dans le fichier .env"
    );
    process.exit(1);
}

client.login(TOKEN);
