export const horaires = {
    // Horaires par jour (0 = Dimanche, 1 = Lundi, etc.)
    semaine: {
        1: "09:00–12:00, 14:00–17:00", // Lundi
        2: "09:00–12:00, 14:00–17:00", // Mardi
        3: "09:00–12:00, 14:00–17:00", // Mercredi
        4: "09:00–12:00, 14:00–17:00", // Jeudi
        5: "09:00–12:00, 14:00–17:00", // Vendredi
        6: "09:00–12:00, 14:00–17:00", // Samedi
        0: "09:00–12:00, 14:00–17:00", // Dimanche
    },

    // Noms des jours
    jours: {
        1: "Lundi",
        2: "Mardi",
        3: "Mercredi",
        4: "Jeudi",
        5: "Vendredi",
        6: "Samedi",
        0: "Dimanche",
    },

    // Fermetures exceptionnelles (format: 'YYYY-MM-DD')
    fermeturesExceptionnelles: [
        "2025-12-25", // Noël
        "2025-01-01", // Nouvel An
    ],

    // Informations supplémentaires
    infos: {
        weekend:
            "📌 Le support peut avoir un délai de réponse prolongé durant le week-end.",
        fetes: "🎄 Le support n'est pas ou peu disponible le jour de Noël et du Nouvel An.",
    },
};
