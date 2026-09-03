# Adding a New Feature

Use **Users CRUD** as the template.

## 1. Create feature folder

```
src/features/products/
├── api/useProducts.ts
└── pages/
    ├── ProductsPage.tsx
    ├── ProductsFormModal.tsx
    ├── ColumnDefs.tsx
    └── validationSchema.tsx
```

## 2. API hooks (`useProducts.ts`)

Copy from `useUsers.ts`:
- `useProductsList(page, search, sortBy, sortOrder)` → `GET /products?...`
- `useCreateProduct(setError)`, `useUpdateProduct(setError)`, `useDeleteProduct`
- Return full `LaravelPaginatedResponse` from list query
- Invalidate `['products-list']` on mutations

## 3. List page

Copy `UsersPage.tsx`:
- `useTableState` or local page/search state
- `GenericDataGrid` with `isServerSide`
- `SearchInput`, create button, delete confirm modal

## 4. Form modal + schema

Copy `UsersFormModal.tsx` + `validationSchema.tsx`. Map fields to your Laravel request body.

## 5. Column defs

Copy `ColumnDefs.tsx`. Add action buttons (view/edit/delete).

## 6. Wire routing

`App.tsx`: `<Route path="products" element={<ProductsPage />} />`

`Sidebar.tsx`: add nav item.

## 7. i18n

Add keys to `en.ts` and `ar.ts`: `products`, field labels, etc.

## 8. Laravel backend

Create `ProductController`, Form Request validation, API Resource, routes in `routes/api.php` behind `auth:sanctum`.

## Checklist

- [ ] List returns `{ data, links, meta }`
- [ ] 422 errors map to form fields
- [ ] Toasts on success/error
- [ ] Both locales updated
- [ ] Protected route under Layout
