# DevVault Backend -> Frontend Integration Contract

This document is designed to be fed directly to an LLM to generate frontend integration code.

## 1) Backend Runtime Contract

- Base URL (local): `http://localhost:4000`
- API prefix: `/api/v1`
- Health endpoint: `GET /health`
- Auth transport:
  - Access token: `Authorization: Bearer <accessToken>` header
  - Refresh token: sent in JSON body to refresh/logout endpoints
- Content type: `application/json`

## 2) Common Response Shapes

### Success (most endpoints)
```json
{
  "success": true,
  "data": {}
}
```

### No Content (delete/logout)
- HTTP `204`
- Empty body

### Error
```json
{
  "success": false,
  "message": "Human readable error",
  "details": {},
  "path": "/api/v1/..."
}
```

## 3) Auth Flow (must implement in FE)

### Register
- `POST /api/v1/auth/register`
- Body:
```json
{
  "email": "alice@example.com",
  "username": "alice",
  "password": "StrongPass123",
  "displayName": "Alice"
}
```
- Response `201`:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "clx...",
      "email": "alice@example.com",
      "username": "alice",
      "displayName": "Alice",
      "bio": null,
      "avatarUrl": null,
      "website": null,
      "role": "USER",
      "isVerified": false,
      "createdAt": "2026-04-14T10:00:00.000Z",
      "updatedAt": "2026-04-14T10:00:00.000Z"
    },
    "tokens": {
      "accessToken": "<jwt>",
      "refreshToken": "<jwt>"
    }
  }
}
```

### Login
- `POST /api/v1/auth/login`
- Body:
```json
{
  "identifier": "alice@example.com",
  "password": "StrongPass123"
}
```
- Response `200`: same shape as register

### Me
- `GET /api/v1/auth/me`
- Auth required
- Response `200`:
```json
{
  "success": true,
  "data": {
    "id": "clx...",
    "email": "alice@example.com",
    "username": "alice",
    "displayName": "Alice",
    "bio": null,
    "avatarUrl": null,
    "website": null,
    "role": "USER",
    "isVerified": false,
    "createdAt": "2026-04-14T10:00:00.000Z",
    "updatedAt": "2026-04-14T10:00:00.000Z"
  }
}
```

### Refresh
- `POST /api/v1/auth/refresh`
- Body:
```json
{ "refreshToken": "<jwt>" }
```
- Response `200`: same shape as register/login (`user + tokens`)

### Logout
- `POST /api/v1/auth/logout`
- Body:
```json
{ "refreshToken": "<jwt>" }
```
- Response: `204`

## 4) Enums

- `Visibility`: `PUBLIC | PRIVATE | UNLISTED`
- `ResourceType`: `SNIPPET | BOOKMARK | NOTE`
- `Role`: `USER | ADMIN`

## 5) Endpoint Matrix

## 5.1 Users (currently not auth-locked by design)
- `GET /api/v1/users?page&limit&search`
- `GET /api/v1/users/:id`
- `POST /api/v1/users`
- `PATCH /api/v1/users/:id`
- `DELETE /api/v1/users/:id`

Note: `POST /users` expects `passwordHash` (not plain password). For normal app signup/login use `/auth/*` endpoints.

## 5.2 Collections
- `GET /api/v1/collections?page&limit&userId&search`
- `GET /api/v1/collections/:id`
- `POST /api/v1/collections` (auth)
- `PATCH /api/v1/collections/:id` (auth + owner)
- `DELETE /api/v1/collections/:id` (auth + owner)

Create body:
```json
{
  "name": "Backend Recipes",
  "description": "Reusable APIs",
  "color": "#0ea5e9",
  "icon": "api",
  "isPinned": true
}
```

## 5.3 Tags
- `GET /api/v1/tags?page&limit&userId&search`
- `GET /api/v1/tags/:id`
- `POST /api/v1/tags` (auth)
- `PATCH /api/v1/tags/:id` (auth + owner)
- `DELETE /api/v1/tags/:id` (auth + owner)
- `POST /api/v1/tags/:id/snippets/:snippetId` (auth + owner of both)
- `DELETE /api/v1/tags/:id/snippets/:snippetId` (auth + owner of both)
- `POST /api/v1/tags/:id/bookmarks/:bookmarkId` (auth + owner of both)
- `DELETE /api/v1/tags/:id/bookmarks/:bookmarkId` (auth + owner of both)
- `POST /api/v1/tags/:id/notes/:noteId` (auth + owner of both)
- `DELETE /api/v1/tags/:id/notes/:noteId` (auth + owner of both)

Create body:
```json
{
  "name": "typescript",
  "color": "#3178c6"
}
```

## 5.4 Snippets
- `GET /api/v1/snippets?page&limit&userId&language&visibility&search`
- `GET /api/v1/snippets/:id`
- `POST /api/v1/snippets` (auth)
- `PATCH /api/v1/snippets/:id` (auth + owner)
- `DELETE /api/v1/snippets/:id` (auth + owner)

Create body:
```json
{
  "collectionId": "clx_collection",
  "title": "Express async handler",
  "description": "Reusable wrapper",
  "code": "export const asyncHandler = ...",
  "language": "typescript",
  "visibility": "PUBLIC",
  "isPinned": false
}
```

## 5.5 Bookmarks
- `GET /api/v1/bookmarks?page&limit&userId&visibility&search`
- `GET /api/v1/bookmarks/:id`
- `POST /api/v1/bookmarks` (auth)
- `PATCH /api/v1/bookmarks/:id` (auth + owner)
- `DELETE /api/v1/bookmarks/:id` (auth + owner)

Create body:
```json
{
  "collectionId": "clx_collection",
  "title": "Prisma Docs",
  "url": "https://www.prisma.io/docs",
  "description": "ORM docs",
  "favicon": null,
  "ogImage": null,
  "visibility": "PUBLIC",
  "isPinned": false
}
```

## 5.6 Notes
- `GET /api/v1/notes?page&limit&userId&visibility&search`
- `GET /api/v1/notes/:id`
- `POST /api/v1/notes` (auth)
- `PATCH /api/v1/notes/:id` (auth + owner)
- `DELETE /api/v1/notes/:id` (auth + owner)

Create body:
```json
{
  "collectionId": "clx_collection",
  "title": "MVP scope",
  "content": "Build auth + CRUD first.",
  "visibility": "PRIVATE",
  "isPinned": false
}
```

## 5.7 Comments
- `GET /api/v1/comments?page&limit&snippetId&userId&parentId`
- `GET /api/v1/comments/:id`
- `POST /api/v1/comments` (auth)
- `PATCH /api/v1/comments/:id` (auth + owner)
- `DELETE /api/v1/comments/:id` (auth + owner)

Create body:
```json
{
  "snippetId": "clx_snippet",
  "content": "Nice snippet",
  "parentId": null
}
```

## 5.8 Stars
- `GET /api/v1/stars?page&limit&userId&resourceType`
- `GET /api/v1/stars/:id`
- `POST /api/v1/stars` (auth)
- `DELETE /api/v1/stars/:id` (auth + owner)

Create body (exactly one target id):
```json
{
  "resourceType": "SNIPPET",
  "snippetId": "clx_snippet"
}
```

## 6) Sample List Response (Pagination)

```json
{
  "success": true,
  "data": {
    "items": [],
    "page": 1,
    "limit": 10,
    "total": 0
  }
}
```

## 7) Expected HTTP Status Codes

- `200`: successful read/update/login/refresh/me
- `201`: successful create/register
- `204`: successful delete/logout or relation attach/detach actions
- `400`: validation/input errors
- `401`: missing/invalid token, invalid credentials, token expired
- `403`: ownership/role forbidden
- `404`: resource not found
- `409`: unique conflict (email/username/tag uniqueness etc.)
- `500`: server error

## 8) Frontend Auth Token Strategy (recommended)

- Keep `accessToken` in memory state (or short-lived storage if needed).
- Keep `refreshToken` in secure storage per your app policy.
- On `401` from protected endpoint:
  1. call `/api/v1/auth/refresh` with refresh token,
  2. retry original request once with new access token,
  3. if refresh fails, force logout and redirect to login.

## 9) Ready Prompt For FE LLM

Use this prompt directly:

```text
Build a frontend API client + auth state manager for DevVault using the contract in FE_INTEGRATION_CONTRACT.md.
Requirements:
1) Generate strongly typed request/response models.
2) Add an HTTP client wrapper with automatic Bearer token injection.
3) Implement auto-refresh retry-once logic on 401.
4) Expose module APIs: auth, collections, tags, snippets, bookmarks, notes, comments, stars.
5) Implement helper methods for pagination queries and enum-safe filters.
6) Handle 204 responses safely.
7) Surface backend error shape: { success:false, message, details, path }.
8) Keep users module available but do not use it for signup/login (use auth endpoints).
```

## 10) Notes For Integration Team

- You do **not** need to manually inspect responses now; the shapes above mirror current backend behavior.
- If you need, backend can next provide a machine-readable OpenAPI JSON so FE generation can be fully automated.
