export interface EventCatalogItem {
  key: string
  labelEn: string
  labelAr: string
  tokens: string[]
  hasLeadDays?: boolean
  defaultIcon?: string
  defaultColor?: string
}

export const EVENT_CATALOG: Record<string, EventCatalogItem> = {
  happy_birthday: {
    key: 'happy_birthday',
    labelEn: 'Happy Birthday',
    labelAr: 'عيد ميلاد سعيد',
    tokens: ['{user_name}'],
    defaultIcon: 'fa-solid fa-cake-candles',
    defaultColor: '#EC4899',
  },
  first_invoice_created: {
    key: 'first_invoice_created',
    labelEn: 'First Invoice Created',
    labelAr: 'إنشاء أول فاتورة',
    tokens: ['{store_name}', '{invoice_number}', '{total_amount}'],
    defaultIcon: 'fa-solid fa-receipt',
    defaultColor: '#10B981',
  },
  invoice_created: {
    key: 'invoice_created',
    labelEn: 'Invoice Created',
    labelAr: 'إنشاء فاتورة جديدة',
    tokens: ['{store_name}', '{invoice_number}', '{total_amount}'],
    defaultIcon: 'fa-solid fa-file-invoice-dollar',
    defaultColor: '#3B82F6',
  },
  subscription_created: {
    key: 'subscription_created',
    labelEn: 'Subscription Confirmed',
    labelAr: 'تأكيد الاشتراك',
    tokens: ['{package_name}', '{ends_at}'],
    defaultIcon: 'fa-solid fa-crown',
    defaultColor: '#8B5CF6',
  },
  subscription_renewed: {
    key: 'subscription_renewed',
    labelEn: 'Subscription Renewed',
    labelAr: 'تجديد الاشتراك',
    tokens: ['{package_name}', '{ends_at}'],
    defaultIcon: 'fa-solid fa-rotate',
    defaultColor: '#6366F1',
  },
  subscription_expiring_soon: {
    key: 'subscription_expiring_soon',
    labelEn: 'Subscription Expiring Soon',
    labelAr: 'قرب انتهاء الاشتراك',
    tokens: ['{package_name}', '{days}', '{ends_at}'],
    hasLeadDays: true,
    defaultIcon: 'fa-solid fa-clock',
    defaultColor: '#F59E0B',
  },
  subscription_overdue: {
    key: 'subscription_overdue',
    labelEn: 'Subscription Overdue',
    labelAr: 'تأخر تجديد الاشتراك',
    tokens: ['{package_name}', '{ends_at}'],
    defaultIcon: 'fa-solid fa-triangle-exclamation',
    defaultColor: '#EF4444',
  },
  warranty_expiring: {
    key: 'warranty_expiring',
    labelEn: 'Warranty Expiring Soon',
    labelAr: 'قرب انتهاء الضمان',
    tokens: ['{product_name}', '{days}', '{expiry_date}'],
    hasLeadDays: true,
    defaultIcon: 'fa-solid fa-shield-halved',
    defaultColor: '#F59E0B',
  },
  warranty_expired: {
    key: 'warranty_expired',
    labelEn: 'Warranty Expired',
    labelAr: 'انتهاء الضمان',
    tokens: ['{product_name}', '{expiry_date}'],
    defaultIcon: 'fa-solid fa-shield-xmark',
    defaultColor: '#EF4444',
  },
  invoice_analyzed: {
    key: 'invoice_analyzed',
    labelEn: 'Invoice AI Analyzed',
    labelAr: 'اكتمال تحليل الفاتورة',
    tokens: ['{invoice_number}'],
    defaultIcon: 'fa-solid fa-brain',
    defaultColor: '#06B6D4',
  },
  family_member_joined: {
    key: 'family_member_joined',
    labelEn: 'Family Member Joined',
    labelAr: 'انضمام فرد للعائلة',
    tokens: ['{member_name}'],
    defaultIcon: 'fa-solid fa-users',
    defaultColor: '#10B981',
  },
  general: {
    key: 'general',
    labelEn: 'General Announcement',
    labelAr: 'إعلان عام',
    tokens: ['{message}'],
    defaultIcon: 'fa-solid fa-bell',
    defaultColor: '#5B4B8A',
  },
}

export const PRESET_ICONS = [
  { icon: 'fa-solid fa-bell', label: 'Bell' },
  { icon: 'fa-solid fa-cake-candles', label: 'Cake / Birthday' },
  { icon: 'fa-solid fa-receipt', label: 'Receipt' },
  { icon: 'fa-solid fa-file-invoice-dollar', label: 'Invoice' },
  { icon: 'fa-solid fa-crown', label: 'Crown / Premium' },
  { icon: 'fa-solid fa-rotate', label: 'Renew / Refresh' },
  { icon: 'fa-solid fa-clock', label: 'Clock / Expiring' },
  { icon: 'fa-solid fa-triangle-exclamation', label: 'Warning / Alert' },
  { icon: 'fa-solid fa-shield-halved', label: 'Warranty / Shield' },
  { icon: 'fa-solid fa-shield-xmark', label: 'Expired Shield' },
  { icon: 'fa-solid fa-brain', label: 'AI Analysis' },
  { icon: 'fa-solid fa-users', label: 'Family / Users' },
  { icon: 'fa-solid fa-star', label: 'Star / Favorite' },
  { icon: 'fa-solid fa-envelope', label: 'Message' },
  { icon: 'fa-solid fa-circle-check', label: 'Success' },
  { icon: 'fa-solid fa-gift', label: 'Gift / Offer' },
]

export const PRESET_COLORS = [
  '#EC4899', // Pink
  '#10B981', // Emerald
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#06B6D4', // Cyan
  '#6366F1', // Indigo
  '#14B8A6', // Teal
  '#5B4B8A', // Herz Purple
]
