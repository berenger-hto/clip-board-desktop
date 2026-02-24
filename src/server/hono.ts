import { Hono } from 'hono'
import { cors } from "hono/cors"
import { UserController } from './controllers/User.controller'
import { HTTPException } from "hono/http-exception"
import { ZodError } from 'zod'
import { logger } from "hono/logger"
import { DeviceController } from './controllers/Device.controller'
import { ClipboardController } from './controllers/Clipboard.controller'
import { Secure } from './middlewares/Secure.middleware'
import { Server } from 'socket.io'

export const hono = new Hono()

export let io: Server

export const setupSocket = (server: any) => {
    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
        }
    })

    io.on("connection", (socket) => {
        console.log("a user connected")
        socket.on("disconnect", () => {
            console.log("user disconnected")
        })
    })

    return io
}

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
hono.get(prefix + 'device', Secure.authorize, DeviceController.device)
hono.get(prefix + 'clipboard', Secure.authorize, ClipboardController.clipboardData)
hono.get(prefix + 'clipboard/:id', Secure.authorize, ClipboardController.oneClipboardData)
hono.post(prefix + 'clipboard', Secure.authorize, ClipboardController.addData)
hono.patch(prefix + 'clipboard/:id', Secure.authorize, ClipboardController.updateData)
hono.delete(prefix + 'clipboard/:id', Secure.authorize, ClipboardController.deleteData)

hono.notFound((c) => {
    return c.json({
        message: `Route '${c.req.path}' non définie`,
        success: false
    }, 404)
})

hono.onError((error, c) => {
    const status = error instanceof HTTPException ? error.status : error instanceof ZodError ? 409 : 500
    console.error(error)
    return c.json({
        message: error instanceof ZodError ? error.issues[0].message : error instanceof HTTPException ? error.message : "Une erreur s'est produite",
        success: false,
    }, status)
})