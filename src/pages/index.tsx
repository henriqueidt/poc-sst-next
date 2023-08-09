"use client";

import { Terminal } from "@/classes/Terminal";
import { CdCommand } from "@/classes/commands/cdCommand";
import { EchoCommand } from "@/classes/commands/echoCommand";
import { LsCommand } from "@/classes/commands/lsCommand";
import { MkdirCommand } from "@/classes/commands/mkdirCommand";
import { TouchCommand } from "@/classes/commands/touchCommand";

import { SetStateAction, useEffect, useRef, useState } from "react";

const terminal1 = new Terminal();

const TerminalApp = () => {
  const [currentDir, setCurrentDir] = useState("/");
  const [command, setCommand] = useState("");
  const [output, setOutput] = useState<string[]>([]);
  const [isDryRun, setIsDryRun] = useState(false);

  useEffect(() => {
    async function fetchDir() {
      await terminal1.fetchCurrentDir();
      setCurrentDir(terminal1.getCurrentDir());
    }
    fetchDir();
  }, []);

  useEffect(() => {
    window.scrollTo({
      top: document.body.scrollHeight,
    });
  }, [output]);

  const handleLs = async () => {
    const lsCommand = new LsCommand(terminal1.getCurrentFolder());
    const commandId = terminal1.addCommand(lsCommand);
    const output = await terminal1.executeCommand(commandId);
    setOutput(output);
  };

  const handleMkdir = async (dirName: string) => {
    const mkdirCommand = new MkdirCommand(
      terminal1.getCurrentFolder(),
      dirName
    );

    const commandId = terminal1.addCommand(mkdirCommand);
    const output = await terminal1.executeCommand(commandId);
    setOutput(output);
  };

  const handleTouch = async (fileName: string) => {
    const touchCommand = new TouchCommand(
      terminal1.getCurrentFolder(),
      fileName
    );

    const commandId = terminal1.addCommand(touchCommand);
    const output = await terminal1.executeCommand(commandId);
    setOutput(output);
  };

  const handleEcho = async (text: string) => {
    const echoCommand = new EchoCommand(terminal1.getCurrentFolder(), text);

    const commandId = terminal1.addCommand(echoCommand);
    const output = await terminal1.executeCommand(commandId);
    setOutput(output);
  };

  const handleCD = async (dirname: string) => {
    const cdCommand = new CdCommand(terminal1.getCurrentFolder(), dirname);

    const commandId = terminal1.addCommand(cdCommand);
    const output = await terminal1.executeCommand(commandId);

    terminal1.setCurrentDir(cdCommand.getNewPath());
    setCurrentDir(cdCommand.getNewPath());
    setOutput(output);
  };

  const handleDryRun = async () => {
    const output = await terminal1.toggleDryRun();
    setOutput(output);
  };

  const handleCommand = (commandText: string) => {
    const splittedCommand = commandText.trim().split(" ");
    const commandValue = splittedCommand[0];
    const commandArg = splittedCommand[1];

    switch (commandValue) {
      case "ls":
        handleLs();
        break;

      case "mkdir":
        handleMkdir(commandArg);
        break;

      case "touch":
        handleTouch(commandArg);
        break;

      case "echo":
        handleEcho(splittedCommand.slice(1).join(" "));
        break;

      case "cd":
        handleCD(commandArg);
        break;

      case "dryrun":
        handleDryRun();
        break;

      default:
        setOutput((output) => [
          ...output,
          `Command not found: ${commandValue}`,
        ]);
    }
  };

  const onSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    handleCommand(command);
    setCommand("");
  };

  const onInput = (event: { target: { value: SetStateAction<string> } }) => {
    setCommand(event.target.value);
  };

  return (
    <main>
      <div className="bg-black text-white">
        <div>
          <div className="output">
            {output.map((item, index) => (
              <div key={index}>{item}</div>
            ))}
          </div>
          <form action="/" onSubmit={onSubmit} className="flex">
            <span className="text-white">{currentDir} $</span>
            <input
              type="text"
              className="bg-black outline-none text-white flex-1 ml-1"
              onChange={onInput}
              value={command}
            />
          </form>
        </div>
      </div>
    </main>
  );
};

export default TerminalApp;
