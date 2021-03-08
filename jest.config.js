module.exports = {
  preset: "@vue/cli-plugin-unit-jest/presets/typescript-and-babel",
  setupFiles: ["jest-canvas-mock"],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/packages/$1'
  },
  globals: {
    'ts-jest': {
      diagnostics: {
        ignoreCodes: [151001],
      },
    },
  },
  transform: {
    "^.+\\.vue$": "vue-jest"
  }
};
