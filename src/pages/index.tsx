"use client";

import { Terminal } from "@/classes/Terminal";
import { CommandFactory } from "@/classes/commands/commandFactory";

import { SetStateAction, useEffect, useRef, useState } from "react";

const terminal1 = new Terminal();
const commandFactory = new CommandFactory();

const TerminalApp = () => {
  const [currentDir, setCurrentDir] = useState("/");
  const [command, setCommand] = useState("");
  const [output, setOutput] = useState<string[]>([]);

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

  const handleDryRun = async () => {
    const output = await terminal1.toggleDryRun();
    setOutput(output);
  };

  const handleCommand = async (commandText: string) => {
    if (commandText === "dryrun") {
      handleDryRun();
    }
    const folder = terminal1.getCurrentFolder();

    const command = commandFactory.getCommand(folder, commandText);
    if (!command) {
      setOutput((output) => [...output, `Command not found`]);
      return;
    }
    const commandId = terminal1.addCommand(command);
    const { output, currentFolder } = await terminal1.executeCommand(commandId);
    if (currentFolder) {
      setCurrentDir(currentFolder);
    }
    setOutput(output);
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
