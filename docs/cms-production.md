# CMS Production Guide (Phase 7)

## 1) Recommended production stack

- Runtime: Next.js app server
- Persistence: Postgres (`CMS_REPOSITORY_MODE=postgres`)
- Media: S3-compatible object storage (`CMS_MEDIA_STORAGE_MODE=s3`) with public CDN/base URL
- Admin auth: `CMS_ADMIN_TOKEN` + signed session cookie (`CMS_AUTH_SECRET`)
- Observability: structured JSON logs from `lib/cms/logger.ts`

This keeps existing CMS API contract + section schema intact while moving infra to production-safe services.

## 2) Env variables

Use `.env.example` and configure all required values.

### Auth/session
- `CMS_ADMIN_TOKEN`
- `CMS_AUTH_SECRET`
- `CMS_ADMIN_SESSION_COOKIE`
- `CMS_ADMIN_SESSION_TTL_SECONDS`
- `CMS_ADMIN_COOKIE_SECURE` (set `true` on HTTPS production)
- `CMS_ADMIN_COOKIE_SAME_SITE` (`strict` | `lax` | `none`)
- `CMS_ADMIN_COOKIE_DOMAIN` (optional, if admin uses subdomain sharing)
- `CMS_ADMIN_HEADER_NAME`

### Repository
- `CMS_REPOSITORY_MODE=postgres` (production)
- `CMS_DATABASE_URL` (or `DATABASE_URL`)
- `CMS_DATABASE_SSL`
- `CMS_DATABASE_SCHEMA`
- `CMS_DATABASE_TABLE`

### Media
- `CMS_MEDIA_STORAGE_MODE=local|s3`
- local mode:
  - `CMS_MEDIA_LOCAL_DIR`
  - `CMS_MEDIA_PUBLIC_BASE_PATH`
- s3 mode:
  - `CMS_S3_BUCKET`
  - `CMS_S3_REGION`
  - `CMS_S3_ENDPOINT` (required for R2/Supabase S3-compatible endpoints)
  - `CMS_S3_ACCESS_KEY_ID`
  - `CMS_S3_SECRET_ACCESS_KEY`
  - `CMS_S3_PUBLIC_BASE_URL` (recommended for stable public URLs)
  - `CMS_S3_FORCE_PATH_STYLE`
  - `CMS_S3_KEY_PREFIX`

### Other
- `CMS_PUBLIC_BASE_URL`
- `CMS_LOG_LEVEL`
- `CMS_LOG_PRETTY`

## 3) Postgres migration and verification

### Apply migrations
```bash
npm run cms:migrate:postgres
```

Optional custom migration folder:
```bash
npm run cms:migrate:postgres -- --dir data/cms/migrations
```

### Verify Postgres end-to-end flow
```bash
npm run cms:verify:postgres
```

This command runs create/edit/publish/unpublish/duplicate/delete checks through service/repository layers on Postgres mode.

### Notes
- Migration runner auto-ensures schema/table/indexes via `lib/cms/postgres-schema.ts`.
- SQL migration files support placeholders:
  - `{{CMS_SCHEMA}}`
  - `{{CMS_TABLE}}`
  - `{{CMS_QUALIFIED_TABLE}}`
  - `{{CMS_STATUS_INDEX}}`
  - `{{CMS_ORDER_INDEX}}`
  - `{{CMS_UPDATED_INDEX}}`

## 4) Media storage in production

### Local mode (not recommended for multi-instance production)
- Files saved under `CMS_MEDIA_LOCAL_DIR`
- URL generated from `CMS_MEDIA_PUBLIC_BASE_PATH`

### S3 mode (recommended)
- `lib/cms/media-storage.ts` uses `CmsMediaStorage` interface with S3 implementation.
- Works for:
  - AWS S3
  - Cloudflare R2 (S3-compatible)
  - other S3-compatible endpoints
- Set `CMS_S3_PUBLIC_BASE_URL` so returned media URLs are stable and CDN-friendly.

## 5) Backup and restore runbook

Prerequisites on operator machine/runner:
- `pg_dump`
- `psql`
- `tar`

### Database backup
```bash
npm run cms:backup:db -- --output backups/cms-db-$(date +%Y%m%d-%H%M%S).sql
```

### Database restore
```bash
npm run cms:restore:db -- --input backups/cms-db-20260101-120000.sql
```

### Media backup (local mode only)
```bash
npm run cms:backup:media -- --output backups/cms-media-$(date +%Y%m%d-%H%M%S).tar.gz
```

### Media restore (local mode only)
```bash
npm run cms:restore:media -- --input backups/cms-media-20260101-120000.tar.gz
```

### S3 media backup
- Use provider-native versioning/lifecycle/snapshot tooling.
- This repository keeps interface compatibility; backup policy should live at storage provider level.

## 6) Deploy checklist

- [ ] Set `CMS_REPOSITORY_MODE=postgres`
- [ ] Set `CMS_DATABASE_URL` and `CMS_DATABASE_SSL`
- [ ] Run `npm run cms:migrate:postgres`
- [ ] Run `npm run cms:verify:postgres`
- [ ] Configure media mode and required env (`local` or `s3`)
- [ ] Confirm `CMS_PUBLIC_BASE_URL` is production domain
- [ ] Confirm admin token and auth secret are strong/rotated
- [ ] Confirm cookie policy for HTTPS:
  - [ ] `CMS_ADMIN_COOKIE_SECURE=true`
  - [ ] `CMS_ADMIN_COOKIE_SAME_SITE` fits your admin flow (`strict` recommended for same-site admin)
  - [ ] optional `CMS_ADMIN_COOKIE_DOMAIN` if cross-subdomain admin is needed
- [ ] Confirm `/api/projects*` returns published only
- [ ] Confirm `/admin/*` and `/api/admin/*` are auth-protected
- [ ] Take first DB + media backup before go-live
- [ ] Run `npm run test:cms`

## 7) Logging events available

The following are now logged (structured JSON):
- Admin login success/failure
- Admin logout
- Publish/unpublish/duplicate/create/update/delete project events
- Media upload success/failure
- API handled errors + unexpected errors
- Repository mode selection
- Postgres transaction/query failures
- Unauthorized admin access attempts blocked by proxy

## 8) Public/admin policy guarantees

- Public APIs/routes only expose published projects.
- Drafts are visible in admin list/editor/preview only.
- `/admin/projects/[id]/preview` shares production renderer path but remains admin-gated.
- Metadata on `/work/[slug]` is derived from rendered published CMS document.

## 9) Remaining risks before full enterprise scale

- Auth is single-token admin model (no RBAC/user management yet).
- File mode is still available for dev fallback, but not safe for multi-instance production.
- Backup scripts rely on local tools (`pg_dump`, `psql`, `tar`) existing in deploy/ops environment.
- No automatic version history per project yet.

## 10) Middleware to proxy migration

- Next.js 16 warns that `middleware.ts` is deprecated in favor of `proxy.ts`.
- This project is migrated to `proxy.ts` with the same matcher and authorization logic.
- If you still deploy with older Next versions, validate compatibility in staging first.
