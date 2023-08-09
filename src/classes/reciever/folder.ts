export class Folder {
  private path;
  private files: string[] = [];

  constructor(path: string) {
    this.path = path;
  }

  async mkdir(dirName: string, isDryRun: boolean): Promise<string[]> {
    try {
      const response = await fetch(
        `/api/mkdir?dirname=${encodeURIComponent(
          dirName
        )}&currentDir=${encodeURIComponent(this.path)}`,
        {
          method: "POST",
          body: JSON.stringify({
            isDryRun,
          }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        this.files = data.files;

        return [];
      } else {
        return ["usage: mkdir [-pv] [-m mode] directory_name ..."];
      }
    } catch (error) {
      return ["usage: mkdir [-pv] [-m mode] directory_name ..."];
    }
  }

  async touch(fileName: string, isDryRun: boolean): Promise<string[]> {
    try {
      const response = await fetch(
        `/api/touch?filename=${encodeURIComponent(
          fileName
        )}&currentDir=${encodeURIComponent(this.path)}`,
        {
          method: "POST",
          body: JSON.stringify({
            isDryRun,
          }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        this.files = data.files;
        return [];
      } else {
        return [
          '"usage: touch [-A [-][[hh]mm]SS] [-achm] [-r file] [-t [[CC]YY]MMDDhhmm[.SS]] [-d YYYY-MM-DDThh:mm:SS[.frac][tz]] file ..."',
        ];
      }
    } catch (error) {
      return [
        '"usage: touch [-A [-][[hh]mm]SS] [-achm] [-r file] [-t [[CC]YY]MMDDhhmm[.SS]] [-d YYYY-MM-DDThh:mm:SS[.frac][tz]] file ..."',
      ];
    }
  }

  async ls(): Promise<string[]> {
    if (this.files.length > 0) {
      return this.files;
    }

    try {
      const response = await fetch(
        `/api/getFileSystem?currentdir=${encodeURIComponent(this.path)}`
      );
      if (response.ok) {
        const data = await response.json();
        return data.files;
      } else {
        console.error("Error fetching file system information", response);
        return [];
      }
    } catch (error) {
      console.error("Error fetching file system information:", error);
      return [];
    }
  }

  async cd(target: string) {
    try {
      const response = await fetch(
        `/api/cd?dirname=${encodeURIComponent(
          target
        )}&currentdir=${encodeURIComponent(this.path)}`
      );
      if (response.ok) {
        const data = await response.json();
        return data.newDirPath;
      } else {
      }
    } catch (error) {}
  }

  getPath(): string {
    return this.path;
  }

  getFiles(): string[] {
    return this.files;
  }
}
