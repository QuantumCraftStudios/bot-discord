import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const PROMOS_FILE = join(process.cwd(), "config", "promos.json");

// Charge les codes promos depuis le fichier
export function loadPromos() {
    try {
        const data = readFileSync(PROMOS_FILE, "utf-8");
        return JSON.parse(data).codes || [];
    } catch (error) {
        console.error("Erreur chargement promos:", error);
        return [];
    }
}

// Sauvegarde les codes promos dans le fichier
export function savePromos(codes) {
    try {
        writeFileSync(PROMOS_FILE, JSON.stringify({ codes }, null, 4), "utf-8");
        return true;
    } catch (error) {
        console.error("Erreur sauvegarde promos:", error);
        return false;
    }
}

// Ajoute un code promo
export function addPromo(code, reduction, description, validUntil = null) {
    const promos = loadPromos();

    // Vérifier si le code existe déjà
    if (promos.some((p) => p.code.toLowerCase() === code.toLowerCase())) {
        return { success: false, message: "Ce code promo existe déjà." };
    }

    const newPromo = {
        code: code.toUpperCase(),
        reduction,
        description,
        validUntil,
        createdAt: new Date().toISOString(),
    };

    promos.push(newPromo);
    savePromos(promos);

    return {
        success: true,
        message: "Code promo ajouté avec succès !",
        promo: newPromo,
    };
}

// Supprime un code promo
export function removePromo(code) {
    const promos = loadPromos();
    const initialLength = promos.length;

    const filteredPromos = promos.filter(
        (p) => p.code.toLowerCase() !== code.toLowerCase()
    );

    if (filteredPromos.length === initialLength) {
        return { success: false, message: "Code promo introuvable." };
    }

    savePromos(filteredPromos);
    return { success: true, message: "Code promo supprimé avec succès !" };
}

// Vérifie si un code promo est encore valide
export function isPromoValid(promo) {
    if (!promo.validUntil) return true;
    return new Date(promo.validUntil) > new Date();
}
