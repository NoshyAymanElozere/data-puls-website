import type { Control, FieldValues, Path } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { ControlledSearchableSelect } from '@/shared/components/form-fields'
import { useActiveCities } from '@/features/settings/api/useCities'
import { getLocalizedValue } from '@/shared/utils/localized-value'

interface CitySelectProps<T extends FieldValues> {
  name?: Path<T>
  control: Control<T>
  disabled?: boolean
  required?: boolean
  label?: string
  countryId?: string | number
}

export function CitySelect<T extends FieldValues>({
  name = 'city_id' as Path<T>,
  control,
  disabled,
  required = true,
  label,
  countryId,
}: CitySelectProps<T>) {
  const { i18n, t } = useTranslation()
  const { data: cities = [] } = useActiveCities(countryId)

  const options = cities.map((c) => ({
    value: String(c.id),
    label: getLocalizedValue(c.name, i18n.language) || String(c.id),
  }))

  return (
    <ControlledSearchableSelect
      name={name}
      control={control}
      label={label !== undefined ? label : `${t('city') || 'City'} ${required ? '*' : ''}`}
      options={options}
      placeholder={t('chooseCity') || 'Choose city...'}
      disabled={disabled}
      required={required}
    />
  )
}
