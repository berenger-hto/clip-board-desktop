import { Hono } from 'hono'
import { cors } from "hono/cors"
import { UserController } from './controllers/User.controller'
import { HTTPException } from "hono/http-exception"
import { ZodError } from 'zod'
import {logger} from "hono/logger"
import { DeviceController } from './controllers/Device.controller'
import { ClipboardController } from './controllers/Clipboard.controller'
import { Secure } from './middlewares/Secure.middleware'

export const hono = new Hono()

hono.use("*", logger())

hono.use(cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
}))

const prefix = "/v1/"

hono.post(prefix + 'me', UserController.me)
hono.get(prefix + 'device', DeviceController.device)
hono.get(prefix + 'clipboard', Secure.authorize, ClipboardController.clipboard)

hono.notFound((c) => {
    return c.json({
        message: `Route '${c.req.path}' non définie`,
        success: false
    }, 404)
})

hono.onError((error, c) => {
    const status = error instanceof HTTPException ? error.status : error instanceof ZodError ? 409 : 500
    return c.json({
        message: error instanceof ZodError ? error.issues[0].message : error instanceof HTTPException ? error.message : "Une erreur s'est produite",
        success: false,
    }, status)
})