import os from "node:os"
import { NetworkInterface } from "../types/types"

export class NetworkService {
    public static getInterfaces() {
        const networkInterfaces = os.networkInterfaces()
        const interfaces: NetworkInterface[] = []
        for (let networkInterface in networkInterfaces) {
            const details = networkInterfaces[networkInterface]
            if (!details) continue
            for (let n of details) {
                if (n.family === "IPv4" && !n.internal) {
                    interfaces.push({
                        interface: networkInterface,
                        ip: n.address,
                        mac: n.mac,
                        netmask: n.netmask
                    })
                }
            }
        }

        return interfaces
    }
}
