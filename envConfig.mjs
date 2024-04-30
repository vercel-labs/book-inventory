import pkg from "@next/env";
const { loadEnvConfig } = pkg;

const projectDir = process.cwd();
loadEnvConfig(projectDir);
