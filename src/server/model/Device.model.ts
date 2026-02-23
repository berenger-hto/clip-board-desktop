import { DB } from "../../services/DB"
import { MobileDevice } from "../../types/types"

const db = new DB()

export class DeviceModel {
    public async addDevice(deviceName: string, deviceOSName: string, deviceOSVersion: string) {
        await db.insert({ device: "device", deviceName, deviceOSName, deviceOSVersion })
    }

    public async getDevice(options?: MobileDevice) {
        const getDevicesLine = await db.get({ device: "device", ...options })
        if (getDevicesLine && getDevicesLine.length > 0) {
            return getDevicesLine
        }
        return []
    }

    public async getAllDevices() {
        const devices = await db.get({ device: "device" }, { order: "DESC" })
        return devices ? devices : [] 
    }

    public async findDevice(options: Required<MobileDevice>) {
        const { deviceName, deviceOSVersion, deviceOSName } = options
        const device = await db.findOne({ device: "device", deviceName, deviceOSName, deviceOSVersion })
        return device
    }

    public async updateDevice(id: string, data: MobileDevice) {
        const updated = await db.update(id, data)
        return !!updated
    }
}