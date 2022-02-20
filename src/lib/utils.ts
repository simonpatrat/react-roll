type InputType = string | boolean;

export const cls = (input: InputType[]): string => {
  if (typeof input === "string") {
    return input;
  }

  return input
    .filter((cond: string | boolean) => typeof cond === "string")
    .join(" ");
};

// TODO: better typing for `get` function parameters
// TODO: unit tests
export const get = (value: any, path: string, defaultValue: any) => {
  return String(path)
    .split(".")
    .reduce((acc, v) => {
      try {
        acc = acc[v];
      } catch (e) {
        console.log("ERROR", e);
        return defaultValue;
      }
      return acc;
    }, value);
};
