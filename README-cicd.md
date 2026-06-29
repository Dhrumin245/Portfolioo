# CI/CD Pipeline Documentation

This project uses **GitHub Actions** for Continuous Integration (CI) and Continuous Deployment (CD). The pipeline automatically validates, tests, builds, and deploys code when changes are pushed to GitHub.

---

## 🚀 Workflow Overview (`.github/workflows/ci-cd.yml`)

The CI/CD pipeline consists of 4 main jobs:

1. **Lint and Test (`lint-and-test`)**
   - Runs on every `push` and `pull_request` to `main` or `master`.
   - Sets up Node.js 20.x with dependency caching.
   - Installs root, Backend, and frontend dependencies (`npm ci`).
   - Runs code quality checks (`npm run lint --prefix my-app`).
   - Runs automated unit & integration test suites for both backend and frontend (`vitest`).

2. **Build (`build`)**
   - Runs automatically after tests pass successfully.
   - Builds the React Vite application (`npm run build --prefix my-app`).
   - Packages and uploads the production bundle (`dist` folder) as a GitHub Pages deployment artifact.

3. **Deploy to GitHub Pages (`deploy-github-pages`)**
   - Triggers automatically on pushes to the `main` or `master` branch.
   - Publishes the compiled frontend directly to **GitHub Pages**.

4. **Deploy to Vercel (`deploy-vercel`)**
   - Optional production trigger for Vercel deployments when Vercel credentials are saved in repository secrets.

---

## 🔐 Setting Up GitHub Repository Secrets

To support automated deployment and database connections in production or staging CI environments, add the following secrets to your GitHub repository under **Settings > Secrets and variables > Actions > New repository secret**:

| Secret Name | Description | Example / Usage |
| :--- | :--- | :--- |
| `MONGODB_URI` | Connection URI for production MongoDB database | `mongodb+srv://user:pass@cluster.mongodb.net/portfolio` |
| `JWT_SECRET` | Secret key for auth token signing in Backend | `your_super_secret_jwt_key` |
| `VERCEL_TOKEN` | Vercel personal access token for CLI deployments | `abc123xyz...` |
| `VERCEL_ORG_ID` | Vercel Team / Organization ID | `team_xxx...` |
| `VERCEL_PROJECT_ID` | Vercel Project ID | `prj_xxx...` |

---

## 🌐 Enabling GitHub Pages

To view your automated frontend deployment on GitHub Pages:
1. Go to your repository on GitHub.
2. Navigate to **Settings > Pages**.
3. Under **Build and deployment > Source**, select **GitHub Actions**.
4. Once enabled, every push to `main` will automatically deploy your latest frontend build!
