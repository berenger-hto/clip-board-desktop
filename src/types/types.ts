export type Data = Record<string, string | number>

export type Option = {
    limit?: number
    order?: "ASC" | "DESC"
}

export type EnvKey = {
    [key: string]: string
}