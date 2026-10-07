import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/shared/components/card'
import { Button } from '@/shared/components/button'
import { GenericDataGrid } from '@/shared/components/GenericDataGrid'
import { SearchInput } from '@/shared/components/input'
import ModalStatus from '@/shared/components/modal-status'
import { Mail, RefreshCw, Search, Inbox, MapPin, Phone, User, Calendar, MessageSquare } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/shared/components/dialog'
import { useContactList, useDeleteContact, type Contact } from '../api/useContact'
import { getContactColumnDefs } from './ColumnDefs'

export default function ContactList() {
  const { t, i18n } = useTranslation()
  const [search, setSearch] = useState('')
  const isRtl = i18n.language === 'ar'

  const [viewingItem, setViewingItem] = useState<Contact | null>(null)
  const [deletingItem, setDeletingItem] = useState<Contact | null>(null)

  const { data: items = [], isLoading, refetch, isRefetching } = useContactList()
  const deleteMutation = useDeleteContact()

  // Filter contacts client-side
  const filteredItems = useMemo(() => {
    if (!search) return items
    const query = search.toLowerCase()
    return items.filter(
      (item) =>
        item.name?.toLowerCase().includes(query) ||
        item.email?.toLowerCase().includes(query) ||
        item.subject?.toLowerCase().includes(query) ||
        item.message?.toLowerCase().includes(query)
    )
  }, [items, search])

  const columnDefs = getContactColumnDefs({
    t,
    onViewClick: (item) => setViewingItem(item),
    onDeleteClick: (item) => setDeletingItem(item)
  })

  return (
    <div className="space-y-6 animate-fade-in" dir={isRtl ? 'rtl' : 'ltr'}>

      {/* HERO MODULE BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0b1021] via-[#131c35] to-[#4361ee] text-white p-6 md:p-8 shadow-md">
        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-white/10 blur-2xl transform translate-x-10 -translate-y-10" />
        <div className="absolute left-1/3 bottom-0 h-32 w-32 rounded-full bg-brand-500/20 blur-xl" />

        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold backdrop-blur-xs select-none">
              <Mail className="h-3.5 w-3.5 text-blue-300" />
              <span>{isRtl ? 'صندوق وارد اتصل بنا' : 'Contact Form Submissions'}</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight">
              {isRtl ? 'رسائل واستفسارات التواصل' : 'Contact Messages'}
            </h1>
            <p className="text-gray-200 text-sm max-w-xl">
              {isRtl
                ? 'متابعة وإدارة جميع الرسائل والاستفسارات الموجهة من نموذج التواصل للمكاتب والفروع المختلفة.'
                : 'Monitor, view, and respond to incoming customer inquiries and branch contact form dispatches.'}
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => refetch()}
              disabled={isLoading || isRefetching}
              className="bg-white/10 border-white/20 hover:bg-white/20 text-white rounded-2xl h-12 w-12"
            >
              <RefreshCw className={`h-5 w-5 ${isRefetching ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </div>

      {/* QUICK STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border/40 shadow-xs rounded-2xl p-5 flex items-center gap-4 bg-card/60 backdrop-blur-xs">
          <div className="p-3.5 rounded-2xl bg-[#4361ee]/10 text-[#4361ee]">
            <Inbox className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-muted-foreground block font-bold uppercase tracking-wider">
              {isRtl ? 'إجمالي الرسائل' : 'Total Messages'}
            </span>
            <span className="text-2xl font-black text-foreground">{items.length}</span>
          </div>
        </Card>

        <Card className="border-border/40 shadow-xs rounded-2xl p-5 flex items-center gap-4 bg-card/60 backdrop-blur-xs">
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Search className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-muted-foreground block font-bold uppercase tracking-wider">
              {isRtl ? 'النتائج المفلترة' : 'Filtered Results'}
            </span>
            <span className="text-2xl font-black text-foreground">{filteredItems.length}</span>
          </div>
        </Card>

        <Card className="border-border/40 shadow-xs rounded-2xl p-5 flex items-center gap-4 bg-card/60 backdrop-blur-xs">
          <div className="p-3.5 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Mail className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-muted-foreground block font-bold uppercase tracking-wider">
              {isRtl ? 'الحالة العامة' : 'Operational Status'}
            </span>
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md mt-1 inline-block">
              {isRtl ? 'مستقر ومتصل' : 'Active & Synced'}
            </span>
          </div>
        </Card>
      </div>

      {/* DATA GRID & FILTER PANEL */}
      <Card className="border-border/40 shadow-sm rounded-3xl overflow-hidden bg-card">
        <CardContent className="p-6 space-y-4">
          <div className="flex max-w-sm">
            <SearchInput
              placeholder={isRtl ? 'بحث بالاسم، الإيميل، أو الموضوع...' : 'Search by name, email, subject...'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <GenericDataGrid
            rowData={filteredItems}
            columnDefs={columnDefs}
            rowHeight={60}
            headerHeight={50}
            loading={isLoading}
            isServerSide={false}
          />
        </CardContent>
      </Card>

      {/* View Message Details Dialog */}
      <Dialog open={!!viewingItem} onOpenChange={(open) => !open && setViewingItem(null)}>
        <DialogContent size="md" className="rounded-3xl border border-border/80 shadow-2xl backdrop-blur-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Mail className="h-5 w-5 text-[#4361ee]" />
              {isRtl ? 'تفاصيل الرسالة' : 'Contact Message Details'}
            </DialogTitle>
          </DialogHeader>

          {viewingItem && (
            <div className="space-y-6 py-2">
              {/* Sender & Contact Meta info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/40 p-4 rounded-2xl border border-border/60">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-brand-500" />
                    {isRtl ? 'اسم المرسل' : 'Sender Name'}
                  </span>
                  <p className="font-bold text-foreground text-sm">{viewingItem.name}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-brand-500" />
                    {isRtl ? 'البريد الإلكتروني' : 'Email Address'}
                  </span>
                  <a href={`mailto:${viewingItem.email}`} className="font-medium text-brand-600 dark:text-brand-400 text-sm hover:underline block">
                    {viewingItem.email}
                  </a>
                </div>

                {viewingItem.phone && (
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-brand-500" />
                      {isRtl ? 'رقم الهاتف' : 'Phone Number'}
                    </span>
                    <a href={`tel:${viewingItem.phone}`} className="font-medium text-foreground text-sm hover:underline block">
                      {viewingItem.phone}
                    </a>
                  </div>
                )}

                <div className="space-y-1">
                  <span className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-brand-500" />
                    {isRtl ? 'تاريخ الاستلام' : 'Received Date'}
                  </span>
                  <p className="font-medium text-muted-foreground text-xs font-mono">
                    {viewingItem.createdAt ? new Date(viewingItem.createdAt).toLocaleString() : '-'}
                  </p>
                </div>
              </div>

              {/* Subject & Message Content Body */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="h-3.5 w-3.5 text-brand-500" />
                  {isRtl ? 'موضوع الرسالة' : 'Subject'}
                </span>
                <p className="font-bold text-foreground text-base bg-card p-3 rounded-xl border border-border/60">
                  {viewingItem.subject || (isRtl ? 'استفسار عام' : 'General Inquiry')}
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  {isRtl ? 'نص الرسالة الكامل' : 'Message Body'}
                </span>
                <div className="bg-card p-4 rounded-2xl border border-border/80 text-sm text-foreground leading-relaxed whitespace-pre-wrap min-h-[120px] max-h-[250px] overflow-y-auto">
                  {viewingItem.message}
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setViewingItem(null)}
              className="rounded-xl h-11"
            >
              {isRtl ? 'إغلاق' : 'Close'}
            </Button>
            {viewingItem?.email && (
              <a href={`mailto:${viewingItem.email}?subject=RE: ${encodeURIComponent(viewingItem.subject || 'Data Pulse Inquiry')}`}>
                <Button type="button" className="bg-main hover:bg-main/90 text-white rounded-xl h-11 px-6 font-bold flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {isRtl ? 'الرد عبر البريد' : 'Reply via Email'}
                </Button>
              </a>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deletion Confirmation Modal */}
      <ModalStatus
        open={!!deletingItem}
        onOpenChange={(v) => !v && setDeletingItem(null)}
        title={isRtl ? 'حذف الرسالة' : 'Delete Message'}
        description={isRtl ? 'هل أنت تأكد من رغبتك في حذف هذه الرسالة؟ لا يمكن التراجع عن هذا الإجراء.' : 'Are you sure you want to delete this contact message? This action cannot be undone.'}
        agreeLabel={t('delete') || 'Delete'}
        cancelLabel={t('cancel') || 'Cancel'}
        onAgreeButtonClick={() => {
          if (deletingItem && deletingItem._id) {
            deleteMutation.mutate(deletingItem._id, {
              onSuccess: () => setDeletingItem(null)
            })
          }
        }}
        onCancelButtonClick={() => setDeletingItem(null)}
        loading={deleteMutation.isPending}
        type="delete"
      />
    </div>
  )
}
