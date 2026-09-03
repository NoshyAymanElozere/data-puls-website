# Notifications & Toasts

## Toasts (react-hot-toast)

Configured in `src/app/main.tsx`.

### When to toast

| Source | Example |
|--------|---------|
| Mutation success | `toast.success(res.message \|\| 'Saved.')` |
| Mutation error | `toast.error(getErrorMessage(error))` |
| Axios interceptor | 401, 403, 422, 5xx global messages |

Do not use toasts for inline form field errors — use RHF `setError` for 422.

## Notification bell (Header)

Powered by `useNotifications()`:

1. **REST**: `GET /notifications` loads initial list (resolved as `.../admin/notifications`)
2. **Reverb**: subscribes to `private-App.Models.User.{id}` via Laravel Echo
3. On broadcast: prepends to query cache + optional toast
4. **Mark all read**: `POST /notifications/read-all`

### Frontend files

- `src/features/notifications/api/useNotifications.ts`
- `src/shared/services/echo.ts`
- `src/shared/layouts/Header.tsx` — bell dropdown

## Laravel backend

Your notification class should implement broadcasting:

```php
// Example: database notification + broadcast
class OrderCreated extends Notification implements ShouldBroadcast
{
    public function via($notifiable): array
    {
        return ['database', 'broadcast'];
    }
}
```

Ensure Reverb is running and channel authorization allows the authenticated user.

## Inline alerts

Use `alert.tsx` for persistent banners on a page (not the bell/toast system).
