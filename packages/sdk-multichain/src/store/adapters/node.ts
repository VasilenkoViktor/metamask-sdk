import { StoreAdapter } from "../../domain";
import fs from 'fs'
import path from 'path';

const CONFIG_FILE = path.resolve(process.cwd(), '.metamask.json');

export class StoreAdapterNode extends StoreAdapter {
  readonly platform = 'node'

  private safeParse(contents: string): Record<string, string> {
    try {
      return JSON.parse(contents);
    } catch (e) {
      return {};
    }
  }

  async getItem(key: string): Promise<string | null> {
    if (!fs.existsSync(CONFIG_FILE)) {
      return null;
    }
    const contents = fs.readFileSync(CONFIG_FILE, 'utf8');
    const config = this.safeParse(contents);
    if (config[key] !== undefined) {
      return config[key];
    }
    return null;
  }

  async setItem(key: string, value: string): Promise<void> {
    if (!fs.existsSync(CONFIG_FILE)) {
      fs.writeFileSync(CONFIG_FILE, '{}');
    }
    const contents = fs.readFileSync(CONFIG_FILE, 'utf8');
    const config = this.safeParse(contents);
    config[key] = value;
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
  }

  async deleteItem(key: string): Promise<void> {
    if (!fs.existsSync(CONFIG_FILE)) {
      return;
    }
    const contents = fs.readFileSync(CONFIG_FILE, 'utf8');
    const config = this.safeParse(contents);
    delete config[key];
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
  }
}
