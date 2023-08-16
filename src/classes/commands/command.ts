export class Command {
  private output: string[] = [];

  execute(isDryRun: boolean): any {}

  getOutput(): string[] {
    return this.output;
  }

  setOutput(value: string[]): void {
    this.output = value;
  }

  toString() {
    return this.output.toString();
  }
}
