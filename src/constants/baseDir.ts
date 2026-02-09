import { app } from "electron";

export const baseDir = (process.type === 'renderer' || process.type === 'browser') 
  ? app.getPath('userData') 
  : __dirname;