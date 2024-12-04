export type PuzzleSolver = (input: string[]) => Promise<ExecutionResult>;

export interface ExecutionResult {
  puzzle1: number | string;
  puzzle2?: number | string;
}
