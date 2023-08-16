import { Command } from "./commands/command";
import { Folder } from "./reciever/folder";

export class Terminal {
  private commands: { [k: string]: Command } = {};
  private folders: { [k: string]: Folder } = {};
  private currentFolder: string = "";
  private isDryRun: boolean = false;

  addCommand(command: Command): string {
    const commandId = new Date().toISOString();
    this.commands[commandId] = command;
    return commandId;
  }

  async executeCommand(key: string) {
    const newFolder = await this.commands[key].execute(this.isDryRun);

    if (newFolder) {
      this.setCurrentDir(newFolder);
    }

    return {
      output: Object.values(this.commands)
        .map((command) => [
          ...command.getOutput(),
          "--------------------------------------------------------------------------------",
        ])
        .flat(1),
      currentFolder: newFolder,
    };
  }

  setFolder(key: string, folder: Folder): void {
    this.folders[key] = folder;
  }

  getCurrentFolder() {
    return this.folders[this.currentFolder];
  }

  getCurrentDir() {
    return this.currentFolder;
  }

  setCurrentDir(dirName: string) {
    this.currentFolder = dirName;
    if (!this.getCurrentFolder()) {
      const folder = new Folder(dirName);
      this.setFolder(folder.getPath(), folder);
    }
  }

  async fetchCurrentDir() {
    try {
      const response = await fetch("/api/getCurrentDir");
      if (response.ok) {
        const data = await response.json();
        const folder = new Folder(data.currentDir);
        this.setFolder(folder.getPath(), folder);
        this.currentFolder = data.currentDir;
      } else {
        console.error("Error fetching file system information", response);
      }
    } catch (error) {
      console.error("Error fetching file system information:", error);
    }
  }

  async toggleDryRun() {
    if (this.isDryRun) {
      // disabling dry run
      this.folders = {};
      this.setCurrentDir(this.currentFolder);
    }
    this.isDryRun = !this.isDryRun;

    return [
      ...Object.values(this.commands)
        .map((command) => [
          ...command.getOutput(),
          "--------------------------------------------------------------------------------",
        ])
        .flat(1),
      `DRY RUN MODE HAS ${this.isDryRun ? "STARDED" : "ENDED"}`,
    ];
  }
}
