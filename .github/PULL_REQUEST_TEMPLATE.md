<!--- 🙏 Thank you for your submission, we really appreciate it. Like many open source projects, we ask that you sign our [Contributor License Agreement](https://cla-assistant.io/Energinet-DataHub/greenforce-frontend) before we can accept your contribution. --->

## Description

<!--- Please leave a helpful description of the pull request here. --->

## References

<!--- Are there any issues, pull requests or similar that should be linked here? --->

- #0000

---

<details>
<summary><strong>Testing with Docker (for QA)</strong></summary>

### Prerequisites
- Docker Desktop installed and running
- Git
- SSL certificates (`localhost.crt` and `localhost.key`) in the repository root

### Steps to run locally

1. **Checkout this branch:**
   ```bash
   git fetch origin
   git checkout <branch-name>
   ```

2. **Build and start the containers:**
   ```bash
   docker compose up --build
   ```

3. **Azure authentication:**
   The BFF container will prompt for Azure login using device code flow. Follow the instructions in the terminal to authenticate.

4. **Access the application:**
   Open https://localhost:4200 in your browser.

5. **Stop the containers:**
   ```bash
   docker compose down
   ```

### Troubleshooting
- If you get SSL certificate errors, ensure `localhost.crt` and `localhost.key` exist in the repo root
- If port 4200 or 5001 is in use, stop conflicting services or modify `docker-compose.yml`

</details>
