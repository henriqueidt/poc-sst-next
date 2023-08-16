import { Folder } from "../reciever/folder";
import { CdCommand } from "./cdCommand";
import { Command } from "./command";
import { EchoCommand } from "./echoCommand";
import { LsCommand } from "./lsCommand";
import { MkdirCommand } from "./mkdirCommand";
import { TouchCommand } from "./touchCommand";

export class CommandFactory {
  getCommand(currentFolder: Folder, text: string): Command | null {
    const splittedCommand = text.trim().split(" ");
    const commandValue = splittedCommand[0];
    const commandArg = splittedCommand[1];
    switch (commandValue) {
      case "ls":
        return new LsCommand(currentFolder);

      case "mkdir":
        return new MkdirCommand(currentFolder, commandArg);

      case "touch":
        return new TouchCommand(currentFolder, commandArg);

      case "echo":
        return new EchoCommand(currentFolder, commandArg);

      case "cd":
        return new CdCommand(currentFolder, commandArg);

      // case "dryrun":
      //   handleDryRun();
      //   break;

      default:
        return null;
    }
  }
}
