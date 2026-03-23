# 00 — Git Config, Aliases & Customization

> *"A poor craftsman blames their tools. A good developer configures theirs."*

---

## Learning Objectives

- Understand Git configuration hierarchy
- Set up a clean and powerful `.gitconfig`
- Create aliases that save you time every day
- Use Git hooks to automate locally
- Have readable git logs

---

## Context — Git Configuration Hierarchy

Git reads its configuration from **three levels**, in priority order (the most local wins):

| Level | File | Scope |
|--------|---------|--------|
| `--system` | `/etc/gitconfig` | All users on the machine |
| `--global` | `~/.gitconfig` or `~/.config/git/config` | Your user account |
| `--local` | `.git/config` (inside the repo) | This repository only |

```bash
# See all active configs and their origins
git config --list --show-origin
```

---

## Exercise 00.1 — Explore Your Current Configuration

**Estimated time: 15 min**

Before making any changes, understand what's already there.

### Instructions

1. List all current configuration values with their file origins.

2. Identify which `core.editor` value is set (or not). If it's not set, what will Git fall back to?

3. Find how to display **only** a specific key value (e.g., `user.name`).

4. What's the difference between `--global` and `--local` when you use `git config`? When would you use `--local`?

### Reflection Questions

- What happens if you have `user.email = personal@gmail.com` globally and `user.email = work@company.com` locally in a work repo?
- Where would a config set with `git config user.name "test"` without a flag go?

---

## Exercise 00.2 — Configure Your Environment

**Estimated time: 20 min**

### Instructions

Configure the following (search the documentation for each key):

1. **Default editor**: Configure `core.editor` to use your preferred editor (VSCode, vim, nano...).
   - For VSCode: find how to make it wait for the file to close before continuing.

2. **Pull behavior**: Set `pull.rebase` to `true`. Why is this often recommended in a team?

3. **Line endings**:
   - On Linux/Mac: set `core.autocrlf` to `input`
   - On Windows: set `core.autocrlf` to `true`
   - Explain why this parameter exists.

4. **Default branch**: Set `init.defaultBranch` to `main`.

5. **Credentials helper**: Configure the right helper for your OS so you don't have to re-enter your password for every push.

6. **Diff and merge tools**: Configure `diff.tool` or `merge.tool` with a visual tool (e.g., `vimdiff`, `meld`, `vscode`).

### Expected Result

At the end, your `~/.gitconfig` should look like (at minimum):

```ini
[user]
    name = Your Name
    email = your@email.com

[core]
    editor = ...
    autocrlf = input

[pull]
    rebase = true

[init]
    defaultBranch = main
```

---

## Exercise 00.3 — Aliases: Build Your Toolkit

**Estimated time: 30 min**

Git aliases are defined in the `[alias]` section of `.gitconfig`. They can call Git commands or shell scripts (with the `!` prefix).

### Instructions

Implement the following aliases **and understand what each one does**:

#### Basic Aliases

```ini
[alias]
    st = status
    co = checkout
    br = branch
    ci = commit
```

#### Intermediate Aliases

Find how to implement these aliases (syntax not provided):

1. **`git unstage <file>`** — removes a file from the staging area without losing modifications.

2. **`git last`** — displays the last commit (message, author, date, short diff).

3. **`git aliases`** — lists all your defined aliases (meta-alias!).

#### Advanced Aliases — the Pretty Log

This is the Holy Grail of Git aliases. Create a `git lg` alias that displays history with:
- Short commit hash (in color)
- Branch graph (`--graph`)
- Commit message
- Author
- Relative date (e.g., "3 days ago")
- Decorated refs (branches, tags)

> Tip: Search for `git log --pretty=format` in the documentation. Format codes are documented in `man git-log`.

**Example expected output:**
```
* a1b2c3d (HEAD -> main, origin/main) feat: add user authentication - Alice (2 days ago)
* e4f5g6h fix: correct SQL injection vulnerability - Bob (3 days ago)
| * i7j8k9l (feature/payments) feat: stripe integration - Alice (1 day ago)
|/
* m1n2o3p chore: update dependencies - Bob (5 days ago)
```

#### Shell Aliases (with `!` prefix)

These aliases can call any shell command:

1. **`git whoami`** — displays the `user.name` and `user.email` configured for the current repo.

2. **`git cleanup`** — deletes all local branches that have been merged into `main` (be careful not to delete `main` itself!).

3. **`git save`** — creates a "WIP: savepoint" commit with all modified tracked files (useful for quick saves without thinking about the message).

### Bonus

Research what a **global `.gitignore`** (`core.excludesFile`) is and configure it to ignore common system files: `.DS_Store`, `*.swp`, `.idea/`, `.vscode/`, `node_modules/`, etc.

---

## Exercise 00.4 — Git Hooks (Client-Side)

**Estimated time: 25 min**

Hooks are scripts executed automatically by Git at certain points in the workflow. They're located in `.git/hooks/` of each repository.

> Note: Hooks are **not versioned** by default (`.git/` is ignored). We'll see in the CI/CD module how to manage this server-side.

### Available Hooks

```bash
ls .git/hooks/
# pre-commit, commit-msg, pre-push, post-merge, etc.
```

The `.sample` files are inactive examples. To activate a hook, remove the `.sample` extension and make the file executable (`chmod +x`).

### Instructions

#### Hook 1: `pre-commit`

Create a `pre-commit` hook that **prevents committing** if:
- A `.py` file contains `print("debug")` or `import pdb`
- A `.js` or `.ts` file contains `console.log(`

The hook should display an explanatory message and exit with the correct code.

> Tip: A `pre-commit` hook must exit with `exit 1` to block the commit, `exit 0` to allow it.

#### Hook 2: `commit-msg`

Create a `commit-msg` hook that verifies the commit message follows **Conventional Commits** format:

```
<type>(<scope>): <description>

Valid types: feat, fix, docs, style, refactor, test, chore, ci
```

Valid examples:
```
feat(auth): add JWT token validation
fix: correct memory leak in event listener
docs(readme): update installation instructions
```

Invalid examples:
```
fixed stuff
WIP
update
```

> Tip: The `commit-msg` hook receives the commit message file path in `$1`. Read this file in your script.

#### Test Your Hooks

```bash
# Test pre-commit
echo 'console.log("test")' > test.js
git add test.js
git commit -m "test"  # should be blocked

# Test commit-msg
git commit -m "bad message"  # should be blocked
git commit -m "feat: correct message"  # should pass
```

---

## Exercise 00.5 — `.gitattributes`

**Estimated time: 15 min**

The `.gitattributes` file (at repo root, versioned) lets you define behaviors for specific file types.

### Instructions

1. **Research** what `.gitattributes` does and how it differs from `.gitignore`.

2. Create a `.gitattributes` in a test repository that:
   - Forces `LF` line endings for all text files
   - Marks binary files (`.png`, `.jpg`, `.pdf`, `.zip`) as binary (Git won't try to merge them)
   - Sets a "last-write-wins" merge strategy for `package-lock.json` (a file often source of unnecessary conflicts)

3. **Bonus**: Research what a "custom merge driver" is and how `package-lock.json` can benefit from one.

---

## End-of-Module Checklist

- [ ] You can explain Git's 3 configuration levels
- [ ] Your `.gitconfig` is clean with at least 8 useful aliases
- [ ] You have a `git lg` that displays a readable colored graph
- [ ] You've implemented a working `pre-commit` hook
- [ ] You've implemented a `commit-msg` hook for Conventional Commits
- [ ] You understand why `pull.rebase = true` is often preferred

---

## Resources

- [`git help config`](https://git-scm.com/docs/git-config)
- [Conventional Commits spec](https://www.conventionalcommits.org/)
- [Git Hooks — Pro Git Book](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks)
- [`git log --pretty=format` reference](https://git-scm.com/docs/pretty-formats)
