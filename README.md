# Workshop Git & GitHub — Advanced Track

> *"Read the f***ing manual."*

Welcome to this advanced Git and GitHub workshop. The goal isn't to hold your hand — it's to confront you with real-world situations, force you to search, read the documentation, and understand **why** things work, not just **how**.

Each module is independent but concepts build on each other. Start from the beginning if you're unsure about your fundamentals.

---

## Workshop Structure

```
workshop-git-github/
├── README.md                  ← you are here
├── 00_git_config/
│   └── README.md              ← Customization, aliases, .gitconfig
├── 01_branches_conflicts/
│   └── README.md              ← Branches, merge, rebase, conflicts
└── 02_ci_cd_actions/
    └── README.md              ← GitHub Actions, CI/CD, useful workflows
```

---

## Modules

### [00 — Git Config & Alias](./00_git_config/README.md)
Before working in a team or on complex projects, your Git environment needs to be properly configured. This module covers complete customization of your Git setup: `.gitconfig`, powerful aliases, client-side hooks, and visual tools.

**What You'll Learn:**
- Git configuration files and their hierarchy
- Aliases that save you time
- Client-side Git hooks
- Pretty-printed logs and colored diffs

---

### [01 — Branches, Merge, Rebase & Conflicts](./01_branches_conflicts/README.md)
The heart of the workshop. You'll **fork an intentionally broken repository** and resolve complex conflicts, understand the difference between merge and rebase, and master Git history.

**What You'll Learn:**
- Branching strategies (Git Flow, trunk-based)
- `git merge` vs `git rebase` — when and why
- Resolving non-trivial conflicts
- `git bisect`, `git cherry-pick`, `git reflog`
- Interactive rebase for rewriting history

> Note: This module requires you to **fork the workshop repository** to access branches with prepared conflicts.

---

### [02 — CI/CD & GitHub Actions](./02_ci_cd_actions/README.md)
Automate everything that can be automated. This module guides you through building GitHub Actions workflows from scratch, covering essential marketplace actions and custom actions.

**What You'll Learn:**
- Workflow YAML anatomy
- Triggers, jobs, steps, matrix builds
- Must-have actions (`checkout`, `setup-node`, `cache`, etc.)
- Automated deployment, testing, linting
- Secrets and environment variables
- Creating your own composite actions

---

## Workshop Rules

1. **Search before asking.** Use `man git-<command>`, `git help <command>`, or the official documentation.
2. **Understand what you type.** Copy-pasting without understanding = 0 points.
3. **Commit often.** Small atomic commits are a best practice.
4. **Read error messages.** Git almost always tells you what to do.

---

## Resources

- [Pro Git Book (free)](https://git-scm.com/book/en/v2)
- [GitHub Docs](https://docs.github.com)
- [GitHub Actions Marketplace](https://github.com/marketplace?type=actions)
- [Oh Shit, Git!](https://ohshitgit.com/)
- [`git help <command>`](https://git-scm.com/docs)
