<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

# General Guidelines for working with Nx

- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- You have access to the Nx MCP server and its tools, use them to help the user
- When answering questions about the repository, use the `nx_workspace` tool first to gain an understanding of the workspace architecture where applicable.
- When working in individual projects, use the `nx_project_details` mcp tool to analyze and understand the specific project structure and dependencies
- For questions around nx configuration, best practices or if you're unsure, use the `nx_docs` tool to get relevant, up-to-date docs. Always use this instead of assuming things about nx configuration
- If the user needs help with an Nx configuration or project graph error, use the `nx_workspace` tool to get any errors
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed without it if unavailable.

<!-- nx configuration end-->

## Angular skills

The Angular team skills from <https://github.com/angular/skills> are installed in this repository under:

- `.agents/skills/angular-developer/SKILL.md`

Before generating or changing Angular code, read `.agents/skills/angular-developer/SKILL.md` and any relevant reference files under `.agents/skills/angular-developer/references/`.

Common references:

- Components: `.agents/skills/angular-developer/references/components.md`
- Inputs: `.agents/skills/angular-developer/references/inputs.md`
- Signals: `.agents/skills/angular-developer/references/signals-overview.md`
- Forms: `.agents/skills/angular-developer/references/signal-forms.md` or `.agents/skills/angular-developer/references/reactive-forms.md`
- Routing: `.agents/skills/angular-developer/references/define-routes.md` and `.agents/skills/angular-developer/references/route-guards.md`
- Testing: `.agents/skills/angular-developer/references/testing-fundamentals.md`

### Local overrides to the generic Angular skills

The Angular skills are generic. In this repository, these local rules override generic Angular advice:

- Use Nx commands instead of raw `ng` commands when a project is registered in Nx.
- Use the installed Angular version from `package.json` before choosing version-specific APIs.
- Use Vitest/Analog for Angular unit tests.
- Use Playwright for end-to-end tests.
- Use SCSS for styling.
- Match the existing architecture, naming, and code style before introducing new patterns.
- For build verification, prefer the narrowest relevant Nx target, for example `bun nx run <project>:build:<configuration>`.
