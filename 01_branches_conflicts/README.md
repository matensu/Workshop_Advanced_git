# 01 — Branches, Merge, Rebase & Conflicts

> *"History is written by the victors. With Git, you can rewrite it too — but be careful what you do."*

---

## Learning Objectives

- Master team branching strategies
- Understand the fundamental difference between `merge` and `rebase`
- Resolve complex conflicts (not just `<<<` in a file)
- Cleanly rewrite history with interactive rebase
- Use `bisect`, `cherry-pick`, and `reflog` like a pro

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
- `origin/feature/user-auth`
- `origin/feature/payment-system`
- `origin/feature/refactor-database`
- `origin/hotfix/security-patch`
- `origin/legacy/old-api`

> Note: **For instructors**: see [`INSTRUCTOR_SETUP.md`](./INSTRUCTOR_SETUP.md) for how to create these branches in the source repository.

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
   - How many commits is `feature/user-auth` ahead of `main`?
   - How many commits is `main` ahead of `feature/payment-system` (that `feature/payment-system` doesn't have)?
   - Which branch has diverged the most from `main`?

4. Find the command that shows **how many commits** branch A has ahead/behind branch B. (Hint: `git rev-list` or `git log --left-right --count`)

---

## Exercise 01.2 — Standard Merge and Fast-Forward

**Estimated time: 20 min**

### Instructions

1. Create a local branch `integration/step1` from `main`.

2. Merge `feature/user-auth` into `integration/step1` with a **merge commit** (no fast-forward):
   ```bash
   # Find the option that forces a merge commit even if fast-forward is possible
   git merge --??? feature/user-auth
   ```

3. Now create `integration/step1-ff` from `main` and merge the same branch **with** fast-forward if possible. What's the difference in history?

4. **Question**: When does Git do a fast-forward automatically? When is it impossible?

5. Research what a **merge strategy** (`-s` / `--strategy`) is. When would you use `ours` or `recursive`?

---

## Exercise 01.3 — Conflict Resolution: Round 1

**Estimated time: 35 min**

The `feature/user-auth` and `feature/payment-system` branches both modified the same files. This is intentional.

### Instructions

1. From `main`, create a branch `integration/merge-test`.

2. Merge `feature/user-auth` (should go smoothly or with minor conflicts).

3. Try to merge `feature/payment-system`. Git will complain.

4. **Resolve the conflicts**:
   - Open the conflicted files. Understand the **3 sections**: `<<<<<<<`, `=======`, `>>>>>>>`.
   - Decide which version to keep (or intelligently combine both).
   - Remove **all conflict markers** from the final file.
   - Mark the conflict as resolved and finish the merge.

5. **Alternative method**: abort everything (`git merge --abort`) and try again using `git mergetool`. Configure a merge tool first (see module 00).

### Questions

- What does `git checkout --ours <file>` do during a conflict?
- What does `git checkout --theirs <file>` do?
- When would you use one over the other?

---

## Exercise 01.4 — Interactive Rebase: Rewriting History

**Estimated time: 40 min**

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

## Exercise 01.5 — Branch Rebase

**Estimated time: 30 min**

### Scenario

The `feature/payment-system` branch was created long ago from an old `main` commit. Meanwhile, `main` has advanced with important commits. You want to **update** the base of `feature/payment-system` without polluting its history with a merge commit.

### Instructions

1. Create a backup:
   ```bash
   git checkout feature/payment-system
   git checkout -b feature/payment-system-backup
   git checkout feature/payment-system
   ```

2. Rebase `feature/payment-system` onto `main`:
   ```bash
   git rebase main
   ```

3. You'll likely have conflicts. **Resolve them one by one.** After each resolution:
   ```bash
   git add <resolved-files>
   git rebase --continue
   ```

4. Compare the history before/after between your backup branch and the rebased one.

5. **Critical question**: why **shouldn't** you `git push` after this rebase if `feature/payment-system` was already on the remote and shared with colleagues?

---

## Exercise 01.6 — `git cherry-pick`

**Estimated time: 20 min**

### Scenario

The `hotfix/security-patch` branch contains a critical security fix. This fix needs to be applied to `main` **immediately**, without merging the entire branch.

### Instructions

1. Look at the commits in `hotfix/security-patch`:
   ```bash
   git log --oneline main..hotfix/security-patch
   ```

2. Identify which commit(s) contain the security fix (read the messages).

3. Apply **only** this/these commit(s) to `main` with `cherry-pick`.

4. **Question**: What does the `--no-commit` (`-n`) option do in `cherry-pick`? When would you use it?

5. **Bonus**: How do you cherry-pick a **range of commits** (e.g., from commit A to commit B)?

---

## Exercise 01.7 — `git bisect`: Finding the Bug

**Estimated time: 30 min**

### Scenario

The `legacy/old-api` branch contains a regression: a function that worked broke at some unknown point in the history. You need to find **which commit introduced the bug**.

### Instructions

1. Checkout `legacy/old-api`.

2. Look at the history: there are many commits. Manual searching would take too long.

3. Start `git bisect`:
   ```bash
   git bisect start
   git bisect bad          # current commit is bad
   git bisect good <SHA>   # give an old SHA where it worked
   ```

4. For each commit Git presents, test whether the bug is there:
   ```bash
   git bisect good   # if this commit doesn't have the bug
   git bisect bad    # if this commit has the bug
   ```

5. Git will find the first bad commit through binary search. Note its SHA and message.

6. Properly exit bisect:
   ```bash
   git bisect reset
   ```

7. **Bonus — automated bisect**: If you have a test script, research how to use `git bisect run <script>` to automate the search completely.

---

## Exercise 01.8 — `git reflog`: The Time Machine

**Estimated time: 20 min**

### Context

The `reflog` is a local journal of **all** HEAD movements. It's your ultimate safety net.

### Instructions

#### Simulated Disaster Scenario

1. Create an `experiment` branch from `main`, make 3 commits.
2. From `main`, do `git branch -D experiment` (forced delete).
3. "Oh no, I lost my commits!"

#### Recovery

4. Use `git reflog` to find the SHA of the last `experiment` commit.
5. Recover the branch:
   ```bash
   git checkout -b experiment-recovered <SHA>
   ```

#### Another Scenario

6. Do `git reset --hard HEAD~3` on a branch to "lose" 3 commits.
7. Use reflog to recover them.

### Questions

- How long does Git keep data in reflog? (search `gc.reflogExpire`)
- What's the difference between `git reset --hard`, `--soft`, and `--mixed`?

---

## Exercise 01.9 — Team Branching Strategies

**Estimated time: 20 min (research + reflection)**

No code for this exercise — just research and reflection.

### Instructions

Research and compare these two strategies:

1. **Git Flow** (Vincent Driessen, 2010)
   - Main branches: `main`, `develop`
   - Support branches: `feature/*`, `release/*`, `hotfix/*`
   - Versioning scheme

2. **Trunk-Based Development**
   - Single main branch
   - Feature flags
   - Continuous integration

For each strategy, answer:
- What type of project/team is it suited for?
- What are its advantages and disadvantages?
- How does it handle production hotfixes?

### Bonus — GitHub Flow

Research what **GitHub Flow** (different from Git Flow) is and why it's often preferred for open source projects and teams that deploy frequently.

---

## End-of-Module Checklist

- [ ] You can explain the difference between merge and rebase to someone unfamiliar with Git
- [ ] You've resolved conflicts without blindly using `--ours` or `--theirs`
- [ ] You've used `rebase -i` to clean up history
- [ ] You've recovered a "lost" branch with `reflog`
- [ ] You've used `bisect` to find a guilty commit
- [ ] You understand the golden rule of rebase

---

## Resources

- [`git help rebase`](https://git-scm.com/docs/git-rebase)
- [Merging vs Rebasing — Atlassian](https://www.atlassian.com/git/tutorials/merging-vs-rebasing)
- [Git Flow original post](https://nvie.com/posts/a-successful-git-branching-model/)
- [Trunk Based Development](https://trunkbaseddevelopment.com/)
- [Pro Git — Rewriting History](https://git-scm.com/book/en/v2/Git-Tools-Rewriting-History)
