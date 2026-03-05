import { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import z from "zod";
import { ClipboardService } from "../../services/Clipboard.service";
import type { FilterItem } from "../../types/types";

const addDataSchema = z.object({
    content: z.string("Aucun contenu détecté").min(1),
    type: z.string("Aucun type détecté").min(1).refine((value) => ["AUTO", "CODE", "TEXT", "URL"].includes(value), "Type invalide"),
    source: z.string("Aucune source détectée").min(1).refine((value) => ["PC", "Mobile"].includes(value), "Source invalide")
})

const updateDataSchema = z.object({
    content: z.string("Aucun contenu détecté").min(1),
    type: z.string("Aucun type détecté").min(1).refine((value) => ["AUTO", "CODE", "TEXT", "URL"].includes(value), "Type invalide")
})

const filterItems = ["TEXT", "CODE", "URL", "FAVORITES"]

export class ClipboardController {
    public static async clipboardData(c: Context) {
        const limit = c.req.query("limit")
        const limitNumber = limit ? parseInt(limit, 10) : 50
        const data = await ClipboardService.getDataToDB(limitNumber)
        if (data.length === 0) {
            throw new HTTPException(404, { message: "Aucune donnée disponible" })
        }
        return c.json({ success: true, message: "Données synchronisées", data })
    }

    public static async allClipboardData(c: Context) {
        const data = await ClipboardService.getAllDataToDB()
        if (!data || data.length === 0) {
            throw new HTTPException(404, { message: "Aucune donnée disponible" })
        }
        return c.json({ success: true, message: "Données synchronisées", data })
    }

    public static async oneClipboardData(c: Context) {
        const id = c.req.param("id")
        const data = await ClipboardService.getOneData(id)
        if (!data) {
            throw new HTTPException(404, { message: "Donnée non disponible" })
        }
        return c.json({ success: true, message: "Donnée récupérée", data })
    }

    public static async addData(c: Context) {
        const body = await c.req.json()
        const data = addDataSchema.parse(body)

        await ClipboardService.addClipboardEntry(data.content, data.source, data.type)

        return c.json({ success: true, message: "Sauvegardé" })
    }

    public static async updateData(c: Context) {
        const id = c.req.param("id")
        const body = await c.req.json()
        const data = updateDataSchema.parse(body)
        const isUpdated = await ClipboardService.updateClipboardEntry(id, data.content, data.type)
        if (!isUpdated) {
            throw new HTTPException(404, { message: "Erreur lors de la mise à jour" })
        }

        return c.json({ success: true, message: "Mis à jour" })
    }

    public static async deleteData(c: Context) {
        const id = c.req.param("id")
        const isDeleted = await ClipboardService.deleteClipboardEntry(id)
        if (!isDeleted) {
            throw new HTTPException(404, { message: "Erreur lors de la suppression" })
        }

        return c.json({ success: true, message: "Supprimé" })
    }

    public static async findData(c: Context) {
        const searchItem = c.req.query("q")
        if (!searchItem) {
            throw new HTTPException(400, { message: "Aucun élément de recherche n'a été fourni" })
        }

        const data = await ClipboardService.find(searchItem)
        if (!data || data.length === 0) {
            throw new HTTPException(404, { message: "Aucun résultat" })
        }

        return c.json({ success: true, message: "Données trouvées", data })
    }

    public static async filterData(c: Context) {
        const filterItem = c.req.query("f") as FilterItem | undefined
        if (!filterItem) {
            throw new HTTPException(400, { message: "Aucun filtre fourni" })
        }

        if (!filterItems.includes(filterItem)) {
            throw new HTTPException(400, { message: "Type de filtre invalide" })
        }
        
        const data =  filterItem !== "FAVORITES" ? 
            await ClipboardService.findWithFilter(filterItem) : 
            await ClipboardService.getFavorites()
            
        if (!data || data.length === 0) {
            throw new HTTPException(404, { message: "Aucune donnée disponible" })
        }
        
        return c.json({ success: true, message: "Données filtrées", data })
    }

    public static async toggleFavorite(c: Context) {
        const id = c.req.param("id")
        const isToggled = await ClipboardService.toggleFavorite(id)
        if (!isToggled) {
            throw new HTTPException(404, { message: "Erreur lors du changement de favori" })
        }
        
        return c.json({ success: true, message: "Favori changé" })
    }
}

