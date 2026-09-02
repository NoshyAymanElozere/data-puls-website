import { Badge } from '@/shared/components/badge'

import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/components/misc'

import { cn } from '@/shared/utils/utils'

import React, { useEffect, useState } from 'react'

import {

  // BarChart3,

  ChevronDown,

  ChevronLeft,

  ChevronRight,

  FolderTree,

  LayoutDashboard,

  Package,

  Settings,

  Users,

} from 'lucide-react'

import { useTranslation } from 'react-i18next'

import { NavLink, useLocation } from 'react-router-dom'

import { useProfile } from '@/features/auth/api/useAuth'

import { AppLogo } from '@/shared/components/AppLogo'
import { settingLinks } from '@/shared/layouts/SidebarLinks'



const navItems = [

  { label: 'dashboard', href: '/', icon: LayoutDashboard },

  { label: 'users', href: '/users', icon: Users },

  { label: 'subscriptionPackages', href: '/subscription-packages', icon: Package },

  { label: 'categories', href: '/categories', icon: FolderTree },

  // { label: 'reports', href: '/reports', icon: BarChart3 },

]



interface SidebarProps {

  collapsed: boolean

  onCollapse: (v: boolean) => void

}



export function Sidebar({ collapsed, onCollapse }: SidebarProps) {

  const { t, i18n } = useTranslation()

  const isRtl = i18n.language === 'ar'

  const location = useLocation()

  const isSettingsActive = location.pathname.startsWith('/settings')

  const [settingsOpen, setSettingsOpen] = useState(isSettingsActive)

  const { data: admin } = useProfile()

  const adminName = admin?.name || 'Admin User'

  const initials = adminName

    .split(' ')

    .map((n: string) => n[0])

    .join('')

    .substring(0, 2)

    .toUpperCase()



  useEffect(() => {

    if (isSettingsActive) setSettingsOpen(true)

  }, [isSettingsActive])



  return (

    <aside

      className={cn(

        'relative flex flex-col h-full bg-sidebar border-r border-sidebar-border shadow-sm transition-all duration-300 ease-in-out',

        collapsed ? 'w-16' : 'w-60'

      )}

    >

      <div className="flex h-20 items-center justify-center border-b border-sidebar-border px-4">

        <AppLogo collapsed={collapsed} framed />

      </div>



      <button

        onClick={() => onCollapse(!collapsed)}

        className={cn(

          'absolute top-16 z-10 flex h-6 w-6 items-center justify-center rounded-full',

          isRtl ? '-left-3' : '-right-3',

          'border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 shadow-md hover:bg-gray-50 dark:hover:bg-zinc-750 transition-colors'

        )}

        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}

      >

        {collapsed ? (

          isRtl ? <ChevronLeft className="h-3 w-3 text-gray-500 dark:text-gray-400" /> : <ChevronRight className="h-3 w-3 text-gray-500 dark:text-gray-400" />

        ) : (

          isRtl ? <ChevronRight className="h-3 w-3 text-gray-500 dark:text-gray-400" /> : <ChevronLeft className="h-3 w-3 text-gray-500 dark:text-gray-400" />

        )}

      </button>



      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3">

        {!collapsed && (

          <p className="px-5 mb-2 text-[11px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest">

            {t('menu')}

          </p>

        )}

        <ul className="space-y-1 px-2">

          {navItems.map((item) => (

            <NavItem key={item.href} item={item} collapsed={collapsed} />

          ))}



          {collapsed ? (

            <NavItem

              item={{ label: 'settings', href: '/settings/globalsettings', icon: Settings }}

              collapsed={collapsed}

            />

          ) : (

            <SettingsNavGroup open={settingsOpen} onToggle={() => setSettingsOpen((v) => !v)} isRtl={isRtl} />

          )}

        </ul>

      </nav>



      <div className="border-t border-gray-100 dark:border-zinc-800/80 p-3 bg-gray-50/50 dark:bg-zinc-800/10">

        <div className="flex items-center gap-2.5 rounded-xl p-2">

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-main/25 to-main/10 text-main text-sm font-bold border border-main/10 shadow-xs">

            {initials}

          </div>

          {!collapsed && (

            <div className="min-w-0 flex-1">

              <p className="truncate text-xs font-semibold text-gray-800 dark:text-gray-200">{adminName}</p>

              <p className="truncate text-[10px] text-gray-400 dark:text-zinc-500 font-semibold">Administrator</p>

            </div>

          )}

        </div>

      </div>

    </aside>

  )

}



function SettingsNavGroup({

  open,

  onToggle,

  isRtl,

}: {

  open: boolean

  onToggle: () => void

  isRtl: boolean

}) {

  const { t } = useTranslation()

  const location = useLocation()

  const isActive = location.pathname.startsWith('/settings')



  return (

    <li>

      <button

        type="button"

        onClick={onToggle}

        className={cn(

          'group flex h-10 w-full items-center gap-3.5 rounded-xl px-3.5 text-sm font-semibold transition-all duration-200 relative',

          'text-gray-500 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800/50 hover:text-gray-900 dark:hover:text-zinc-100',

          isActive && 'bg-main/10 dark:bg-main/20 text-main dark:text-main'

        )}

      >

        {isActive && (

          <span

            className={cn(

              'absolute top-2 bottom-2 w-1 rounded-full bg-main',

              isRtl ? 'right-0 rounded-l-full' : 'left-0 rounded-r-full'

            )}

          />

        )}

        <Settings className={cn('h-5 w-5 shrink-0', isActive ? 'text-main' : 'text-gray-400 dark:text-zinc-500')} />

        <span className="flex-1 truncate text-start">{t('settings')}</span>

        <ChevronDown

          className={cn('h-4 w-4 shrink-0 transition-transform text-gray-400', open && 'rotate-180')}

        />

      </button>



      {open && (

        <ul className={cn('mt-1 space-y-0.5', isRtl ? 'pr-3 mr-2 border-r border-gray-100 dark:border-zinc-800' : 'pl-3 ml-2 border-l border-gray-100 dark:border-zinc-800')}>

          {settingLinks.map((link) => {

            const href = `/settings/${link.value}`

            const label = t(link.label) || link.label

            return (

              <li key={link.value}>

                <NavLink

                  to={href}

                  className={({ isActive: subActive }) =>

                    cn(

                      'flex h-9 items-center rounded-lg px-3 text-xs font-semibold transition-colors truncate',

                      subActive

                        ? 'bg-main/10 text-main dark:text-main'

                        : 'text-gray-500 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800/50 hover:text-gray-900 dark:hover:text-zinc-100'

                    )

                  }

                >

                  {label}

                </NavLink>

              </li>

            )

          })}

        </ul>

      )}

    </li>

  )

}



function NavItem({

  item,

  collapsed,

}: {

  item: { label: string; href: string; icon: React.ElementType; badge?: number }

  collapsed: boolean

}) {

  const Icon = item.icon

  const { t, i18n } = useTranslation()

  const isRtl = i18n.language === 'ar'

  const translatedLabel = t(item.label)



  const navLink = (

    <NavLink

      to={item.href}

      end={item.href === '/'}

      className={({ isActive }) =>

        cn(

          'group flex h-10 items-center gap-3.5 rounded-xl px-3.5 text-sm font-semibold transition-all duration-200 relative',

          'text-gray-500 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800/50 hover:text-gray-900 dark:hover:text-zinc-100',

          isActive && 'bg-main/10 dark:bg-main/20 text-main dark:text-main'

        )

      }

    >

      {({ isActive }) => (

        <>

          {isActive && (

            <span

              className={cn(

                'absolute top-2 bottom-2 w-1 rounded-full bg-main',

                isRtl ? 'right-0 rounded-l-full' : 'left-0 rounded-r-full'

              )}

            />

          )}

          <Icon className={cn('h-5 w-5 shrink-0', isActive ? 'text-main' : 'text-gray-400 dark:text-zinc-500')} />

          {!collapsed && (

            <>

              <span className="flex-1 truncate">{translatedLabel}</span>

              {item.badge ? (

                <Badge className="h-5 min-w-5 px-1 text-[10px] bg-main text-white font-bold rounded-lg border-none">

                  {item.badge}

                </Badge>

              ) : null}

            </>

          )}

        </>

      )}

    </NavLink>

  )



  if (collapsed) {

    return (

      <li>

        <Tooltip delayDuration={0}>

          <TooltipTrigger asChild>{navLink}</TooltipTrigger>

          <TooltipContent side={isRtl ? 'left' : 'right'} className="font-semibold text-xs">

            {translatedLabel}

          </TooltipContent>

        </Tooltip>

      </li>

    )

  }



  return <li>{navLink}</li>

}


