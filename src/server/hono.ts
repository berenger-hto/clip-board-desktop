import { Hono } from 'hono'
import { UserController } from './controllers/User.controller'
import { HTTPException } from "hono/http-exception"
import { UserService } from '../services/User.service'

export const hono = new Hono()

const prefix = "/v1/"

hono.get('/', (c) => {
    return c.text('Hello Hono!')
})

hono.get(prefix + 'infos', UserService.authorize, UserController.infos)

hono.notFound((c) => {
    return c.json({
        message: `Route '${c.req.path}' non définie`,
        success: false
    }, 404)
})

hono.onError((error, c) => {
    const status = error instanceof HTTPException ? error.status : 500
    return c.json({
        message: error.message,
        success: false,
    }, status)
})