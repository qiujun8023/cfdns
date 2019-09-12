import fs from 'fs';
import { IConfigData } from '../types';

export default class Config {
  constructor(private filename: string) { }

  public save(data: IConfigData): void {
    fs.writeFileSync(this.filename, JSON.stringify(data));
  }

  public load(): IConfigData {
    const data = fs.readFileSync(this.filename, 'utf8');
    return JSON.parse(data);
  }

  public remove(): void {
    fs.unlinkSync(this.filename);
  }

  public exists(): boolean {
    return fs.existsSync(this.filename);
  }
}
