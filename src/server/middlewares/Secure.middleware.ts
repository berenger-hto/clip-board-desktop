import { Context, Next } from "hono";
import { UserService } from "../../services/User.service";
import { HTTPException } from "hono/http-exception";

export class Secure {
    public static async authorize(c: Context, next: Next) {
        const headers = c.req.header("Authorization")
        const token = await UserService.getUniqueUserToken()
        if (!token || token !== headers) {
            throw new HTTPException(401, { message: "Accès non autorisé. Essayez de vous reconnecter !" })
        }
        await next()
    }
}