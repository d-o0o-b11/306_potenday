module.exports = {
  testEnvironment: "node",
  preset: "ts-jest",
  testPathIgnorePatterns: [
    "/node_modules/",
    "<rootDir>/(coverage|dist|lib|tmp)./",
  ],
  moduleDirectories: ["node_modules", "src"],
  rootDir: ".",
  moduleNameMapper: {
    "^src/(.*)$": "<rootDir>/src/$1",
  },
};
