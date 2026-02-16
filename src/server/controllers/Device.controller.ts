import { Context } from "hono"
import os from "node:os"

export class DeviceController {
    public static device(c: Context) {
        const deviceName = os.hostname()
        const platform = os.platform()
        const username = os.userInfo().username
        return c.json({
            success: true,
            message: "My device",
            os: {
                deviceName,
                platform,
                username
            }
        })
    }
}