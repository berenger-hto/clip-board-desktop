export type Data = Record<string, string | number>

export type Option = {
    limit?: number
    order?: "ASC" | "DESC"
}

export type EnvKey = {
    [key: string]: string
}

export type Device = {
    deviceName: string
    osName: string
    osVersion: string
}

export type MobileDevice = {
    deviceName: string
    deviceOSName: string
    deviceOSVersion: string
}