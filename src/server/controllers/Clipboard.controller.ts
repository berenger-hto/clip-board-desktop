import { Context } from "hono";
import { ClipboardModel } from "../model/Clipboard.model";
import { io } from "../hono";
import { HTTPException } from "hono/http-exception";

const clipboardModel = new ClipboardModel()

export class ClipboardController {
    public static async clipboard(c: Context) {
        const limit = c.req.query("limit")
        const limitNumber = limit ? parseInt(limit, 10) : 50
        const data = await clipboardModel.getData(limitNumber)
        return c.json({ success: true, message: "Données synchronisées", data })
    }

    public static async deleteData(c: Context) {
        const id = c.req.param("id")
        const isDeleted = await clipboardModel.deleteData(id)
        if (!isDeleted) throw new HTTPException(404, { message: "Erreur lors de la suppression" })
        io.emit("clipboard", true)
        return c.json({ success: true, message: "Données supprimées" })
    }
}