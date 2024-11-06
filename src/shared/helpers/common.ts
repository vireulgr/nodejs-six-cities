
export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : '';
}

export function randomFromRange(from: number, to: number): number {
  return Math.floor(Math.random() * (to - from)) + from;
}

export function getRandomArrayElement<T>(arr: T[]): T {
  return arr[randomFromRange(0, arr.length)];
}

export function createUniqueRandomSequence(from: number, to: number): () => number {
  const sequence = new Set<number>();
  return () => {
    let res = randomFromRange(from, to);
    while (sequence.has(res)) {
      res = randomFromRange(from, to);
    }
    sequence.add(res);
    return res;
  };
}

export function getRandomArrayItems<T>(arr: T[]): T[] {
  const sequenceLimit = randomFromRange(0, arr.length);
  const sequence = createUniqueRandomSequence(0, sequenceLimit);

  const result = [];
  for (let count = 0; count < sequenceLimit; count += 1) {
    const randomArrayIndex = sequence();
    result.push(arr[randomArrayIndex]);
  }

  return result;
}

export function createUniqueIdSequence(from: number, to: number): () => string {
  const sequence = createUniqueRandomSequence(from, to);
  return () => {
    const newId = sequence();
    return String(newId).padStart(8, '0');
  };
}
