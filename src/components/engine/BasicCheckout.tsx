import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { authService } from '@/services/auth'
import { BAAZEX_ACCOUNT_URL } from '@/utils/constants'
import { ExternalLink } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function BasicCheckout() {
  const { user, refresh } = useAuth()
  const { push } = useToast()
  const navigate = useNavigate()
  const savedBaazexId = user?.baazexId ?? ''
  const [baazexId, setBaazexId] = useState(savedBaazexId)
  const [syncedBaazexId, setSyncedBaazexId] = useState(savedBaazexId)
  const [busy, setBusy] = useState(false)
  if (savedBaazexId !== syncedBaazexId) {
    setSyncedBaazexId(savedBaazexId)
    setBaazexId(savedBaazexId)
  }

  async function save() {
    if (!user) {
      navigate('/login', { state: { from: '/engine' } })
      return
    }
    const trimmed = baazexId.trim()
    if (!trimmed) {
      push('error', 'Enter your Baazex ID.')
      return
    }
    setBusy(true)
    try {
      const saved = await authService.updateProfile(user.id, { baazexId: trimmed })
      if (!saved) throw new Error('Could not save the Baazex ID.')
      await refresh()
      push('success', 'Baazex ID saved')
    } catch (error) {
      push('error', error instanceof Error ? error.message : 'Could not save the Baazex ID.')
    } finally {
      setBusy(false)
    }
  }

  if (!user) {
    return (
      <div className="space-y-4">
        <p className="text-sm leading-6 text-ink/80">Sign in to save a Baazex ID. Five engine questions are included.</p>
        <Button className="w-full" onClick={() => navigate('/login', { state: { from: '/engine' } })}>
          Sign in
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-sm leading-6 text-ink/80">
        Five engine questions are included. A Baazex deposit adds 15% of the amount as questions. A $100 deposit adds 15 questions.
      </p>
      <a
        href={BAAZEX_ACCOUNT_URL}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-white text-sm font-semibold text-accent ring-1 ring-bright/50 transition hover:bg-bright/10"
        target="_blank"
        rel="noreferrer"
      >
        Open a Baazex account
        <ExternalLink className="h-4 w-4" aria-hidden />
      </a>
      <div className="rounded-2xl bg-white p-3 ring-1 ring-line">
        <Input
          label="Baazex ID"
          placeholder="Your Baazex client ID"
          value={baazexId}
          autoComplete="off"
          className="bg-canvas"
          onChange={(event) => setBaazexId(event.target.value)}
        />
        <Button className="mt-3 w-full" loading={busy} onClick={() => void save()}>
          Save Baazex ID
        </Button>
      </div>
    </div>
  )
}
