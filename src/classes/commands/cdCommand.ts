import { Folder } from "../reciever/folder";
import { Command } from "./command";

export class CdCommand extends Command {
  private folder;
  private target;
  private newPath = "";

  constructor(folder: Folder, target: string) {
    super();
    this.folder = folder;
    this.target = target;
  }

  async execute(): Promise<any> {
    const newDirPath = await this.folder.cd(this.target);
    this.newPath = newDirPath;
    this.setOutput([`$ ${this.folder.getPath()} cd ${this.target}`]);
    return newDirPath;
  }

  getNewPath() {
    return this.newPath;
  }
}
