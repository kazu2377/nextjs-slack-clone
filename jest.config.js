module.exports = {
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "\\.(css|scss)$": "identity-obj-proxy",
    "^lib/(.*)$": "<rootDir>/lib/$1",
    "^components/(.*)$": "<rootDir>/components/$1",
    "^pages/(.*)$": "<rootDir>/pages/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
};
