const defaultThemes = require("tailwindcss/defaultTheme");
const spacing = {
  0: "0",
  1: "1px",
  2: "0.125rem",
  4: "0.25rem",
  6: "0.375rem",
  8: "0.5rem",
  10: "0.625rem",
  12: "0.75rem",
  14: "0.875rem",
  16: "1rem",
  20: "1.25rem",
  24: "1.5rem",
  28: "1.75rem",
  32: "2rem",
  36: "2.25rem",
  40: "2.5rem",
  44: "2.75rem",
  48: "3rem",

  52: "3rem",
  56: "3.5rem",
  60: "4rem",
  64: "5rem",
  72: "6rem",
  80: "7rem",
  96: "8rem",

  3: "0.1875rem",
  7: "0.4375rem",
  9: "0.5625rem",
  ...defaultThemes.spacing,
};

module.exports = {
  spacing,
};
