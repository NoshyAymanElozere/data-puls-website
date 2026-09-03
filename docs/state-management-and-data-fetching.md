# State Management & Data Fetching

## TanStack Query

All server data flows through React Query hooks in `features/*/api/`.

Configured client: `src/shared/services/queryClient.ts`
- Queries: 5min staleTime, 1 retry, no refetch on window focus
- Mutations: no retry

## Query key conventions

```
['users-list', page, search, sortBy, sortOrder]
['user', id]
['auth-user']
['notifications']
['countries-list', page, search]
['global-settings']
```

## Hook pattern

```ts
export function useUsersList(...) {
  return useQuery({
    queryKey: ['users-list', ...],
    queryFn: async () => {
      const response = await api.get<LaravelPaginatedResponse<User>>(`/users?${params}`)
      return response.data
    },
  })
}
```

## Mutations

```ts
return useMutation({
  mutationFn: async (payload) => api.post('/users', payload).then(r => r.data),
  onSuccess: (res) => {
    qc.invalidateQueries({ queryKey: ['users-list'] })
    toast.success(res.message)
  },
  onError: (error) => { ... },
})
```

## Client state

- **useTableState** — table pagination/filter UI state
- **useDisclosure** — modal open/close
- **useTheme** — dark/light mode

No Zustand/Redux — server state stays in Query.

## Axios

Single instance: `src/shared/services/axios.ts`. Never duplicate.
