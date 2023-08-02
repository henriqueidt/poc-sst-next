"use client";

import { SetStateAction, useEffect, useRef, useState } from "react";

const Terminal = () => {
  const [currentDir, setCurrentDir] = useState("/");
  const [command, setCommand] = useState("");
  const [output, setOutput] = useState<string[]>([]);
  const [isDryRun, setIsDryRun] = useState(false);
  const [fileStructure, setFileStructure] = useState({});
  const [dryRunCommands, setDryRunCommands] = useState<string[]>([]);

  useEffect(() => {
    async function fetchCurrentDir() {
      try {
        const response = await fetch("/api/getCurrentDir");
        if (response.ok) {
          const data = await response.json();
          setCurrentDir(data.currentDir);
        } else {
          console.error("Error fetching file system information", response);
        }
      } catch (error) {
        console.error("Error fetching file system information:", error);
      }
    }
    fetchCurrentDir();
  }, []);

  useEffect(() => {
    window.scrollTo({
      top: document.body.scrollHeight,
    });
  }, [output]);

  const handleLs = async (addToOutput = true) => {
    if (isDryRun && fileStructure[currentDir]) {
      console.log(fileStructure[currentDir]);
      setOutput((output) => [...output, ...fileStructure[currentDir]]);
      return;
    }
    try {
      const response = await fetch(
        `/api/getFileSystem?currentdir=${encodeURIComponent(currentDir)}`
      );
      if (response.ok) {
        const data = await response.json();
        if (addToOutput) {
          setOutput((output) => [...output, ...data.files]);
        }
        return data.files;
      } else {
        console.error("Error fetching file system information", response);
        return [];
      }
    } catch (error) {
      console.error("Error fetching file system information:", error);
      return [];
    }
  };

  const handleMkdir = async (dirName: string) => {
    try {
      const response = await fetch(
        `/api/mkdir?dirname=${encodeURIComponent(
          dirName
        )}&currentDir=${encodeURIComponent(currentDir)}`,
        {
          method: "POST",
          body: JSON.stringify({
            isDryRun,
          }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        console.log(data.files);
        setFileStructure((files) => ({
          ...files,
          [currentDir]: fileStructure[currentDir]
            ? new Set([...fileStructure[currentDir], ...data.files])
            : data.files,
        }));

        return;
      } else {
        setOutput((output) => [
          ...output,
          "usage: mkdir [-pv] [-m mode] directory_name ...",
        ]);
      }
    } catch (error) {
      setOutput((output) => [
        ...output,
        "usage: mkdir [-pv] [-m mode] directory_name ...",
      ]);
    }
  };

  const handleTouch = async (fileName: string) => {
    try {
      const response = await fetch(
        `/api/touch?filename=${encodeURIComponent(
          fileName
        )}&currentDir=${encodeURIComponent(currentDir)}`,
        {
          method: "POST",
          body: JSON.stringify({
            isDryRun,
          }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        setFileStructure((files) => ({
          ...files,
          [currentDir]: fileStructure[currentDir]
            ? new Set([...fileStructure[currentDir], ...data.files])
            : data.files,
        }));
        return;
      } else {
        setOutput((output) => [
          ...output,
          "usage: touch [-A [-][[hh]mm]SS] [-achm] [-r file] [-t [[CC]YY]MMDDhhmm[.SS]] [-d YYYY-MM-DDThh:mm:SS[.frac][tz]] file ...",
        ]);
      }
    } catch (error) {
      setOutput((output) => [
        ...output,
        "usage: touch [-A [-][[hh]mm]SS] [-achm] [-r file] [-t [[CC]YY]MMDDhhmm[.SS]] [-d YYYY-MM-DDThh:mm:SS[.frac][tz]] file ...",
      ]);
    }
  };

  const handleEcho = (text: string) => {
    setOutput((output) => [...output, text]);
  };

  const handleCD = async (dirname: string) => {
    try {
      const response = await fetch(
        `/api/cd?dirname=${encodeURIComponent(
          dirname
        )}&currentdir=${encodeURIComponent(currentDir)}`
      );
      if (response.ok) {
        const data = await response.json();
        setCurrentDir(data.newDirPath);
      } else {
        setOutput((output) => [
          ...output,
          `cd: no such file or directory: ${dirname}`,
        ]);
      }
    } catch (error) {
      setOutput((output) => [
        ...output,
        `cd: no such file or directory: ${dirname}`,
      ]);
    }
  };

  const toggleDryRunMode = async () => {
    if (isDryRun) {
      setIsDryRun(false);
      setFileStructure({});
      setIsDryRun(false);
      setOutput((output) => [...output, "EXITING DRYRUN"]);
      return;
    }
    setIsDryRun(true);
    const files = await handleLs(false);
    setFileStructure((currentfiles) => ({
      ...currentfiles,
      [currentDir]: files,
    }));
    setOutput((output) => [...output, "ENTERING DRYRUN"]);
  };

  const handleCommand = (commandText: string) => {
    const splittedCommand = commandText.trim().split(" ");
    const commandValue = splittedCommand[0];
    const commandArg = splittedCommand[1];

    setOutput((output) => [
      ...output,
      "--------------------------------------------------------------------------------",
      `${currentDir} $ ${commandText}`,
    ]);

    if (commandText === "dryrun") {
      toggleDryRunMode();
      return;
    }
    if (isDryRun) {
      setDryRunCommands((commands) => [...commands, commandText]);
    }

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

export default Terminal;
