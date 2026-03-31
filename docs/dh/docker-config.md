# Docker Configuration with ENVSUBST

This document explains how environment variables are injected into the frontend application at runtime, enabling environment-agnostic Docker images.

## The Problem

Frontend applications need environment-specific configuration (API endpoints, authentication settings, etc.). Hardcoding these at build time would require separate Docker images for each environment, which is inefficient and error-prone.

## The Solution

We use a two-stage substitution approach that allows the same Docker image to be deployed across different environments:

1. **nginx Configuration Substitution** - At container startup, nginx's built-in ENVSUBST processes template files
2. **JSON Configuration Substitution** - At request time, nginx dynamically replaces placeholders in configuration files

## How It Works

### Build Time

The [Dockerfile](../../apps/dh/app-dh/Dockerfile) copies and renames template configuration files containing placeholders:

- `dh-api-environment.docker.json` → `dh-api-environment.json`
- `dh-b2c-environment.docker.json` → `dh-b2c-environment.json`
- `dh-app-environment.docker.json` → `dh-app-environment.json`

These files use `__VARIABLE_NAME__` placeholders that will be replaced at runtime. The [nginx.conf](../../apps/dh/app-dh/nginx.conf) is copied to `/etc/nginx/templates/default.conf.template` (the `.template` extension is key).

### Container Startup

When the container starts:

1. The nginx base image (`nginxinc/nginx-unprivileged`) automatically runs `envsubst` on files in `/etc/nginx/templates/`
2. Variables like `${API_BASE}` in the template are replaced with actual environment variable values
3. The processed configuration is written to `/tmp/default.conf`
4. The main nginx config includes this via [include-default-conf.conf](../../apps/dh/app-dh/include-default-conf.conf)

### Request Time

When the browser requests configuration files (e.g., `/assets/configuration/dh-*-environment.json`):

1. nginx matches the request to the special location block
2. The `sub_filter` directives replace `__VARIABLE_NAME__` placeholders with `${ENV_VAR}` values
3. The dynamically modified JSON is returned to the browser

The `sub_filter` directives in nginx.conf map placeholders to environment variables.

## Adding New Environment Variables

To add a new environment variable:

1. Add the placeholder to the appropriate `.docker.json` file in `libs/dh/shared/assets/src/assets/configuration/`
2. Add a `sub_filter` directive in [nginx.conf](../../apps/dh/app-dh/nginx.conf)
3. Provide the environment variable when running the container

See the referenced files for the complete list of currently supported variables.

## Related Files

- [Dockerfile](../../apps/dh/app-dh/Dockerfile) - Sets up nginx ENVSUBST directories and copies/renames config files
- [nginx.conf](../../apps/dh/app-dh/nginx.conf) - Defines sub_filter directives for runtime substitution
- [include-default-conf.conf](../../apps/dh/app-dh/include-default-conf.conf) - Includes the processed nginx config
- [\*.docker.json](../../libs/dh/shared/assets/src/assets/configuration/) - Configuration templates with placeholders
