"use client";

import {
  ChangeEvent,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";

const Terminal = () => {
  const [currentDir, setCurrentDir] = useState("/");
  const [command, setCommand] = useState("");
  const [output, setOutput] = useState<string[]>([]);

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

  const handleLs = async () => {
    try {
      const response = await fetch(
        `/api/getFileSystem?currentdir=${encodeURIComponent(currentDir)}`
      );
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setOutput((output) => [...output, ...data.files]);
      } else {
        console.error("Error fetching file system information", response);
      }
    } catch (error) {
      console.error("Error fetching file system information:", error);
    }
  };

  const handleMkdir = async (dirName: string) => {
    try {
      const response = await fetch(
        `/api/mkdir?dirname=${encodeURIComponent(dirName)}`
      );
      if (response.ok) {
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
        `/api/touch?filename=${encodeURIComponent(fileName)}`
      );
      if (response.ok) {
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
      <div className="bg-black h-screen text-white overflow-auto">
        <div>
          <div className="output">
            {output.map((item, index) => (
              <div key={index}>{item}</div>
            ))}
          </div>
          <form action="/" onSubmit={onSubmit}>
            <span className="text-white">{currentDir} $ </span>
            <input
              type="text"
              className="bg-black outline-none text-white"
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
