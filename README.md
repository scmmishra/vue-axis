# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).

## ESLint Configuration and Usage

This project uses ESLint to ensure code quality and consistency. Below are the steps to configure and use ESLint in this project.

### ESLint Configuration

1. ESLint configuration file `.eslintrc.json` is added to the repository.
2. ESLint recommendations are added to the `.vscode/extensions.json` file.
3. ESLint configuration is added to the `packages/axis/package.json` file.

### Running ESLint

To run ESLint, use the following commands:

- `npm run lint`: This command will run ESLint and check for any linting errors.
- `npm run lint:fix`: This command will run ESLint and automatically fix any fixable linting errors.

### GitHub Actions

A GitHub Action is set up to run ESLint on every pull request and commit to the main branch. This ensures that the codebase remains clean and consistent.
