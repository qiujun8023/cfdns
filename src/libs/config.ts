import fs from 'fs'
import { ConfigData } from '../types'

export default class Config {
  constructor(private filename: string) { }

  save(data: ConfigData): void {
    fs.writeFileSync(this.filename, JSON.stringify(data))
  }

  load(): ConfigData {
    let data = fs.readFileSync(this.filename, 'utf8')
    return JSON.parse(data)
  }

  remove(): void {
    fs.unlinkSync(this.filename)
  }

  exists(): boolean {
    return fs.existsSync(this.filename)
  }
}
