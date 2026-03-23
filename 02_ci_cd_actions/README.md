# 02 — CI/CD & GitHub Actions

> *"If you do it more than twice by hand, automate it."*

---

## Learning Objectives

- Understand CI/CD principles and why they're essential in production
- Master GitHub Actions workflow YAML syntax
- Use essential marketplace actions
- Implement test, lint, build, and deployment pipelines
- Manage secrets and environment variables safely
- Create your own reusable composite actions

---

## Context — CI/CD in a Nutshell

**CI (Continuous Integration)**: Every push automatically triggers tests, linting, and builds. Problems are caught early.

**CD (Continuous Delivery/Deployment)**: Validated code is automatically delivered (delivery = ready to deploy, deployment = automatically deployed).

```
Push/PR → Tests → Lint → Build → [Deploy staging] → [Deploy prod]
```

GitHub Actions is GitHub's integrated CI/CD tool. Workflows are YAML files in `.github/workflows/`.

---

## Workflow Anatomy

```yaml
# .github/workflows/ci.yml
name: CI Pipeline          # Name displayed on GitHub

on:                        # Triggers — when this workflow starts
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:                      # Set of jobs (run in parallel by default)
  test:                    # Job name
    runs-on: ubuntu-latest # Runner (OS)
    
    steps:                 # Sequential steps in the job
      - name: Checkout code
        uses: actions/checkout@v4      # Marketplace action
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:                          # Action parameters
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci                    # Direct shell command
      
      - name: Run tests
        run: npm test
```

---

## Exercise 02.1 — First Workflow: Hello Actions

### Instructions

1. In **your fork** of the workshop, create the `.github/workflows/` folder.

2. Create a `hello.yml` file with a workflow that:
   - Triggers on **push** to any branch
   - Has a `greet` job running on `ubuntu-latest`
   - Displays "Hello, GitHub Actions!" in the logs
   - Displays the branch name where the push occurred
   - Displays the commit SHA

> Tip: Search for **GitHub Actions context variables** (`github.ref`, `github.sha`, etc.) in the documentation.

3. Push and go to the **Actions** tab of your repo to see the workflow execute.

### Questions

- What's the difference between `run` and `uses` in a step?
- What is a **runner**? Which runners are available for free on GitHub?
- What happens if a `run` step returns a non-zero exit code?

---

## Exercise 02.2 — Triggers in Detail

### Instructions

Create a `triggers-demo.yml` file with **4 jobs**, each triggered by a different trigger:

1. **`on: push`** to `main` branch only — job that displays "Pushed to main"

2. **`on: pull_request`** — job that displays the PR title and author
   > Tip: Search for `github.event.pull_request.title` and `github.event.pull_request.user.login`

3. **`on: schedule`** — cron job that runs daily at 8am UTC
   > Tip: Search for cron syntax in GitHub Actions documentation

4. **`on: workflow_dispatch`** — manual trigger with **an input parameter** `environment` (possible values: `staging`, `production`)
   > Tip: Search for `workflow_dispatch: inputs`

### Bonus

Research what `on: workflow_call` is and how it differs from `workflow_dispatch`. This is the basis of **reusable workflows**.

---

## Exercise 02.3 — Complete CI Pipeline (Node.js)

This is the heart of this module. You'll build a real CI pipeline.

### Setup

The repository contains a mini Node.js project in `app/`. It has tests, a linter, and a build script.

```bash
cd app/
npm install
npm test      # should pass
npm run lint  # should pass
npm run build # should create a dist/ folder
```

### Instructions

Create `.github/workflows/ci.yml` with the following jobs:

#### Job 1: `lint`

- Install dependencies
- Run ESLint
- Run Prettier in check mode (no modifications, just verification)

#### Job 2: `test`

- Depends on the `lint` job (search for `needs:`)
- Run tests
- Generate code coverage report
- **Upload the coverage report** as a workflow artifact
  > Tip: Search for `actions/upload-artifact@v4` action

#### Job 3: `build`

- Depends on the `test` job
- Build the application
- Upload the `dist/` folder as an artifact

#### Job 4: `matrix-test`

Run tests on **multiple Node versions** in parallel:
- Node 18, 20, 22
- On both Ubuntu and macOS
  > Tip: Search for `strategy: matrix:` in the documentation

### Required Optimization

- Cache the `node_modules` folder (or npm cache) to speed up subsequent runs
  > Tip: Search for `actions/cache@v4` action or the `cache:` option in `setup-node`

### Questions

- What happens if the `lint` job fails? Do other jobs run?
- What's the difference between `needs: [lint]` and `needs: lint`?
- How many parallel jobs does the matrix generate in your config?

---

## Exercise 02.4 — Secrets & Environment Variables

### Context

Never put secrets (tokens, passwords, API keys) in code or workflows in plain text. GitHub Actions has an encrypted secrets system.

### Instructions

1. In your fork's **Settings**, go to `Secrets and variables > Actions` and create these secrets:
   - `API_KEY` = `super-secret-api-key-do-not-share`
   - `DATABASE_URL` = `postgres://user:password@localhost:5432/mydb`

2. Also create **variables** (not secrets, for non-sensitive values):
   - `APP_ENV` = `staging`
   - `APP_VERSION` = `1.0.0`

3. Create a `secrets-demo.yml` workflow that:
   - Displays the value of `APP_ENV` and `APP_VERSION` (variables — OK to log)
   - Uses `API_KEY` in a command **without** displaying it (observe how GitHub automatically masks it)
   - Tries to display `API_KEY` directly in an `echo` — note what appears in the logs

4. **Security question**: Research what **GITHUB_TOKEN permissions** are and how to restrict them to the minimum necessary (`permissions:` at the job or workflow level).

### Bonus — Environments

Research what **GitHub Environments** are (not environment variables). How do they allow deployment control with mandatory reviewers?

---

## Exercise 02.5 — Essential Marketplace Actions

Here are the most used actions. For each one, **create a demo workflow** and test it.

### Actions to Explore

#### `actions/checkout@v4`
- Almost mandatory action in every workflow
- Search for the `fetch-depth` option — what does `fetch-depth: 0` do? Why use it?
- Find how to checkout a **specific PR** or **specific tag**

#### `actions/setup-node@v4` / `actions/setup-python@v5`
- Configures the runtime
- Find how to enable automatic npm/pip caching with this action

#### `actions/upload-artifact@v4` & `actions/download-artifact@v4`
- Pass files between jobs
- Create a workflow with 2 jobs: job A generates a file, job B downloads and uses it

#### `github/codeql-action`
- Static code security analysis
- Find how to integrate it and which languages are supported

#### `actions/stale`
- Automatically marks old issues and PRs as "stale"
- Configure it to close after 30 days of inactivity with a custom message

#### A deployment action (your choice)
Search and implement **one** of these actions:
- `aws-actions/configure-aws-credentials` → S3 deployment
- `azure/webapps-deploy` → Azure App Service
- `appleboy/ssh-action` → SSH deployment
- `peaceiris/actions-gh-pages` → GitHub Pages

---

## Exercise 02.6 — Automated PR Workflow

### Instructions

Create a `pr-checks.yml` workflow that triggers on `pull_request` and:

1. **Verifies the PR title**: must follow Conventional Commits format.
   > Tip: Search for `amannn/action-semantic-pull-request`

2. **Automatically comments** on the PR with test results (pass/fail + test count).
   > Tip: Search for `actions/github-script` to use GitHub API from a workflow.

3. **Automatically adds a label** based on change type:
   - Files in `src/` modified → `code` label
   - `.md` files modified → `documentation` label
   - Files in `.github/` modified → `ci` label
   > Tip: Search for `actions/labeler`

4. **Blocks merging** if tests fail (without extra config, a failed job already blocks the PR — but research how to configure **branch protection rules** in GitHub to make it mandatory).

---

## Exercise 02.7 — Create Your Own Composite Action

A composite action groups multiple steps into a reusable action, like a function.

### Scenario

You repeat these same 3 steps in multiple workflows:
1. Checkout code
2. Install Node with cache
3. Install dependencies with `npm ci`

Instead of copy-pasting these steps everywhere, you'll create a composite action.

### Instructions

1. Create the `.github/actions/setup-node-project/` folder

2. Create `action.yml` in this folder:
   ```yaml
   name: 'Setup Node Project'
   description: 'Checkout, setup Node with cache, and install dependencies'
   inputs:
     node-version:
       description: 'Node.js version to use'
       required: false
       default: '20'
   outputs:
     cache-hit:
       description: 'Whether the npm cache was hit'
       value: ${{ steps.cache.outputs.cache-hit }}
   runs:
     using: 'composite'
     steps:
       # Complete the steps here
   ```

3. Use this action in a workflow:
   ```yaml
   steps:
     - uses: ./.github/actions/setup-node-project
       with:
         node-version: '20'
   ```

4. Verify it works exactly as before but in a single line.

### Bonus — JavaScript Action

Research the difference between a **composite action** and a **JavaScript action**. When would you use one over the other?

---

## Exercise 02.8 — Deployment with Environments and Gates

### Scenario

You want a deployment pipeline that:
1. Automatically deploys to `staging` when `main` is updated
2. Deploys to `production` only after manual approval

### Instructions

1. In your repo's **Settings**, create two **Environments**:
   - `staging`: no protection
   - `production`: protection enabled, reviewers required (add yourself as reviewer)

2. Create `.github/workflows/deploy.yml`:
   ```yaml
   name: Deploy
   
   on:
     push:
       branches: [main]
   
   jobs:
     deploy-staging:
       runs-on: ubuntu-latest
       environment: staging
       steps:
         - run: echo "Deploying to staging..."
         # Simulate a deployment
         - run: echo "Deploy URL: https://staging.myapp.com"
   
     deploy-production:
       runs-on: ubuntu-latest
       environment: production
       needs: deploy-staging
       steps:
         - run: echo "Deploying to production..."
         - run: echo "Deploy URL: https://myapp.com"
   ```

3. Push to `main` and observe:
   - Staging deployment happens automatically
   - Production deployment is **awaiting approval** in the Actions tab

4. Approve the production deployment from the GitHub interface.

---

## Exercise 02.9 — Optimization and Best Practices

### Instructions

Research and explain (with examples if possible) the following best practices:

1. **Action version pinning**: Why use `actions/checkout@v4` instead of `actions/checkout@main`? Why do some recommend even pinning to SHA (`actions/checkout@a5ac7e51b41094c92402da3b24376905380afc29`)?

2. **`concurrency`**: How do you prevent multiple workflows from running in parallel on the same branch and overwriting each other? Search for the `concurrency` and `cancel-in-progress` keywords.

3. **`timeout-minutes`**: Why is it important to set a timeout on jobs? What happens without one?

4. **Conditional steps**: How do you run a step only if a condition is true? (search for `if:` and `${{ }}` expressions)

5. **`continue-on-error`**: When would you want a job to continue even if a step fails?

---

## Resources

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [GitHub Actions Marketplace](https://github.com/marketplace?type=actions)
- [Workflow syntax reference](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions)
- [Contexts and expressions](https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/accessing-contextual-information-about-workflow-runs)
- [Security hardening for GitHub Actions](https://docs.github.com/en/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions)
- [act — Run GitHub Actions locally](https://github.com/nektos/act)
