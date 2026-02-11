import dotenv from "dotenv"
import { EnvKey } from "../types/types"

dotenv.config()

export const env = process.env as EnvKey