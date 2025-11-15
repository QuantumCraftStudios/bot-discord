export async function checkServiceStatus(url) {
    const startTime = Date.now();

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

        const response = await fetch(url, {
            method: "GET",
            signal: controller.signal,
            headers: {
                "User-Agent": "QuantumCraft-Studios/1.0",
            },
        });

        clearTimeout(timeoutId);
        const responseTime = Date.now() - startTime;

        return {
            online: response.ok,
            statusCode: response.status,
            responseTime: responseTime,
            error: null,
        };
    } catch (error) {
        const responseTime = Date.now() - startTime;

        return {
            online: false,
            statusCode: null,
            responseTime: responseTime,
            error: error.message.includes("aborted")
                ? "Timeout"
                : "Injoignable",
        };
    }
}

export function getStatusEmoji(online) {
    return online ? "<:en_ligne:1372242870035021967>" : "🔴";
}

export function getStatusCodeDescription(statusCode) {
    if (!statusCode) return "";

    if (statusCode >= 200 && statusCode < 300) return "OK";
    if (statusCode >= 300 && statusCode < 400) return "Redirection";
    if (statusCode === 404) return "Introuvable";
    if (statusCode >= 400 && statusCode < 500) return "Erreur client";
    if (statusCode >= 500) return "Erreur serveur";

    return "Inconnu";
}
