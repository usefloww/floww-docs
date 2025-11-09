# Floww Self-Hosting with Traefik

This example demonstrates how to self-host Floww using Docker Compose with Traefik as a reverse proxy.

## Features

- **Traefik Reverse Proxy**: Automatic HTTPS and routing
- **Generic OIDC Authentication**: Works with Keycloak, Authentik, Auth0, and other OIDC providers
- **PostgreSQL Database**: With PostGIS extension
- **Centrifugo WebSocket Server**: For real-time updates
- **Complete Stack**: Backend API, Dashboard, and Database

## Prerequisites

- Docker and Docker Compose installed
- An OIDC provider (Keycloak, Authentik, Auth0, etc.)
- Domain names pointing to your server (or use `.localhost` for local development)

## Quick Start

### 1. Configure OIDC Provider

First, set up an OAuth/OIDC client in your provider:

**Required OAuth Settings:**
- **Redirect URIs**:
  - `https://api.localhost/auth/callback` (for local dev)
  - `https://api.yourdomain.com/auth/callback` (for production)
- **Scopes**: `openid profile email`
- **Grant Type**: Authorization Code

**Example: Keycloak Setup**

```bash
# Create a new client in Keycloak
Client ID: floww
Client Protocol: openid-connect
Access Type: confidential
Valid Redirect URIs: https://api.localhost/auth/callback
```

**Example: Authentik Setup**

```bash
# Create a new OAuth2/OIDC Provider in Authentik
Name: Floww
Authorization flow: default-provider-authorization-implicit-consent
Redirect URIs: https://api.localhost/auth/callback
```

### 2. Configure Environment

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` and configure the following:

```bash
# OIDC Configuration
AUTH_CLIENT_ID=your-client-id-from-oidc-provider
AUTH_CLIENT_SECRET=your-client-secret-from-oidc-provider
AUTH_ISSUER_URL=https://your-oidc-provider.com/realms/myrealm

# Generate new secrets
SESSION_SECRET_KEY=$(python -c "import secrets; print(secrets.token_urlsafe(32))")
ENCRYPTION_KEY=$(python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())")
```

### 3. Configure Centrifugo (Optional)

Centrifugo is configured via environment variables. The defaults work for local development, but you can customize them in your `.env` file:

```bash
# Centrifugo Configuration (all optional with sensible defaults)
CENTRIFUGO_API_KEY=floww-api-key-dev
CENTRIFUGO_ADMIN_ENABLED=false
CENTRIFUGO_ADMIN_INSECURE=false
CENTRIFUGO_ALLOW_ANONYMOUS=false
```

For production, override these in your `.env` file:

```bash
# Generate a secure API key
CENTRIFUGO_API_KEY=$(python -c "import secrets; print(secrets.token_urlsafe(32))")
```

**Note**: The Centrifugo configuration is baked into the Docker image, making deployment easier. No config files needed!

### 4. Start Services

```bash
# Start all services
docker compose up -d

# Run database migrations
docker compose --profile migrations up migrations

# View logs
docker compose logs -f
```

### 5. Access Floww

Once running, access Floww at:

- **Dashboard**: https://dashboard.localhost
- **API**: https://api.localhost
- **Admin Panel**: https://admin.localhost
- **WebSocket**: wss://ws.localhost
- **Traefik Dashboard**: http://localhost:8080

## OIDC Provider Configurations

### Keycloak

```bash
# Issuer URL format
AUTH_ISSUER_URL=https://keycloak.example.com/realms/floww

# In Keycloak:
# 1. Create a new realm (or use existing)
# 2. Create a new client:
#    - Client ID: floww
#    - Client Protocol: openid-connect
#    - Access Type: confidential
#    - Valid Redirect URIs: https://api.localhost/auth/callback
# 3. Go to Credentials tab and copy the Secret
```

### Authentik

```bash
# Issuer URL format
AUTH_ISSUER_URL=https://authentik.example.com/application/o/floww

# In Authentik:
# 1. Create a new Provider (OAuth2/OIDC)
#    - Name: Floww
#    - Authorization flow: default-provider-authorization-implicit-consent
#    - Redirect URIs: https://api.localhost/auth/callback
# 2. Create a new Application and link it to the provider
# 3. Copy Client ID and Client Secret
```

### Auth0

```bash
# Issuer URL format
AUTH_ISSUER_URL=https://yourdomain.auth0.com

# In Auth0:
# 1. Create a new Application (Regular Web Application)
# 2. Configure:
#    - Allowed Callback URLs: https://api.localhost/auth/callback
#    - Allowed Logout URLs: https://api.localhost
# 3. Copy Domain, Client ID, and Client Secret
```

### WorkOS

```bash
# Issuer URL format
AUTH_ISSUER_URL=https://api.workos.com

# In WorkOS:
# 1. Create a new Environment
# 2. Copy Client ID from Settings
# 3. Generate API Key for Client Secret
```

### Generic OIDC

For any OIDC-compliant provider:

```bash
AUTH_CLIENT_ID=your-client-id
AUTH_CLIENT_SECRET=your-client-secret
AUTH_ISSUER_URL=https://your-provider.com  # Must have /.well-known/openid-configuration
```

## Production Deployment

### 1. Update Domain Names

Replace `.localhost` domains in `docker-compose.yml`:

```yaml
# Change all instances of:
- "traefik.http.routers.floww-backend-api.rule=Host(`api.localhost`)"
# To your domain:
- "traefik.http.routers.floww-backend-api.rule=Host(`api.yourdomain.com`)"
```

### 2. Enable Let's Encrypt

Uncomment the Let's Encrypt configuration in `docker-compose.yml`:

```yaml
services:
  traefik:
    command:
      # ... other commands ...

      # Uncomment these lines:
      - "--certificatesresolvers.myresolver.acme.tlschallenge=true"
      - "--certificatesresolvers.myresolver.acme.email=your-email@example.com"
      - "--certificatesresolvers.myresolver.acme.storage=/letsencrypt/acme.json"
```

Then update all TLS configurations to use `certresolver`:

```yaml
- "traefik.http.routers.floww-backend-api.tls.certresolver=myresolver"
```

### 3. Secure Secrets

Generate strong secrets:

```bash
# Session secret
python -c "import secrets; print(secrets.token_urlsafe(32))"

# Encryption key
python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"

# Centrifugo API key
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

Update your `.env` file with these secrets:

```bash
SESSION_SECRET_KEY=<generated-session-secret>
ENCRYPTION_KEY=<generated-encryption-key>
CENTRIFUGO_API_KEY=<generated-centrifugo-key>
```

### 4. Update OIDC Redirect URIs

Update your OIDC provider's redirect URIs to use your production domain:

```
https://api.yourdomain.com/auth/callback
```

## Troubleshooting

### Authentication Issues

**Problem**: Redirected to login page repeatedly

Check:
1. `AUTH_ISSUER_URL` is correct and accessible
2. OIDC provider is reachable from the container
3. Redirect URI in OIDC provider matches `PUBLIC_API_URL`
4. Check logs: `docker compose logs floww-backend`

### Database Connection Issues

**Problem**: Backend can't connect to database

Check:
1. Database is running: `docker compose ps floww-db`
2. `DATABASE_URL` uses correct hostname (`floww-db`)
3. Run migrations: `docker compose --profile migrations up migrations`

### OIDC Discovery Issues

**Problem**: "Failed to fetch OIDC discovery document"

Check:
1. `AUTH_ISSUER_URL` ends with no trailing slash
2. Provider supports OIDC Discovery (`/.well-known/openid-configuration`)
3. Provider is accessible from backend container

### WorkOS User Sync

Floww includes an optional WorkOS user sync feature:
- Requires WorkOS SDK (`pip install workos`)
- Uses the same `AUTH_CLIENT_ID` and `AUTH_CLIENT_SECRET` as authentication
- Endpoint: `POST /api/organizations/{org_id}/sync-users`
- Works independently of authentication method

To use WorkOS user sync:
1. Install WorkOS SDK in the backend container
2. Configure WorkOS credentials in environment variables
3. Use the sync endpoint to bulk import users from WorkOS organizations

## Changing OIDC Providers

To switch between OIDC providers (e.g., Auth0 to Keycloak):

### 1. Update Environment Variables

Simply update your OIDC configuration:

```bash
# New provider credentials
AUTH_CLIENT_ID=new-client-id
AUTH_CLIENT_SECRET=new-client-secret
AUTH_ISSUER_URL=https://new-provider.com
```

### 2. Update OIDC Provider

Configure your new OIDC provider with the callback URL:

```
https://api.yourdomain.com/auth/callback
```

### 3. User Migration

Note: The database field `workos_user_id` is reused for all OIDC providers (the name is historical). No schema changes needed.

- Users will need to log in again via the new OIDC provider
- Existing user records are matched by the `sub` claim from the new provider's JWT
- For seamless migration, ensure user IDs match between providers

## Advanced Configuration

### Custom Network Configuration

To use with external services:

```yaml
networks:
  floww-network:
    driver: bridge
    external: true  # Use existing network
```

### Resource Limits

Add resource limits in production:

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 1G
        reservations:
          memory: 512M
```

### Multiple Replicas

Scale backend for high availability:

```bash
docker compose up -d --scale backend=3
```

Traefik will automatically load balance between replicas.

## Support

For issues and questions:
- GitHub Issues: https://github.com/usefloww/floww/issues
- Documentation: https://docs.usefloww.com
