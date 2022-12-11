import { ExecutionResult } from "../types/executionResult";
import { loadInputFile, memoized } from "../utils";

type Operator = "+" | "*";
type Old = {
  readonly _old: unique symbol;
};

type ExpressionItem = Old | number;
type Expression = {
  operator: Operator;
  left: ExpressionItem;
  right: ExpressionItem;
};

type Test = {
  divisibleBy: number;
  ifTrueThrowTo: number;
  ifFalseThrowTo: number;
};

type Monkey = {
  items: number[];
  operation: Expression;
  test: Test;
};

type InspectorMonkey = Monkey & {
  inspected: number;
};

const old = {} as Old;

function parseStartingItems(startingItemsRow: string): number[] {
  const itemsRegex = /Starting items: (.*)$/;
  const [, items] = itemsRegex.exec(startingItemsRow)!;

  return items.split(",").map((i) => parseInt(i.trim()));
}

function parseOperation(operationRow: string): Expression {
  const operationRegex = /Operation: new = old (\+|\*) (\d+|old)$/;
  const [, operator, operand] = operationRegex.exec(operationRow)!;

  return {
    left: old,
    operator: operator as Operator,
    right: operand === "old" ? old : parseInt(operand),
  };
}

function parseTest(
  divisibleByRow: string,
  ifTrueRow: string,
  ifFalseRow: string
): Test {
  const divisibleRegex = /divisible by (\d+)$/;
  const throwToMonkey = /throw to monkey (\d+)$/;

  const [, divisibleBy] = divisibleRegex.exec(divisibleByRow)!;
  const [, throwIfTrue] = throwToMonkey.exec(ifTrueRow)!;
  const [, throwIfFalse] = throwToMonkey.exec(ifFalseRow)!;

  return {
    divisibleBy: parseInt(divisibleBy),
    ifTrueThrowTo: parseInt(throwIfTrue),
    ifFalseThrowTo: parseInt(throwIfFalse),
  };
}

function parseInput(input: string[]): Monkey[] {
  const monkeys: Monkey[] = [];
  for (let i = 0; i < input.length; i += 7) {
    const items = parseStartingItems(input[i + 1]);
    const operation = parseOperation(input[i + 2]);
    const test = parseTest(input[i + 3], input[i + 4], input[i + 5]);

    monkeys.push({
      items,
      operation,
      test,
    });
  }

  return monkeys;
}

function executeExpression(expression: Expression, oldValue: number): number {
  const getOperand = (value: ExpressionItem): number =>
    typeof value === "object" ? oldValue : value;

  switch (expression.operator) {
    case "+":
      return getOperand(expression.left) + getOperand(expression.right);
    case "*":
      return getOperand(expression.left) * getOperand(expression.right);
  }
}

function solvePuzzle1(input: string[]): number {
  const monkeys: InspectorMonkey[] = parseInput(input).map((monkey) => ({
    ...monkey,
    inspected: 0,
  }));

  const bigModule = monkeys.reduce((acc, m) => acc * m.test.divisibleBy, 1);

  for (let round = 0; round < 20; round++) {
    for (const monkey of monkeys) {
      while (monkey.items.length) {
        monkey.inspected++;
        const item = monkey.items.shift()!;
        const newItemValue =
          Math.floor(executeExpression(monkey.operation, item) / 3) % bigModule;
        if (newItemValue % monkey.test.divisibleBy === 0) {
          monkeys[monkey.test.ifTrueThrowTo].items.push(newItemValue);
        } else {
          monkeys[monkey.test.ifFalseThrowTo].items.push(newItemValue);
        }
      }
    }
  }

  monkeys.sort((m1, m2) => m2.inspected - m1.inspected);
  return monkeys[0].inspected * monkeys[1].inspected;
}

function solvePuzzle2(input: string[]): number {
  const monkeys: InspectorMonkey[] = parseInput(input).map((monkey) => ({
    ...monkey,
    inspected: 0,
  }));

  const bigModule = monkeys.reduce((acc, m) => acc * m.test.divisibleBy, 1);

  for (let round = 0; round < 10000; round++) {
    for (const monkey of monkeys) {
      while (monkey.items.length) {
        monkey.inspected++;
        const item = monkey.items.shift()!;
        const newItemValue =
          Math.floor(executeExpression(monkey.operation, item)) % bigModule;
        if (newItemValue % monkey.test.divisibleBy === 0) {
          monkeys[monkey.test.ifTrueThrowTo].items.push(newItemValue);
        } else {
          monkeys[monkey.test.ifFalseThrowTo].items.push(newItemValue);
        }
      }
    }
  }

  monkeys.sort((m1, m2) => m2.inspected - m1.inspected);
  return monkeys[0].inspected * monkeys[1].inspected;
}

export async function day11(): Promise<ExecutionResult> {
  const input = await loadInputFile(11);

  const puzzle1 = solvePuzzle1(input);
  const puzzle2 = solvePuzzle2(input);

  return {
    day: 11,
    puzzle1,
    puzzle2,
  };
}
