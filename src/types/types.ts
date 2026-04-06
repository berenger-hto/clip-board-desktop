export type Data = Record<string, string | number | boolean>

export type Option = {
    limit?: number
    order?: "ASC" | "DESC"
}

export type Device = {
    deviceName: string
    osName: string
    osVersion: string
}

export type MobileDevice = {
    deviceName?: string
    deviceOSName?: string
    deviceOSVersion?: string
}

export type FilterItem = "TEXT" | "CODE" | "URL" | "FAVORITES"

export type NetworkInterface = {
    interface: string
    ip: string
    mac: string
    netmask: string
}