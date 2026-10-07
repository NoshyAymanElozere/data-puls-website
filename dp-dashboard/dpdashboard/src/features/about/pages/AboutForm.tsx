import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAboutUs, useUpdateAboutUs, AboutUsData } from '../api/useAbout'
import {
  Globe,
  Sparkles,
  Save,
  Compass,
  Target,
  ShieldCheck,
  Search,
  Loader2,
  CheckCircle2,
  Layers,
  FileText
} from 'lucide-react'

export default function AboutForm() {
  const { t } = useTranslation()
  const { data: aboutData, isLoading, error } = useAboutUs()
  const updateAboutMutation = useUpdateAboutUs()

  const [activeLang, setActiveLang] = useState<'ar' | 'en'>('ar')
  const [activeSection, setActiveSection] = useState<'seo' | 'hero' | 'overview' | 'mission_vision' | 'values'>('hero')
  const [formData, setFormData] = useState<Partial<AboutUsData>>({})

  useEffect(() => {
    if (aboutData) {
      setFormData(JSON.parse(JSON.stringify(aboutData)))
    }
  }, [aboutData])

  const handleChange = (section: keyof AboutUsData['ar'], field: string, value: string) => {
    setFormData((prev) => {
      const copy = JSON.parse(JSON.stringify(prev || {}))
      if (!copy[activeLang]) copy[activeLang] = {}
      if (!copy[activeLang][section]) copy[activeLang][section] = {}
      copy[activeLang][section][field] = value
      return copy
    })
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.ar || !formData.en) return
    updateAboutMutation.mutate({
      ar: formData.ar,
      en: formData.en
    })
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-main" />
        <p className="text-sm font-medium text-gray-500 dark:text-zinc-400">جاري تحميل بيانات صفحة عن الشركة...</p>
      </div>
    )
  }

  if (error || !formData) {
    return (
      <div className="p-8 text-center text-red-500 dark:text-red-400">
        تعذر تحميل بيانات صفحة عن الشركة. يرجى التأكد من تشغيل الخادم بقاعدة البيانات.
      </div>
    )
  }

  const currentLangData = formData[activeLang] || ({} as any)
  const seo = currentLangData.seo || {}
  const hero = currentLangData.hero || {}
  const overview = currentLangData.overview || {}
  const mission_vision = currentLangData.mission_vision || {}
  const values = currentLangData.values || {}

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 dark:border-zinc-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-main/10 text-main font-bold">
              <Layers className="h-5 w-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              إدارة صفحة عن الشركة (About Us)
            </h1>
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400">
            تحديث وتحرير محتوى صفحة التعريف بالشركة باللغتين العربية والإنجليزية ديناميكياً
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <div className="flex bg-gray-100 dark:bg-zinc-800/80 p-1 rounded-xl border border-gray-200/60 dark:border-zinc-700/60">
            <button
              type="button"
              onClick={() => setActiveLang('ar')}
              className={`flex items-center gap-2 px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeLang === 'ar'
                  ? 'bg-main text-white shadow-sm'
                  : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Globe className="h-3.5 w-3.5" />
              العربية (AR)
            </button>
            <button
              type="button"
              onClick={() => setActiveLang('en')}
              className={`flex items-center gap-2 px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeLang === 'en'
                  ? 'bg-main text-white shadow-sm'
                  : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Globe className="h-3.5 w-3.5" />
              English (EN)
            </button>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={updateAboutMutation.isPending}
            className="flex items-center gap-2 px-5 py-2.5 bg-main hover:bg-main/90 text-white rounded-xl text-xs font-bold shadow-md shadow-main/20 hover:shadow-lg transition-all disabled:opacity-50"
          >
            {updateAboutMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            حفظ التغييرات
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-100 dark:border-zinc-800/80 pb-2">
        {[
          { id: 'hero', label: 'القسم الرئيسي (Hero)', icon: Sparkles },
          { id: 'overview', label: 'الهوية والاستعراض (Overview & Stats)', icon: Compass },
          { id: 'mission_vision', label: 'الرؤية والرسالة (Mission & Vision)', icon: Target },
          { id: 'values', label: 'المبادئ والقيم (Core Values)', icon: ShieldCheck },
          { id: 'seo', label: 'محركات البحث (SEO)', icon: Search },
        ].map((tab) => {
          const Icon = tab.icon
          const isActive = activeSection === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSection(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-main/10 text-main dark:bg-main/20 border border-main/20'
                  : 'text-gray-500 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800/50 hover:text-gray-900 dark:hover:text-zinc-200'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* SEO Section */}
        {activeSection === 'seo' && (
          <div className="bg-white dark:bg-zinc-900/60 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-zinc-800">
              <Search className="h-5 w-5 text-main" />
              <h2 className="text-base font-bold text-gray-900 dark:text-white">إعدادات محركات البحث (SEO - {activeLang.toUpperCase()})</h2>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">عنوان الصفحة (Title Tag)</label>
                <input
                  type="text"
                  value={seo.title || ''}
                  onChange={(e) => handleChange('seo', 'title', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-main/20 focus:border-main outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">الوصف المختصر (Meta Description)</label>
                <textarea
                  rows={3}
                  value={seo.description || ''}
                  onChange={(e) => handleChange('seo', 'description', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-main/20 focus:border-main outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">الكلمات المفتاحية (Meta Keywords)</label>
                <input
                  type="text"
                  value={seo.keywords || ''}
                  onChange={(e) => handleChange('seo', 'keywords', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-main/20 focus:border-main outline-none transition-all"
                />
              </div>
            </div>
          </div>
        )}

        {/* Hero Section */}
        {activeSection === 'hero' && (
          <div className="bg-white dark:bg-zinc-900/60 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-zinc-800">
              <Sparkles className="h-5 w-5 text-main" />
              <h2 className="text-base font-bold text-gray-900 dark:text-white">محتوى القسم الرئيسي (Hero Section - {activeLang.toUpperCase()})</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">الشارة العلويـة (Badge Label)</label>
                <input
                  type="text"
                  value={hero.badge || ''}
                  onChange={(e) => handleChange('hero', 'badge', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-main/20 focus:border-main outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">زر التمرير (Scroll Label)</label>
                <input
                  type="text"
                  value={hero.scroll_label || ''}
                  onChange={(e) => handleChange('hero', 'scroll_label', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-main/20 focus:border-main outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">العنوان الرئيسي - السطر 1</label>
                <input
                  type="text"
                  value={hero.title_line1 || ''}
                  onChange={(e) => handleChange('hero', 'title_line1', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-main/20 focus:border-main outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">العنوان الرئيسي - السطر 2</label>
                <input
                  type="text"
                  value={hero.title_line2 || ''}
                  onChange={(e) => handleChange('hero', 'title_line2', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-main/20 focus:border-main outline-none transition-all"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">النص الفرعي (Subtitle)</label>
                <textarea
                  rows={3}
                  value={hero.subtitle || ''}
                  onChange={(e) => handleChange('hero', 'subtitle', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-main/20 focus:border-main outline-none transition-all"
                />
              </div>
            </div>
          </div>
        )}

        {/* Overview Section */}
        {activeSection === 'overview' && (
          <div className="bg-white dark:bg-zinc-900/60 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-zinc-800">
              <Compass className="h-5 w-5 text-main" />
              <h2 className="text-base font-bold text-gray-900 dark:text-white">نظرة عامة والإحصائيات (Overview & Stats - {activeLang.toUpperCase()})</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">رمز الهوية (Identity Label)</label>
                <input
                  type="text"
                  value={overview.label || ''}
                  onChange={(e) => handleChange('overview', 'label', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-main/20 focus:border-main outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">العنوان - السطر 1</label>
                <input
                  type="text"
                  value={overview.title_line1 || ''}
                  onChange={(e) => handleChange('overview', 'title_line1', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-main/20 focus:border-main outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">العنوان - السطر 2 (مع التظليل)</label>
                <input
                  type="text"
                  value={overview.title_line2 || ''}
                  onChange={(e) => handleChange('overview', 'title_line2', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-main/20 focus:border-main outline-none transition-all"
                />
              </div>
              <div className="md:col-span-3">
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">الاقتباس البارز (Quote)</label>
                <input
                  type="text"
                  value={overview.quote || ''}
                  onChange={(e) => handleChange('overview', 'quote', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-main/20 focus:border-main outline-none transition-all"
                />
              </div>
              <div className="md:col-span-3">
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">النص التعريفي التفصيلي (Overview Paragraph)</label>
                <textarea
                  rows={4}
                  value={overview.text || ''}
                  onChange={(e) => handleChange('overview', 'text', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-main/20 focus:border-main outline-none transition-all"
                />
              </div>
            </div>

            {/* Stats Cards */}
            <div className="pt-4 border-t border-gray-100 dark:border-zinc-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400 mb-3">الإحصائيات الرئيسية (Stats)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gray-50 dark:bg-zinc-800/40 p-4 rounded-xl border border-gray-100 dark:border-zinc-800 space-y-2">
                  <label className="block text-[11px] font-bold text-gray-600 dark:text-zinc-400">الإحصائية 1 - القيمة</label>
                  <input
                    type="text"
                    value={overview.stat1_value || ''}
                    onChange={(e) => handleChange('overview', 'stat1_value', e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                  />
                  <label className="block text-[11px] font-bold text-gray-600 dark:text-zinc-400">الإحصائية 1 - الوصف</label>
                  <input
                    type="text"
                    value={overview.stat1_label || ''}
                    onChange={(e) => handleChange('overview', 'stat1_label', e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                  />
                </div>
                <div className="bg-gray-50 dark:bg-zinc-800/40 p-4 rounded-xl border border-gray-100 dark:border-zinc-800 space-y-2">
                  <label className="block text-[11px] font-bold text-gray-600 dark:text-zinc-400">الإحصائية 2 - القيمة</label>
                  <input
                    type="text"
                    value={overview.stat2_value || ''}
                    onChange={(e) => handleChange('overview', 'stat2_value', e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                  />
                  <label className="block text-[11px] font-bold text-gray-600 dark:text-zinc-400">الإحصائية 2 - الوصف</label>
                  <input
                    type="text"
                    value={overview.stat2_label || ''}
                    onChange={(e) => handleChange('overview', 'stat2_label', e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                  />
                </div>
                <div className="bg-gray-50 dark:bg-zinc-800/40 p-4 rounded-xl border border-gray-100 dark:border-zinc-800 space-y-2">
                  <label className="block text-[11px] font-bold text-gray-600 dark:text-zinc-400">الإحصائية 3 - القيمة</label>
                  <input
                    type="text"
                    value={overview.stat3_value || ''}
                    onChange={(e) => handleChange('overview', 'stat3_value', e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                  />
                  <label className="block text-[11px] font-bold text-gray-600 dark:text-zinc-400">الإحصائية 3 - الوصف</label>
                  <input
                    type="text"
                    value={overview.stat3_label || ''}
                    onChange={(e) => handleChange('overview', 'stat3_label', e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mission & Vision Section */}
        {activeSection === 'mission_vision' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mission */}
            <div className="bg-white dark:bg-zinc-900/60 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-zinc-800">
                <Target className="h-5 w-5 text-main" />
                <h2 className="text-base font-bold text-gray-900 dark:text-white">الـمهمة (Mission - {activeLang.toUpperCase()})</h2>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">عنوان المقطع (Mission Title)</label>
                <input
                  type="text"
                  value={mission_vision.mission_title || ''}
                  onChange={(e) => handleChange('mission_vision', 'mission_title', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-main/20 focus:border-main outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">العنوان البارز (Heading)</label>
                <input
                  type="text"
                  value={mission_vision.mission_heading || ''}
                  onChange={(e) => handleChange('mission_vision', 'mission_heading', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-main/20 focus:border-main outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">تفاصيل المهمة (Mission Text)</label>
                <textarea
                  rows={4}
                  value={mission_vision.mission_text || ''}
                  onChange={(e) => handleChange('mission_vision', 'mission_text', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-main/20 focus:border-main outline-none transition-all"
                />
              </div>
            </div>

            {/* Vision */}
            <div className="bg-white dark:bg-zinc-900/60 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-zinc-800">
                <Compass className="h-5 w-5 text-main" />
                <h2 className="text-base font-bold text-gray-900 dark:text-white">الـرؤية (Vision - {activeLang.toUpperCase()})</h2>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">عنوان المقطع (Vision Title)</label>
                <input
                  type="text"
                  value={mission_vision.vision_title || ''}
                  onChange={(e) => handleChange('mission_vision', 'vision_title', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-main/20 focus:border-main outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">العنوان البارز (Heading)</label>
                <input
                  type="text"
                  value={mission_vision.vision_heading || ''}
                  onChange={(e) => handleChange('mission_vision', 'vision_heading', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-main/20 focus:border-main outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">تفاصيل الرؤية (Vision Text)</label>
                <textarea
                  rows={4}
                  value={mission_vision.vision_text || ''}
                  onChange={(e) => handleChange('mission_vision', 'vision_text', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-main/20 focus:border-main outline-none transition-all"
                />
              </div>
            </div>
          </div>
        )}

        {/* Core Values Section */}
        {activeSection === 'values' && (
          <div className="bg-white dark:bg-zinc-900/60 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-zinc-800">
              <ShieldCheck className="h-5 w-5 text-main" />
              <h2 className="text-base font-bold text-gray-900 dark:text-white">المبادئ والقيم المؤسسية (Core Values - {activeLang.toUpperCase()})</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">الشارة (Label)</label>
                <input
                  type="text"
                  value={values.label || ''}
                  onChange={(e) => handleChange('values', 'label', e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-main/20 focus:border-main outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">عنوان المبادئ (Title)</label>
                <input
                  type="text"
                  value={values.title || ''}
                  onChange={(e) => handleChange('values', 'title', e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-main/20 focus:border-main outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">الوصف الفرعي (Subtitle)</label>
                <input
                  type="text"
                  value={values.subtitle || ''}
                  onChange={(e) => handleChange('values', 'subtitle', e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-main/20 focus:border-main outline-none transition-all"
                />
              </div>
            </div>

            {/* 4 Core Value Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-zinc-800">
              {[1, 2, 3, 4].map((num) => {
                const titleKey = `v${num}_title` as keyof typeof values
                const descKey = `v${num}_desc` as keyof typeof values
                return (
                  <div key={num} className="bg-gray-50 dark:bg-zinc-800/40 p-4 rounded-xl border border-gray-100 dark:border-zinc-800 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-main/20 text-main text-xs font-bold">
                        {num}
                      </span>
                      <h4 className="text-xs font-bold text-gray-800 dark:text-zinc-200">القيمة رقم {num}</h4>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 dark:text-zinc-400 mb-1">عنوان القيمة</label>
                      <input
                        type="text"
                        value={values[titleKey] || ''}
                        onChange={(e) => handleChange('values', titleKey, e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 dark:text-zinc-400 mb-1">وصف القيمة</label>
                      <textarea
                        rows={2}
                        value={values[descKey] || ''}
                        onChange={(e) => handleChange('values', descKey, e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
