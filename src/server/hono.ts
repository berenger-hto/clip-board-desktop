import { Hono } from 'hono'
import { User } from './controllers/User.controller'

export const hono = new Hono()

new User()

hono.get('/', (c) => {
    return c.text('Hello Hono!')
})