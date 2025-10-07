export const colors = {
  first: "#0f4e2b",
  second: "#00893a",
  third: "#c7d300",
  fourth: "#66b336",
  fifth: "#b2d7af",
  sixth: "#fbb81c",
  seventh: "#ffdd00",
  eighth: "#838283",
  ninth: "#D5A058",
  tenth: "#F0F2E2",
  eleventh: "#BF9D85",
  twelfth: "#C1D0AE",
  thirteenth: "#F0F2E2",
  white: "#fff",
  black: "#616160",
} as const;

export type ColorKeys = keyof typeof colors;
