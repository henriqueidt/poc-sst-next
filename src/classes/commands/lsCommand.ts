import { Folder } from "../reciever/folder";
import { Command } from "./command";

export class LsCommand extends Command {
  private folder;

  constructor(folder: Folder) {
    super();
    this.folder = folder;
  }

  async execute(): Promise<any> {
    const output = await this.folder.ls();
    this.setOutput([`$ ${this.folder.getPath()} ls`, ...output]);
  }
}
