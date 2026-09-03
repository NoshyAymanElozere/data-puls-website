import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Bell,
  ChevronDown,
  HelpCircle,
  LogOut,
  Menu,
  Search,
  Settings,
  User,
} from 'lucide-react'
import { AppLogo } from '@/shared/components/AppLogo'
import { LanguageToggle } from '@/shared/components/LanguageToggle'
import { ThemeToggle } from '@/shared/components/ThemeToggle'
import { cn } from '@/shared/utils/utils'
import { Button } from '@/shared/components/button'
import { Input } from '@/shared/components/input'
import { Badge } from '@/shared/components/badge'
import { Avatar } from '@/shared/components/misc'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/shared/components/dropdown-menu'
import { useTranslation } from 'react-i18next'
import { useProfile, useLogout } from '@/features/auth/api/useAuth'
import { ChangePasswordModal } from '@/features/auth/pages/ChangePasswordModal'
import { useNotifications } from '@/features/notifications/api/useNotifications'
import { settingLinks } from '@/shared/layouts/SidebarLinks'

const routeTitles: Record<string, string> = {
  '/': 'dashboard',
  '/users': 'users',
  '/reports': 'reports',
  '/settings': 'settings',
}

const settingsSlugToLabel = Object.fromEntries(settingLinks.map((l) => [l.value, l.label]))

function getPageTitle(pathname: string): string {
  if (routeTitles[pathname]) return routeTitles[pathname]
  const settingsMatch = pathname.match(/^\/settings\/([^/]+)/)
  if (settingsMatch) return settingsSlugToLabel[settingsMatch[1]] ?? settingsMatch[1]
  return 'dashboard'
}

interface HeaderProps {
  onMenuClick?: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchValue, setSearchValue] = useState('')
  const [changePasswordOpen, setChangePasswordOpen] = useState(false)
  const { t } = useTranslation()
  const { data: admin } = useProfile()
  const { mutate: logout } = useLogout()
  const { notifications, unreadCount, markAllRead, isMarkingAll } = useNotifications()

  const titleKey = getPageTitle(location.pathname)
  const title = t(titleKey)

  const adminName = admin?.name || 'Admin User'
  const adminEmail = admin?.email || 'admin@example.com'

  return (
    <header className="flex h-14 items-center justify-between gap-4 border-b border-border bg-background/95 backdrop-blur px-6">
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <Button variant="ghost" size="icon" onClick={onMenuClick} className="md:hidden h-8 w-8" aria-label="Toggle Menu">
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <AppLogo className="h-8 max-w-[7rem] object-contain md:hidden" />
        <h1 className="text-base font-semibold">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden md:block w-64">
          <Input
            placeholder={t('search')}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="h-8 bg-muted/50"
            leftIcon={<Search className="h-3.5 w-3.5" />}
          />
        </div>

        <LanguageToggle />

        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-8 w-8">
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground font-bold">
                  {unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              {t('notifications') || 'Notifications'}
              <Badge variant="info" className="text-xs">{unreadCount} {t('new') || 'new'}</Badge>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.length === 0 ? (
              <DropdownMenuItem disabled>{t('noNotifications') || 'No notifications'}</DropdownMenuItem>
            ) : (
              notifications.map((n) => (
                <DropdownMenuItem key={n.id} className="flex-col items-start gap-0.5 py-2.5">
                  <div className="flex items-center gap-2 w-full">
                    {!n.read && <span className="h-2 w-2 rounded-full bg-primary shrink-0" />}
                    <span className={cn('text-sm', !n.read && 'font-medium')}>{n.title}</span>
                  </div>
                  <span className="ml-4 text-xs text-muted-foreground">{n.time}</span>
                </DropdownMenuItem>
              ))
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="justify-center text-primary text-xs font-medium"
              disabled={isMarkingAll || unreadCount === 0}
              onClick={() => markAllRead()}
            >
              {t('markAllRead') || 'Mark all as read'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2 h-8 px-2">
              <Avatar name={adminName} size="sm" className="h-6 w-6 text-[10px]" />
              <span className="hidden sm:block text-sm font-medium">{adminName}</span>
              <ChevronDown className="h-3 w-3 opacity-60" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>
              <p className="text-sm font-medium">{adminName}</p>
              <p className="text-xs font-normal text-muted-foreground">{adminEmail}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setChangePasswordOpen(true)}>
              <User className="h-4 w-4" /> {t('changePassword') || 'Change Password'}
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Settings className="h-4 w-4" />
                <span>{t('settings')}</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="max-h-[300px] overflow-y-auto">
                  {settingLinks.map((tab) => (
                    <DropdownMenuItem key={tab.value} onClick={() => navigate(`/settings/${tab.value}`)}>
                      {t(tab.label)}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuItem><HelpCircle className="h-4 w-4" /> Help</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => logout()}><LogOut className="h-4 w-4" /> Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ChangePasswordModal open={changePasswordOpen} onOpenChange={setChangePasswordOpen} />
    </header>
  )
}
