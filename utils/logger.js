const DEBUG = process.env.DEBUG_MODE === "true";

export const logger = {
    // Logs toujours affichés
    info: (message) => {
        console.log(`ℹ${message}`);
    },

    success: (message) => {
        console.log(`${message}`);
    },

    warn: (message) => {
        console.warn(`${message}`);
    },

    error: (message, error = null) => {
        console.error(`${message}`);
        if (error && DEBUG) console.error(error);
    },

    // Logs uniquement en mode debug
    debug: (message) => {
        if (DEBUG) console.log(`${message}`);
    },

    command: (commandName, username) => {
        if (DEBUG) console.log(`/${commandName} par ${username}`);
    },
};
