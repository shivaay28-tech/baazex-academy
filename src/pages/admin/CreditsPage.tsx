import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { isSupabaseEnabled } from '@/services/backend'
import { getSupabase } from '@/services/supabase'
import { useEffect, useState } from 'react'

interface DepositRow {
  id: string
  baazexId: string
  amountUsd: number
  questionsAdded: number
  reference: string
  createdAt: string
}

async function authHeader() {
  const { data } = await getSupabase().auth.getSession()
  const token = data.session?.access_token
  if (!token) throw new Error('Sign in again as an admin.')
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
}

async function fetchDeposits() {
  const response = await fetch('/api/admin/deposits', { headers: await authHeader() })
  const body = (await response.json().catch(() => ({}))) as { error?: string; deposits?: DepositRow[] }
  if (!response.ok) throw new Error(body.error || 'Could not load deposits.')
  return body.deposits ?? []
}

export function CreditsPage() {
  const { user } = useAuth()
  const { push } = useToast()
  const [baazexId, setBaazexId] = useState('')
  const [amount, setAmount] = useState('100')
  const [reference, setReference] = useState('')
  const [deposits, setDeposits] = useState<DepositRow[] | null>(null)
  const [saving, setSaving] = useState(false)
  const canLoad = user?.role === 'admin' && isSupabaseEnabled()
  const loading = canLoad && deposits === null

  async function reload() {
    setDeposits(await fetchDeposits())
  }

  useEffect(() => {
    if (!canLoad) return
    const request = fetchDeposits().then(
      (rows) => rows,
      (error: unknown) => {
        push('error', error instanceof Error ? error.message : 'Could not load deposits.')
        return [] as DepositRow[]
      },
    )
    let active = true
    void request.then((rows) => {
      if (active) setDeposits(rows)
    })
    return () => {
      active = false
    }
  }, [canLoad, push])

  if (user?.role !== 'admin') {
    return <p className="p-6 text-sm text-muted">Only an admin can record deposits.</p>
  }

  async function save() {
    setSaving(true)
    try {
      const response = await fetch('/api/admin/deposits', {
        method: 'POST',
        headers: await authHeader(),
        body: JSON.stringify({ baazexId, amountUsd: Number(amount), reference }),
      })
      const body = (await response.json().catch(() => ({}))) as { error?: string; questions?: number; fullName?: string }
      if (!response.ok) throw new Error(body.error || 'Could not record the deposit.')
      push('success', 'Credit added', `${body.questions ?? 0} credits for ${body.fullName || baazexId}.`)
      setReference('')
      await reload()
    } catch (error) {
      push('error', error instanceof Error ? error.message : 'Could not record the deposit.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="text-2xl font-bold text-ink">Baazex deposits</h1>
      <p className="mt-1 text-sm text-muted">
        A deposit adds 15% of the dollar amount as engine credit. $100 adds 15 credits. The student must save that Baazex ID first.
      </p>
      {loading ? <p className="mt-6 text-sm text-muted">Loading…</p> : null}
      {!isSupabaseEnabled() ? (
        <p className="mt-4 text-sm text-muted">Connect this academy’s database before deposits can be recorded.</p>
      ) : null}

      <section className="mt-6 space-y-3 rounded-2xl border border-line bg-white p-4">
        <label className="block text-sm font-semibold text-ink">
          Baazex ID
          <input className="mt-1 h-11 w-full rounded-xl border border-line bg-canvas px-3" value={baazexId} onChange={(event) => setBaazexId(event.target.value)} />
        </label>
        <label className="block text-sm font-semibold text-ink">
          Deposit amount (USD)
          <input className="mt-1 h-11 w-full rounded-xl border border-line bg-canvas px-3" inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value)} />
        </label>
        <label className="block text-sm font-semibold text-ink">
          Deposit reference
          <input className="mt-1 h-11 w-full rounded-xl border border-line bg-canvas px-3" placeholder="Transaction id from Baazex" value={reference} onChange={(event) => setReference(event.target.value)} />
        </label>
        <button type="button" className="h-11 rounded-xl bg-baazex px-4 font-semibold text-on-button disabled:opacity-60" disabled={saving} onClick={() => void save()}>
          {saving ? 'Adding…' : 'Add credit'}
        </button>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-ink">Recent deposits</h2>
        {!loading && (deposits?.length ?? 0) === 0 ? <p className="mt-2 text-sm text-muted">No deposits recorded yet.</p> : null}
        <ul className="mt-3 space-y-3">
          {(deposits ?? []).map((item) => (
            <li key={item.id} className="rounded-2xl border border-line bg-white p-4">
              <p className="font-semibold text-ink">{item.baazexId}</p>
              <p className="text-sm text-muted">${item.amountUsd} · {item.questionsAdded} credits · {item.reference}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
