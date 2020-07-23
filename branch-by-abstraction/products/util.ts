const Min = 500;
const Max = 2000;

export function sleep() {
  return new Promise((resolve) =>
    setTimeout(resolve, Math.floor(Math.random() * Max) + Min)
  );
}
