import { Folder } from "../reciever/folder";
import { Command } from "./command";

export class EchoCommand extends Command {
  private folder;
  private text;

  constructor(folder: Folder, text: string) {
    super();
    this.folder = folder;
    this.text = text;
  }

  async execute(): Promise<any> {
    this.setOutput([`$ ${this.folder.getPath()} echo ${this.text}`, this.text]);
  }
}
