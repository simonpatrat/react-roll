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
        // eslint-disable-next-line no-param-reassign
        acc = acc[v];
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error("ERROR getting value", e);
        return defaultValue;
      }
      return acc;
    }, value);
};
