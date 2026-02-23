import { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import z from "zod";
import { ClipboardService } from "../../services/Clipboard.service";

const addDataSchema = z.object({
    content: z.string().min(1, "Aucun contenu détecté"),
    type: z.string().min(1, "Aucun type détecté").refine((value) => ["AUTO", "CODE", "TEXT", "URL"].includes(value), "Type invalide"),
    source: z.string().min(1, "Aucune source détectée").refine((value) => ["PC", "Mobile"].includes(value), "Source invalide")
})

const updateDataSchema = z.object({
    content: z.string().min(1, "Aucun contenu détecté"),
    type: z.string().min(1, "Aucun type détecté").refine((value) => ["AUTO", "CODE", "TEXT", "URL"].includes(value), "Type invalide")
})

export class ClipboardController {
    public static async clipboard(c: Context) {
        const limit = c.req.query("limit")
        const limitNumber = limit ? parseInt(limit, 10) : 50
        const data = await ClipboardService.getDataToDB(limitNumber)
        return c.json({ success: true, message: "Données synchronisées", data })
    }

    public static async addData(c: Context) {
        const body = await c.req.json()
        const data = addDataSchema.parse(body)

        await ClipboardService.addClipboardEntry(data.content, data.source, data.type)

        return c.json({ success: true, message: "Données sauvegardées" })
    }

    public static async updateData(c: Context) {
        const id = c.req.param("id")
        const body = await c.req.json()
        const data = updateDataSchema.parse(body)

        const isUpdated = await ClipboardService.updateClipboardEntry(id, data.content, data.type)
        if (!isUpdated) throw new HTTPException(404, { message: "Erreur lors de la mise à jour" })

        return c.json({ success: true, message: "Données mises à jour" })
    }

    public static async deleteData(c: Context) {
        const id = c.req.param("id")
        const isDeleted = await ClipboardService.deleteClipboardEntry(id)
        if (!isDeleted) throw new HTTPException(404, { message: "Erreur lors de la suppression" })

        return c.json({ success: true, message: "Données supprimées" })
    }
}