import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Calendar,
  CheckCircle2,
  Edit2,
  ExternalLink,
  Eye,
  Lock,
  Phone,
  Receipt,
  Shield,
  Trash2,
  User as UserIcon,
  Users2,
  XCircle,
} from 'lucide-react'
import { Badge } from '@/shared/components/badge'
import { Button } from '@/shared/components/button'
import { Avatar } from '@/shared/components/misc'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shared/components/dialog'
import ModalStatus from '@/shared/components/modal-status'
import { resolveMediaUrl } from '@/shared/utils/media-url'
import {
  useUnlinkFamilyMember,
  useUpdateFamilyMemberPermissions,
  useUserFamilyMembers,
} from '../api/useUserFamilyMembers'
import type { FamilyMemberItem, FamilyMemberPermissions } from '../types/family'
import type { UserDetail } from '../api/useUsers'
import { UserInvoicesPanel } from './UserInvoicesPanel'

interface UserFamilyMembersPanelProps {
  user: UserDetail
  onSelectUser?: (userId: number) => void
}

export function UserFamilyMembersPanel({ user, onSelectUser }: UserFamilyMembersPanelProps) {
  const { t, i18n } = useTranslation()
  const isRtl = i18n.language === 'ar'
  const { data: familyMembers = [], isLoading } = useUserFamilyMembers(user.id)

  const [inspectingMember, setInspectingMember] = useState<FamilyMemberItem | null>(null)
  const [isInvoicesModalOpen, setIsInvoicesModalOpen] = useState(false)

  // Edit Permissions State
  const [editingPermissionsMember, setEditingPermissionsMember] = useState<FamilyMemberItem | null>(null)
  const [tempPermissions, setTempPermissions] = useState<FamilyMemberPermissions>({
    view_family_invoices: false,
    delete_own_invoices: false,
    delete_family_invoices: false,
  })

  // Unlink Member State
  const [unlinkingMember, setUnlinkingMember] = useState<FamilyMemberItem | null>(null)

  const updatePermissionsMutation = useUpdateFamilyMemberPermissions(user.id)
  const unlinkMutation = useUnlinkFamilyMember(user.id)

  const getRelationName = (rel: FamilyMemberItem['family_relation']) => {
    if (!rel) return null
    if (typeof rel.name === 'string') return rel.name
    return isRtl ? rel.name.ar || rel.name.en : rel.name.en || rel.name.ar
  }

  const parentRelationName = user.family_relation ? (
    typeof user.family_relation.name === 'string'
      ? user.family_relation.name
      : isRtl
        ? user.family_relation.name.ar || user.family_relation.name.en
        : user.family_relation.name.en || user.family_relation.name.ar
  ) : null

  const handleOpenEditPermissions = (member: FamilyMemberItem) => {
    setEditingPermissionsMember(member)
    setTempPermissions({
      view_family_invoices: !!member.permissions?.view_family_invoices,
      delete_own_invoices: !!member.permissions?.delete_own_invoices,
      delete_family_invoices: !!member.permissions?.delete_family_invoices,
    })
  }

  const handleSavePermissions = () => {
    if (!editingPermissionsMember) return
    updatePermissionsMutation.mutate(
      {
        memberId: editingPermissionsMember.id,
        permissions: tempPermissions,
      },
      {
        onSuccess: () => setEditingPermissionsMember(null),
      }
    )
  }

  const handleUnlink = () => {
    if (!unlinkingMember) return
    unlinkMutation.mutate(unlinkingMember.id, {
      onSuccess: () => setUnlinkingMember(null),
    })
  }

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* 1. Parent Account Owner Banner (If user is a member of someone else's account) */}
      {(user.account_owner || user.account_owner_id) && (
        <div className="relative overflow-hidden rounded-2xl border border-main/30 bg-gradient-to-r from-main/10 via-main/5 to-transparent p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar
                  src={resolveMediaUrl(user.account_owner?.avatar_url)}
                  alt={user.account_owner?.name || 'Account Owner'}
                  className="h-14 w-14 rounded-2xl border-2 border-main/40 shadow-sm"
                />
                <div className="absolute -bottom-1 -right-1 bg-main text-white rounded-full p-1 shadow-xs">
                  <Shield className="h-3 w-3" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge className="bg-main text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                    {t('parentAccount')}
                  </Badge>
                  {parentRelationName && (
                    <Badge variant="outline" className="text-[10px] font-semibold">
                      {parentRelationName}
                    </Badge>
                  )}
                </div>
                <h4 className="text-base font-black text-foreground">
                  {user.account_owner?.name || `${t('accountOwner')} (#${user.account_owner_id})`}
                </h4>
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  {user.account_owner?.email && <span>{user.account_owner.email}</span>}
                  {user.account_owner?.phone && (
                    <>
                      <span>•</span>
                      <span dir="ltr">{user.account_owner.phone}</span>
                    </>
                  )}
                </p>
              </div>
            </div>

            {onSelectUser && user.account_owner_id && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSelectUser(user.account_owner_id!)}
                className="rounded-xl border-main/40 text-main hover:bg-main/10 font-bold text-xs h-9 px-4 gap-2 shrink-0 cursor-pointer"
              >
                <span>{t('viewParentAccount')}</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>
      )}

      {/* 2. Family Members Header & Count */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-main/10 text-main">
            <Users2 className="h-4 w-4" />
          </div>
          <h3 className="text-sm font-bold text-foreground">
            {t('familyMembers')}
          </h3>
        </div>
        <span className="text-xs font-bold text-muted-foreground">
          {familyMembers.length} {t('records')}
        </span>
      </div>

      {/* 3. Family Members Grid / Cards */}
      {isLoading ? (
        <div className="py-12 flex flex-col items-center justify-center gap-2">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-main border-t-transparent" />
          <span className="text-xs font-semibold text-muted-foreground">
            {isRtl ? 'جاري تحميل أفراد العائلة...' : 'Loading family members...'}
          </span>
        </div>
      ) : familyMembers.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/70 p-12 text-center flex flex-col items-center justify-center text-muted-foreground bg-muted/10">
          <Users2 className="h-10 w-10 opacity-30 mb-2" />
          <p className="text-sm font-bold text-foreground mb-1">{t('noFamilyMembers')}</p>
          <p className="text-xs text-muted-foreground max-w-sm">
            {isRtl
              ? 'لم يقم هذا المستخدم بإضافة أفراد إلى عائلته من خلال التطبيق حتى الآن.'
              : 'This account owner has not added any family members via the mobile application yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {familyMembers.map((member) => {
            const relName = getRelationName(member.family_relation)
            return (
              <div
                key={member.id}
                className="flex flex-col justify-between rounded-2xl border border-border/60 bg-card p-5 shadow-xs hover:border-main/40 transition-all space-y-4"
              >
                {/* Top: Avatar, Name, Phone & Status */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={resolveMediaUrl(member.avatar_url)}
                      alt={member.name}
                      className="h-12 w-12 rounded-xl border border-border/50 shadow-xs"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-black text-foreground">{member.name}</h4>
                        {relName && (
                          <Badge variant="secondary" className="text-[10px] font-bold py-0 px-2 rounded-md">
                            {relName}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5" dir="ltr">
                        <Phone className="h-3 w-3 opacity-60" />
                        <span>{member.phone}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Badge
                      variant={member.status === 'active' ? 'default' : 'destructive'}
                      className={
                        member.status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px]'
                          : 'text-[10px]'
                      }
                    >
                      {member.status === 'active' ? t('active') : t('suspended')}
                    </Badge>

                    <button
                      type="button"
                      onClick={() => setUnlinkingMember(member)}
                      title={t('unlinkMember')}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Middle: Permissions Chips & Quick Edit */}
                <div className="space-y-2 bg-muted/30 p-3 rounded-xl border border-border/40">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                      <Lock className="h-3 w-3" /> {t('permissions')}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleOpenEditPermissions(member)}
                      className="text-[11px] font-bold text-main hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Edit2 className="h-3 w-3" />
                      <span>{t('editPermissions')}</span>
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {/* Permission 1: view_family_invoices */}
                    <div
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${
                        member.permissions?.view_family_invoices
                          ? 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20'
                          : 'bg-muted text-muted-foreground/60 border-transparent opacity-60'
                      }`}
                    >
                      {member.permissions?.view_family_invoices ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5 opacity-50" />
                      )}
                      <span>{t('viewFamilyInvoices')}</span>
                    </div>

                    {/* Permission 2: delete_own_invoices */}
                    <div
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${
                        member.permissions?.delete_own_invoices
                          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20'
                          : 'bg-muted text-muted-foreground/60 border-transparent opacity-60'
                      }`}
                    >
                      {member.permissions?.delete_own_invoices ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5 opacity-50" />
                      )}
                      <span>{t('deleteOwnInvoices')}</span>
                    </div>

                    {/* Permission 3: delete_family_invoices */}
                    <div
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${
                        member.permissions?.delete_family_invoices
                          ? 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20'
                          : 'bg-muted text-muted-foreground/60 border-transparent opacity-60'
                      }`}
                    >
                      {member.permissions?.delete_family_invoices ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5 opacity-50" />
                      )}
                      <span>{t('deleteFamilyInvoices')}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom: Dates & Action Buttons */}
                <div className="flex items-center justify-between pt-1 border-t border-border/40 text-xs">
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Calendar className="h-3 w-3 opacity-60" />
                    <span>{member.created_at}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setInspectingMember(member)
                        setIsInvoicesModalOpen(true)
                      }}
                      className="h-8 px-3 rounded-lg text-xs font-bold text-main border-main/30 hover:bg-main/10 gap-1.5"
                    >
                      <Receipt className="h-3.5 w-3.5" />
                      <span>{t('invoices')}</span>
                    </Button>

                    {onSelectUser && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onSelectUser(member.id)}
                        className="h-8 px-3 rounded-lg text-xs font-bold gap-1"
                      >
                        <UserIcon className="h-3.5 w-3.5" />
                        <span>{t('viewMemberProfile')}</span>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Sub-modal: Member Invoices Viewer */}
      {inspectingMember && (
        <Dialog open={isInvoicesModalOpen} onOpenChange={setIsInvoicesModalOpen}>
          <DialogContent size="2xl" className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-lg font-bold">
                <Receipt className="h-5 w-5 text-main" />
                <span>
                  {t('invoices')}: {inspectingMember.name}
                </span>
                <span className="text-xs font-normal text-muted-foreground">
                  ({inspectingMember.phone})
                </span>
              </DialogTitle>
            </DialogHeader>

            <div className="py-2">
              <UserInvoicesPanel userId={inspectingMember.id} />
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Permissions Dialog */}
      {editingPermissionsMember && (
        <Dialog open={!!editingPermissionsMember} onOpenChange={(v) => !v && setEditingPermissionsMember(null)}>
          <DialogContent size="sm">
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center gap-2">
                <Lock className="h-4 w-4 text-main" />
                <span>
                  {t('editPermissions')}: {editingPermissionsMember.name}
                </span>
              </DialogTitle>
            </DialogHeader>

            <div className="py-3 space-y-3" dir={isRtl ? 'rtl' : 'ltr'}>
              <label className="flex items-center justify-between p-3 rounded-xl border border-border/60 bg-muted/20 cursor-pointer hover:bg-muted/40 transition-colors">
                <span className="text-xs font-bold text-foreground">{t('viewFamilyInvoices')}</span>
                <input
                  type="checkbox"
                  checked={tempPermissions.view_family_invoices}
                  onChange={(e) =>
                    setTempPermissions((prev) => ({
                      ...prev,
                      view_family_invoices: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded border-border text-main focus:ring-main"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-border/60 bg-muted/20 cursor-pointer hover:bg-muted/40 transition-colors">
                <span className="text-xs font-bold text-foreground">{t('deleteOwnInvoices')}</span>
                <input
                  type="checkbox"
                  checked={tempPermissions.delete_own_invoices}
                  onChange={(e) =>
                    setTempPermissions((prev) => ({
                      ...prev,
                      delete_own_invoices: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded border-border text-main focus:ring-main"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-border/60 bg-muted/20 cursor-pointer hover:bg-muted/40 transition-colors">
                <span className="text-xs font-bold text-foreground">{t('deleteFamilyInvoices')}</span>
                <input
                  type="checkbox"
                  checked={tempPermissions.delete_family_invoices}
                  onChange={(e) =>
                    setTempPermissions((prev) => ({
                      ...prev,
                      delete_family_invoices: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded border-border text-main focus:ring-main"
                />
              </label>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingPermissionsMember(null)}
                className="h-9 px-4 rounded-xl text-xs font-bold"
              >
                {t('cancel')}
              </Button>
              <Button
                size="sm"
                onClick={handleSavePermissions}
                disabled={updatePermissionsMutation.isPending}
                className="h-9 px-4 rounded-xl text-xs font-bold bg-main hover:bg-main/90 text-white"
              >
                {updatePermissionsMutation.isPending ? (isRtl ? 'جاري الحفظ...' : 'Saving...') : t('save')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Unlink Member Confirmation Modal */}
      <ModalStatus
        open={!!unlinkingMember}
        onOpenChange={(v) => !v && setUnlinkingMember(null)}
        title={t('unlinkMember')}
        description={t('unlinkMemberConfirmation')}
        agreeLabel={t('unlinkMember')}
        cancelLabel={t('cancel')}
        onAgreeButtonClick={handleUnlink}
        onCancelButtonClick={() => setUnlinkingMember(null)}
        loading={unlinkMutation.isPending}
        type="delete"
      />
    </div>
  )
}
