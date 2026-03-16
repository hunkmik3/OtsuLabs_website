# Otsu Labs Website

Next.js website with CMS-driven project pages (Novathera template as baseline).

## Quick Start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## CMS Routes

- Public work list: `/work`
- Public project detail: `/work/[slug]`
- Admin login: `/admin/login`
- Admin project list: `/admin/projects`
- Admin editor: `/admin/projects/[id]`
- Admin draft preview: `/admin/projects/[id]/preview`

## CMS Runtime Modes

Set `CMS_REPOSITORY_MODE`:

- `file` (default): uses JSON store (`data/cms/projects.json`)
- `postgres`: uses Postgres repository

### File mode
- Good for local/dev.
- Uses atomic file writes and process-level write lock.

### Postgres mode
- Set `CMS_DATABASE_URL` (or `DATABASE_URL`).
- Run migration command: `npm run cms:migrate:postgres`.
- Verify flow on Postgres: `npm run cms:verify:postgres`.
- Schema/table can be configured with `CMS_DATABASE_SCHEMA` and `CMS_DATABASE_TABLE`.

## Admin Auth

- Admin is protected by `CMS_ADMIN_TOKEN`.
- Session cookie is signed with `CMS_AUTH_SECRET`.
- Admin APIs/pages require valid session cookie or admin token header.

## Media Upload

- Endpoint: `POST /api/admin/media`
- Uses storage abstraction (`lib/cms/media-storage.ts`)
- Storage modes:
  - `local` (default): `/public/uploads`
  - `s3`: S3/R2-compatible object storage (`CMS_S3_*`)
- Limits/type are env-configurable (`CMS_MEDIA_*`).

## Env Configuration

See `.env.example` for full list:

- Auth/session: `CMS_ADMIN_TOKEN`, `CMS_AUTH_SECRET`, `CMS_ADMIN_SESSION_*`
- Repository: `CMS_REPOSITORY_MODE`, `CMS_DATA_FILE_PATH`, `CMS_DATABASE_URL`
- Media: `CMS_MEDIA_*`
- Metadata base URL: `CMS_PUBLIC_BASE_URL`

## Tests

Run CMS integration tests:

```bash
npm run test:cms
```

Includes:
- auth/session checks
- core project service flow (create/edit/publish/unpublish/duplicate/delete)
- draft preview vs published-only public policy
- optional Postgres integration flow (when `CMS_DATABASE_URL` is set)

## Ops Scripts

```bash
npm run cms:migrate:postgres
npm run cms:verify:postgres
npm run cms:backup:db -- --output backups/cms-db.sql
npm run cms:restore:db -- --input backups/cms-db.sql
npm run cms:backup:media -- --output backups/cms-media.tar.gz
npm run cms:restore:media -- --input backups/cms-media.tar.gz
```

## More Docs

Detailed production notes:

- [docs/cms-production.md](docs/cms-production.md)
