
# Dental Health App

This is the repository for our Dental Health App.


## Branching Strategy

- The `main` branch is the default branch and should always be stable.
- For any new feature or bugfix, create a new branch from `main` and name it according to the feature you are adding (e.g., `feature/authentication`, `bugfix/login-error`).
- Do **not** commit directly to `main`. Always use pull requests for merging changes.

## Instructions for Developers

1. **Clone the repository and switch to the main branch:**
   ```sh
   git clone <repo-url>
   cd <repo-name>
   git checkout main
   ```

2. **Create a new feature or bugfix branch from main:**
   ```sh
   git checkout -b <feature-or-bugfix-branch>
   ```
   > **Branch naming convention:** Use descriptive names, e.g., `feature/user-profile`, `bugfix/image-upload`.

3. **Make your changes and commit them:**
   ```sh
   git add .
   git commit -m "<your message>"
   ```

4. **Push your branch and open a pull request to main:**
   ```sh
   git push origin <feature-or-bugfix-branch>
   ```
   Then open a pull request on GitHub targeting the `main` branch.

5. **Keep your branch up to date:**
   Regularly pull the latest changes from `main` to avoid conflicts:
   ```sh
   git checkout main
   git pull origin main
   git checkout <your-branch>
   git merge main
   ```

6. **Do not commit secrets or service account keys.**

---

---
