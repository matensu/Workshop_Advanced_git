# 01 — Branches, Merge, Rebase & Conflicts

> *"History is written by the victors. With Git, you can rewrite it too — but be careful what you do."*

---

## Learning Objectives

- Master team branching strategies
- Understand the fundamental difference between `merge` and `rebase`
- Resolve complex conflicts (not just `<<<` in a file)
- Cleanly rewrite history with interactive rebase
---

## Required Setup — Fork the Repository

This module relies on a prepared repository with **branches that have intentional conflicts** between them.

```bash
# 1. Go to the workshop repository on GitHub
# 2. Click "Fork" in the top right
# 3. Clone YOUR fork
git clone https://github.com/YOUR_USERNAME/workshop-git-github.git
cd workshop-git-github

# 4. Verify you see all remote branches
git branch -a
```

You should see these remote branches:
- `origin/main`
- `origin/fix/stylesheet`
- `origin/feature/update-title`

---

## Theoretical Context — Merge vs Rebase

### `git merge`

```
      A---B---C  feature
     /         \
D---E---F---G---H  main  (merge commit H)
```

- Creates a **merge commit** with two parents
- **Preserves the exact history** of when things happened
- Non-linear but **honest** history
- Safe for public/shared branches

### `git rebase`

```
              A'--B'--C'  feature (rebased)
             /
D---E---F---G  main
```

- **Replays** the commits from `feature` on top of `main`
- **Linear and clean** history
- Rewrites commit SHAs (`A` becomes `A'`)
- **DANGEROUS on shared branches** (never rebase a branch that others have checked out)

### The Golden Rule

> **Never rebase a public branch (already pushed and used by others).**
> Only rebase your local branches or feature branches that you alone own.

---

## Exercise 01.1 — Understand the Repository State

**Estimated time: 20 min**

### Instructions

1. Get all remote branches locally:
   ```bash
   # Find how to track a remote branch locally
   ```

2. Use your `git lg` alias (module 00) or this command to visualize **all branches**:
   ```bash
   git log --oneline --graph --all
   ```

3. Answer these questions by exploring the repo:
   - How many commits is `feature/update-title` ahead of `main`?
   - How many commits is `main` ahead of `feature/payment-system` (that `fix/spreadsheet` doesn't have)?
   - Which branch has diverged the most from `main`?

4. Find the command that shows **how many commits** branch A has ahead/behind branch B. (Hint: `git rev-list` or `git log --left-right --count`)

---
## Exercise 01.4 — Interactive Rebase: Rewriting History

Interactive rebase (`git rebase -i`) is one of Git's most powerful tools. It lets you rewrite commits **before** sharing them.

### Instructions

1. Checkout `feature/refactor-database` and look at its history:
   ```bash
   git log --oneline origin/main..HEAD
   ```
   You'll see messy commits typical of a developer who didn't think:
   ```
   abc1234 fix
   def5678 fix again
   ghi9012 WIP
   jkl3456 actually working now
   mno7890 add migration
   pqr1234 oops wrong file
   stu5678 final fix
   ```

2. Start an interactive rebase on all these commits:
   ```bash
   git rebase -i origin/main
   ```

3. **Clean up this history** to make it presentable. Goal: get **2 or 3 clean commits** with Conventional Commits messages. Use:
   - `pick`: keep as-is
   - `reword`: change the message
   - `squash` / `fixup`: merge with previous commit
   - `drop`: delete a commit

4. Verify the result:
   ```bash
   git log --oneline origin/main..HEAD
   ```

### Avoid This Pitfall

If you make a mistake during interactive rebase, **don't panic**:
```bash
git rebase --abort   # cancel everything and return to initial state
```

### Bonus — `--autosquash`

Research what `git commit --fixup` and `git commit --squash` are. How do they interact with `git rebase -i --autosquash`?
---

## Resources

- [`git help rebase`](https://git-scm.com/docs/git-rebase)
- [Merging vs Rebasing — Atlassian](https://www.atlassian.com/git/tutorials/merging-vs-rebasing)
- [Git Flow original post](https://nvie.com/posts/a-successful-git-branching-model/)
- [Trunk Based Development](https://trunkbaseddevelopment.com/)
- [Pro Git — Rewriting History](https://git-scm.com/book/en/v2/Git-Tools-Rewriting-History)
