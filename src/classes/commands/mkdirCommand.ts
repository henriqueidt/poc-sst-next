import { Folder } from "../reciever/folder";
import { Command } from "./command";

export class MkdirCommand extends Command {
  private folder;
  private newFolderName;

  constructor(folder: Folder, newFolderName: string) {
    super();
    this.folder = folder;
    this.newFolderName = newFolderName;
  }

  async execute(isDryRun: boolean): Promise<any> {
    const output = await this.folder.mkdir(this.newFolderName, isDryRun);
    this.setOutput([
      `$ ${this.folder.getPath()} mkdir ${this.newFolderName}`,
      ...output,
    ]);
  }
}
