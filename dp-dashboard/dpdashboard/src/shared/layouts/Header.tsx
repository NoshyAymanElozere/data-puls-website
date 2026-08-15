import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Bell, Search, Sun, Moon, Monitor, ChevronDown,
  LogOut, User, Settings, HelpCircle, Maximize2, Menu, Globe
} from 'lucide-react'
import { cn } from '@/shared/utils/utils'
import { Button } from '@/shared/components/button'
import { Input } from '@/shared/components/input'
import { Badge } from '@/shared/components/badge'
import { Avatar } from '@/shared/components/misc'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
  DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent, DropdownMenuPortal,
} from '@/shared/components/dropdown-menu'
import { useTheme } from '@/shared/hooks/useTheme'
import { useTranslation } from 'react-i18next'
import { useProfile, useLogout } from '@/features/auth/api/useAuth'

const routeTitles: Record<string, string> = {
  '/': 'dashboard',
  '/products': 'products',
  '/inventory': 'inventory',
  '/orders': 'orders',
  '/customers': 'customers',
  '/suppliers': 'suppliers',
  '/invoices': 'invoices',
  '/payments': 'payments',
  '/reports': 'reports',
  '/analytics': 'analytics',
  '/settings': 'settings',
  '/help': 'help',
}

const mockNotifications = [
  { id: 1, title: 'New order #ORD-1042', time: '2 min ago', read: false },
  { id: 2, title: 'Low stock: Widget Pro', time: '15 min ago', read: false },
  { id: 3, title: 'Payment received $2,400', time: '1 hr ago', read: true },
  { id: 4, title: 'Customer signup: Acme Corp', time: '3 hr ago', read: true },
]

interface HeaderProps {
  onMenuClick?: () => void
}

const settingsTabs = [
  { value: 'countries', label: 'countries' },
  { value: 'cities', label: 'cities' },
  { value: 'currencies', label: 'currencies' },
  { value: 'triptypes', label: 'tripTypes' },
  { value: 'travelertypes', label: 'travelerTypes' },
  { value: 'hotelcategories', label: 'hotelCategories' },
  { value: 'groundservices', label: 'groundServices' },
  { value: 'facilities', label: 'facilities' },
  { value: 'propertytypes', label: 'propertyTypes' },
  { value: 'ratings', label: 'ratings' },
  { value: 'aboutus', label: 'aboutUs' },
  { value: 'privacypolicy', label: 'privacyPolicy' },
  { value: 'termsconditions', label: 'termsConditions' },
  { value: 'support', label: 'support' },
  { value: 'footer', label: 'footer' }
]

export function Header({ onMenuClick }: HeaderProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { theme, setTheme } = useTheme()
  const [searchValue, setSearchValue] = useState('')
  const { t, i18n } = useTranslation()
  const { data: admin } = useProfile()
  const { mutate: logout } = useLogout()

  const titleKey = routeTitles[location.pathname] 
  const title = t(titleKey)
  const unreadCount = mockNotifications.filter((n) => !n.read).length

  const ThemeIcon = theme === 'dark' ? Moon : theme === 'light' ? Sun : Monitor

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang)
    localStorage.setItem('lang', lang)
  }

  const adminName = admin?.name || 'Admin User'
  const adminEmail = admin?.email || 'admin@example.com'

  return (
    <header className="flex h-14 items-center justify-between gap-4 border-b border-border bg-background/95 backdrop-blur px-6">
      {/* Left: Mobile Toggle & Page title */}
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="md:hidden h-8 w-8 hover:bg-accent"
            aria-label="Toggle Menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <h1 className="text-base font-semibold">{title}</h1>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="hidden md:block w-64">
          <Input
            placeholder={t('search')}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="h-8 bg-muted/50"
            leftIcon={<Search className="h-3.5 w-3.5" />}
          />
        </div>

        {/* Language switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 gap-1">
              <Globe className="h-4 w-4" />
              <span className="text-xs uppercase font-bold">{i18n.language}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Language / اللغة</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleLanguageChange('en')}>
              English
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleLanguageChange('ar')}>
              العربية
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme toggle */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ThemeIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Theme</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setTheme('light')}>
              <Sun className="h-4 w-4" /> Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('dark')}>
              <Moon className="h-4 w-4" /> Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('system')}>
              <Monitor className="h-4 w-4" /> System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
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
              Notifications
              <Badge variant="info" className="text-xs">{unreadCount} new</Badge>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {mockNotifications.map((n) => (
              <DropdownMenuItem key={n.id} className="flex-col items-start gap-0.5 py-2.5">
                <div className="flex items-center gap-2 w-full">
                  {!n.read && <span className="h-2 w-2 rounded-full bg-primary shrink-0" />}
                  <span className={cn('text-sm', !n.read && 'font-medium')}>{n.title}</span>
                </div>
                <span className="ml-4 text-xs text-muted-foreground">{n.time}</span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-primary text-xs font-medium">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User menu */}
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
            <DropdownMenuItem><User className="h-4 w-4" /> Profile</DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Settings className="h-4 w-4" />
                <span>{t('settings')}</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="max-h-[300px] overflow-y-auto">
                  {settingsTabs.map((tab) => (
                    <DropdownMenuItem
                      key={tab.value}
                      onClick={() => navigate(`/settings/${tab.value}`)}
                    >
                      {t(tab.label)}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuItem><HelpCircle className="h-4 w-4" /> Help</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem danger onClick={() => logout()}><LogOut className="h-4 w-4" /> Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
