import { Folder } from "../reciever/folder";
import { Command } from "./command";

export class TouchCommand extends Command {
  private folder;
  private newFileName;

  constructor(folder: Folder, newFileName: string) {
    super();
    this.folder = folder;
    this.newFileName = newFileName;
  }

  async execute(isDryRun: boolean): Promise<any> {
    const output = await this.folder.touch(this.newFileName, isDryRun);
    this.setOutput([
      `$ ${this.folder.getPath()} touch ${this.newFileName}`,
      ...output,
    ]);
  }
}
