import { expect, test, type APIRequestContext, type Page } from '@playwright/test'
import {
  adminApi,
  createRecord,
  showRecord,
  uid,
  useUiLanguage,
  waitForShowRequest,
  type Translations,
} from './support/api'

/**
 * Detail/edit screens must load the record from the backend `show` endpoint (which returns
 * `{ en, ar }`) rather than reusing the list row (which only carries the current UI locale),
 * so both language fields are populated whichever language the dashboard is in.
 */

let api: APIRequestContext

test.beforeAll(async () => {
  api = await adminApi()
})

test.afterAll(async () => {
  await api.dispose()
})

async function searchGrid(page: Page, term: string) {
  await page.locator('input[type="search"]').first().fill(term)
}

function gridCell(page: Page, text: string) {
  return page.getByRole('gridcell', { name: text, exact: true }).first()
}

/** Opens the record's view modal the way an admin does: double-click its row. */
async function openViewModal(page: Page, route: string, resource: string, id: number, rowText: string) {
  await page.goto(route)
  await searchGrid(page, rowText)
  const cell = gridCell(page, rowText)
  await expect(cell).toBeVisible()

  const show = waitForShowRequest(page, resource, id)
  await cell.dblclick()
  await show
}

async function expectBilingualInputs(page: Page, field: string, value: Translations) {
  const dialog = page.getByRole('dialog')
  await expect(dialog.locator(`[name="${field}En"]`)).toHaveValue(value.en)
  await expect(dialog.locator(`[name="${field}Ar"]`)).toHaveValue(value.ar)
}

type ModalCase = {
  title: string
  route: string
  resource: string
  arrange: (tag: string) => Promise<{ id: number; fields: Record<string, Translations> }>
}

const modalCases: ModalCase[] = [
  {
    title: 'category',
    route: 'categories',
    resource: 'categories',
    arrange: async (tag) => {
      const name = { en: `Appliances ${tag}`, ar: `أجهزة منزلية ${tag}` }
      const description = { en: `Home devices ${tag}`, ar: `أجهزة المنزل ${tag}` }
      const { id } = await createRecord(api, 'categories', {
        name,
        description,
        icon: 'fa-solid fa-plug',
        icon_bg_color: '#6366F1',
        is_active: true,
      })
      return { id, fields: { name, description } }
    },
  },
  {
    title: 'country',
    route: 'settings/countries',
    resource: 'countries',
    arrange: async (tag) => {
      const name = { en: `Oceania ${tag}`, ar: `أوقيانوسيا ${tag}` }
      const { id } = await createRecord(api, 'countries', {
        name,
        iso_code: `Z${tag.slice(-2).toUpperCase()}`,
        currency_code: 'USD',
        phone_code: '+990',
        is_active: true,
      })
      return { id, fields: { name } }
    },
  },
  {
    title: 'city',
    route: 'settings/cities',
    resource: 'cities',
    arrange: async (tag) => {
      const countries = await (await api.get('countries?per_page=1')).json()
      const name = { en: `Harbor Town ${tag}`, ar: `مدينة الميناء ${tag}` }
      const { id } = await createRecord(api, 'cities', {
        name,
        country_id: countries.data[0].id,
        is_active: true,
      })
      return { id, fields: { name } }
    },
  },
  {
    title: 'warranty period',
    route: 'warranty-periods',
    resource: 'warranty-periods',
    arrange: async (tag) => {
      const name = { en: `Extended ${tag}`, ar: `ممتد ${tag}` }
      const { id } = await createRecord(api, 'warranty-periods', {
        duration: 1000 + Math.floor(Math.random() * 90000),
        unit: 'month',
        name,
        is_active: true,
      })
      return { id, fields: { name } }
    },
  },
  {
    title: 'contact subject',
    route: 'settings/contact-subjects',
    resource: 'contact-subjects',
    arrange: async (tag) => {
      const name = { en: `Partnerships ${tag}`, ar: `الشراكات ${tag}` }
      const { id } = await createRecord(api, 'contact-subjects', { name, is_active: true })
      return { id, fields: { name } }
    },
  },
  {
    title: 'onboarding slide',
    route: 'onboardings',
    resource: 'onboardings',
    arrange: async (tag) => {
      const title = { en: `Scan receipts ${tag}`, ar: `امسح الإيصالات ${tag}` }
      const description = { en: `Keep warranties safe ${tag}`, ar: `احفظ ضماناتك ${tag}` }
      const { id } = await createRecord(api, 'onboardings', { title, description, is_active: true })
      return { id, fields: { title, description } }
    },
  },
]

for (const lang of ['en', 'ar'] as const) {
  test.describe(`view modal in ${lang.toUpperCase()} UI`, () => {
    test.beforeEach(async ({ page }) => {
      await useUiLanguage(page, lang)
    })

    for (const testCase of modalCases) {
      test(`${testCase.title} shows both translations from the show endpoint`, async ({ page }) => {
        const { id, fields } = await testCase.arrange(uid())
        const firstField = Object.values(fields)[0]

        await openViewModal(page, testCase.route, testCase.resource, id, firstField[lang])

        for (const [field, value] of Object.entries(fields)) {
          await expectBilingualInputs(page, field, value)
        }
      })
    }
  })
}

test.describe('categories', () => {
  test('edit page loads both translations and saving keeps the other locale intact', async ({ page }) => {
    await useUiLanguage(page, 'ar')
    const tag = uid()
    const name = { en: `Furniture ${tag}`, ar: `أثاث ${tag}` }
    const { id } = await createRecord(api, 'categories', {
      name,
      icon: 'fa-solid fa-couch',
      icon_bg_color: '#6366F1',
      is_active: true,
    })

    const show = waitForShowRequest(page, 'categories', id)
    await page.goto(`categories/${id}`)
    await show

    await expect(page.locator('[name="nameEn"]')).toHaveValue(name.en)
    await expect(page.locator('[name="nameAr"]')).toHaveValue(name.ar)

    await page.locator('[name="nameEn"]').fill(`Furniture Updated ${tag}`)
    const update = page.waitForResponse((r) => r.request().method() === 'POST' && r.url().endsWith(`/categories/${id}`))
    await page.getByRole('button', { name: 'حفظ' }).click()
    expect((await update).ok()).toBeTruthy()

    const saved = await showRecord(api, 'categories', id)
    expect(saved.name).toEqual({ en: `Furniture Updated ${tag}`, ar: name.ar })
  })

  test('subcategory view modal shows both translations', async ({ page }) => {
    await useUiLanguage(page, 'ar')
    const tag = uid()
    const roots = await (await api.get('categories?parent_id=null&per_page=100')).json()
    const nathriat = roots.data.find((c: { slug: string }) => c.slug === 'nathriat')
    expect(nathriat, 'seeded nathriat category').toBeTruthy()

    const name = { en: `Comics ${tag}`, ar: `قصص مصورة ${tag}` }
    const description = { en: `Graphic novels ${tag}`, ar: `روايات مصورة ${tag}` }
    const { id } = await createRecord(api, 'categories', {
      name,
      description,
      parent_id: nathriat.id,
      icon: 'fa-solid fa-book',
      icon_bg_color: '#3B82F6',
      is_active: true,
    })

    await openViewModal(page, `categories/${nathriat.id}/subcategories`, 'categories', id, name.ar)
    await expectBilingualInputs(page, 'name', name)
    await expectBilingualInputs(page, 'description', description)
  })
})

test.describe('family relations', () => {
  test('detail modal shows both translations', async ({ page }) => {
    await useUiLanguage(page, 'ar')
    const tag = uid()
    const name = { en: `Godparent ${tag}`, ar: `العراب ${tag}` }
    const { id } = await createRecord(api, 'family-relations', { name, is_active: true })

    await openViewModal(page, 'family-relations', 'family-relations', id, name.ar)

    const dialog = page.getByRole('dialog')
    await expect(dialog.getByText(name.en, { exact: true })).toBeVisible()
    await expect(dialog.getByText(name.ar, { exact: true })).toBeVisible()
  })
})

test.describe('page sections', () => {
  test('edit modal loads both translations and saving does not overwrite the other locale', async ({ page }) => {
    await useUiLanguage(page, 'ar')
    const tag = uid()
    const pages = await (await api.get('pages')).json()
    const aboutUs = pages.data.find((p: { key: string }) => p.key === 'about_us')
    expect(aboutUs, 'seeded about_us page').toBeTruthy()

    const title = { en: `Our Story ${tag}`, ar: `قصتنا ${tag}` }
    const { id } = await createRecord(api, 'page-sections', {
      page_id: aboutUs.id,
      title,
      description: { en: `<p>Story ${tag}</p>`, ar: `<p>القصة ${tag}</p>` },
      sort_order: 99,
    })

    await page.goto('settings/aboutus')
    const searchBoxes = page.locator('input[type="search"]')
    await searchBoxes.last().fill(title.ar)
    const row = page.getByRole('row').filter({ hasText: title.ar }).first()
    await expect(row).toBeVisible()

    const show = waitForShowRequest(page, 'page-sections', id)
    await row.getByTitle('تعديل').click()
    await show

    await expectBilingualInputs(page, 'title', title)

    await page.getByRole('dialog').locator('[name="titleEn"]').fill(`Our Story Updated ${tag}`)
    const update = page.waitForResponse((r) => r.request().method() === 'POST' && r.url().endsWith(`/page-sections/${id}`))
    await page.getByRole('dialog').getByRole('button', { name: 'حفظ' }).click()
    expect((await update).ok()).toBeTruthy()

    const saved = await showRecord(api, 'page-sections', id)
    expect(saved.title).toEqual({ en: `Our Story Updated ${tag}`, ar: title.ar })
  })
})

test.describe('CMS pages', () => {
  for (const lang of ['en', 'ar'] as const) {
    test(`both content editors show their full toolbar in ${lang.toUpperCase()} UI`, async ({ page }) => {
      await useUiLanguage(page, lang)
      await page.goto('settings/privacypolicy')

      const toolbars = page.locator('.ck-editor .ck-toolbar')
      await expect(toolbars).toHaveCount(2)
      for (const toolbar of await toolbars.all()) {
        // A collapsed toolbar hides every item behind the "Show more items" (⋮) button.
        await expect(toolbar.locator('.ck-toolbar__items > .ck-button').first()).toBeVisible()
        await expect(toolbar.getByRole('button', { name: /^Bold/ })).toBeVisible()
      }
    })
  }
})
