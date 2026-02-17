import { Context } from "hono";
import { ClipboardModel } from "../model/Clipboard.model";
import { wait } from "../../functions/wait";

const clipboardModel = new ClipboardModel()

export class ClipboardController {
    public static async clipboard(c: Context) {
        await wait(3000)
        const limit = c.req.query("limit")
        const limitNumber = limit ? parseInt(limit, 10) : 50
        const data = await clipboardModel.getData(limitNumber)
        return c.json({ success: true, message: "Données synchronisées", data })
    }
}