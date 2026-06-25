Interviews feature — integration notes

API expectations
- GET `/interviews` should accept query params: `interviewerId`, `dateFrom`, `dateTo`, `page`, `pageSize` and return either an array or an object `{ data: [], total }`.
- PUT `/interviews/:id` should accept payload to update interview result, e.g. `{ result: 'PASS'|'FAIL'|'HOLD', note, status }`.

Environment
- Set `VITE_API_URL` in your `.env` (or system env) to point to the backend base URL. Example:

```
VITE_API_URL=https://api.example.com
```

End-to-end test guidance
- Quick manual test:
  1. Start dev server: `npm run dev`
  2. Login as an interviewer (store must set `user.id` in `useAuthStore`)
  3. Open `/interviews` and verify only assigned interviews show
  4. Update a result and confirm it's saved (toast + list refresh)

- Automated E2E (recommended): use Playwright or Cypress. Basic Playwright steps:
  1. Start app in dev (`npm run dev`) and backend (or mock server)
  2. Use Playwright to programmatically set localStorage auth token/user
  3. Navigate to `/interviews`, assert visible items, click update, fill result, save, assert toasts and API request
