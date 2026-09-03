# Forms & Validation

## Stack

- **react-hook-form** for form state
- **Zod** for schemas
- **@hookform/resolvers** via `useZodForm` helper

## Basic form

```tsx
const schema = z.object({
  name: z.string().min(1, 'requiredField'),
  email: z.string().email('invalidEmail'),
})

const methods = useZodForm(schema, { name: '', email: '' })

<FormProvider {...methods}>
  <form onSubmit={methods.handleSubmit(onSubmit)}>
    <BaseInputField name="name" label={t('name')} required />
  </form>
</FormProvider>
```

## Modal forms

See `UsersFormModal.tsx`: reset form when modal opens, use `ModalStatus` wrapper.

## Laravel validation errors

When Laravel returns 422:

```ts
import { applyValidationErrors } from '@/shared/utils/form-errors'

useCreateUser(methods.setError) // hook applies errors in onError
```

Manual usage:

```ts
onError: (error) => {
  if (applyValidationErrors(error, setError)) return
  toast.error(getErrorMessage(error))
}
```

## Bilingual fields

Countries and cities use `nameEn` / `nameAr` in forms. Hooks map them to FormData `name[en]` and `name[ar]` via `appendTranslatable()` in `useCountries.ts` / `useCities.ts`.

## Schema files

Keep schemas in `validationSchema.tsx` next to the page. Export `schema`, `getInitialValues`, and inferred types.
