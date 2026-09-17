import React, { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, UserCheck, X, Loader2, Phone, Mail } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import api from '@/shared/services/axios'
import type { LaravelPaginatedResponse } from '@/shared/types/laravel'
import type { UserListItem } from '@/features/users/api/useUsers'
import { Button } from '@/shared/components/button'

interface UserAutocompleteSelectProps {
  selectedUser: UserListItem | null
  onSelectUser: (user: UserListItem | null) => void
  disabled?: boolean
}

export const UserAutocompleteSelect: React.FC<UserAutocompleteSelectProps> = ({
  selectedUser,
  onSelectUser,
  disabled = false,
}) => {
  const { t, i18n } = useTranslation()
  const isRtl = i18n.language === 'ar'
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchTerm])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const { data: usersData, isLoading } = useQuery({
    queryKey: ['users-autocomplete', debouncedSearch],
    queryFn: async () => {
      const res = await api.get<LaravelPaginatedResponse<UserListItem>>('/users', {
        params: {
          search: debouncedSearch,
          status: 'active',
          per_page: 20,
        },
      })
      return res.data
    },
    enabled: isOpen,
    staleTime: 60_000,
  })

  const users = usersData?.data ?? []

  if (selectedUser) {
    const initials = (selectedUser.name || 'User')
      .split(' ')
      .map((w) => w[0])
      .join('')
      .substring(0, 2)
      .toUpperCase()

    return (
      <div className="p-4 rounded-xl border border-main/30 bg-main/5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-10 w-10 shrink-0 rounded-full bg-main/20 text-main font-bold flex items-center justify-center text-sm border border-main/30">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-foreground truncate">
                {selectedUser.name || 'Unnamed User'}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-main/10 text-main font-mono font-bold">
                #{selectedUser.id}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5 font-mono">
              <span className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {selectedUser.phone}
              </span>
              {selectedUser.email && (
                <span className="flex items-center gap-1 truncate">
                  <Mail className="h-3 w-3" />
                  {selectedUser.email}
                </span>
              )}
            </div>
          </div>
        </div>

        {!disabled && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onSelectUser(null)}
            className="text-xs text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 h-8 px-2.5 gap-1"
          >
            <X className="h-3.5 w-3.5" />
            {t('changeUser')}
          </Button>
        )}
      </div>
    )
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          disabled={disabled}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={t('searchUserPlaceholder')}
          className="w-full h-11 px-4 ps-10 rounded-xl border border-border/80 bg-card text-xs font-semibold placeholder:text-muted-foreground/70 focus:outline-hidden focus:ring-2 focus:ring-main/20 focus:border-main transition-all"
        />
        <div
          className={`absolute top-1/2 -translate-y-1/2 text-muted-foreground ${
            isRtl ? 'right-3.5' : 'left-3.5'
          }`}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-main" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1.5 max-h-64 overflow-y-auto rounded-xl border border-border/80 bg-card shadow-xl p-1.5 space-y-1">
          {isLoading && users.length === 0 ? (
            <div className="py-6 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-main" />
              <span>{t('loading')}</span>
            </div>
          ) : users.length === 0 ? (
            <div className="py-6 text-center text-xs text-muted-foreground">
              {t('noResultsFound') || 'No users found matching query.'}
            </div>
          ) : (
            users.map((user) => {
              const initials = (user.name || 'User')
                .split(' ')
                .map((w) => w[0])
                .join('')
                .substring(0, 2)
                .toUpperCase()

              return (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => {
                    onSelectUser(user)
                    setIsOpen(false)
                    setSearchTerm('')
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-muted/70 transition-colors text-start group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="h-8 w-8 shrink-0 rounded-full bg-main/10 text-main font-bold flex items-center justify-center text-xs group-hover:bg-main group-hover:text-white transition-colors">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-foreground truncate">
                          {user.name || 'Unnamed User'}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          #{user.id}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground font-mono truncate">
                        {user.phone} {user.email ? `• ${user.email}` : ''}
                      </p>
                    </div>
                  </div>

                  <UserCheck className="h-4 w-4 text-muted-foreground/50 opacity-0 group-hover:opacity-100 text-main transition-opacity shrink-0" />
                </button>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}
