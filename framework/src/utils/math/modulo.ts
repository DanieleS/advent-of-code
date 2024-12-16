import { multiply, sum, positiveMod } from "./algebra.js";

export class Modulo {
  constructor(public n: number, public m: number) {}
}

export function extendedEuclidean(
  a: number,
  b: number
): [number, number, number] {
  let [oldR, r] = [a, b];
  let [oldS, s] = [1, 0];
  let [oldT, t] = [0, 1];

  while (r !== 0) {
    const quotient = Math.floor(oldR / r);
    [oldR, r] = [r, oldR - quotient * r];
    [oldS, s] = [s, oldS - quotient * s];
    [oldT, t] = [t, oldT - quotient * t];
  }

  return [oldR, oldS, oldT];
}

export function chineseTheorem(...modulos: Modulo[]): Modulo {
  const product = modulos.map((modulo) => modulo.m).reduce(multiply);
  const sumResult = modulos
    .map((m) => {
      const [_, s, t] = extendedEuclidean(m.m, product / m.m);
      return m.n * t * (product / m.m);
    })
    .reduce(sum);

  return new Modulo(positiveMod(sumResult, product), product);
}
