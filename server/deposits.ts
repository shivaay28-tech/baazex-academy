import { createClient, type SupabaseClient } from '@supabase/supabase-js'

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  })
}

function questionsFor(amountUsd: number) {
  return Math.round(amountUsd * 0.15)
}

async function requireStaff(request: Request) {
  const header = request.headers.get('authorization') ?? ''
  const token = header.toLowerCase().startsWith('bearer ') ? header.slice(7).trim() : ''
  if (!token) throw new Error('Sign in again as an admin.')
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const anon = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !anon || !service) throw new Error('This academy is missing its server Supabase keys.')
  const userClient = createClient(url, anon, { auth: { persistSession: false, autoRefreshToken: false } })
  const { data, error } = await userClient.auth.getUser(token)
  if (error || !data.user) throw new Error('Sign in again as an admin.')
  const admin = createClient(url, service, { auth: { persistSession: false, autoRefreshToken: false } })
  const { data: profile, error: profileError } = await admin.from('profiles').select('role').eq('id', data.user.id).maybeSingle()
  if (profileError) throw new Error(profileError.message)
  if (profile?.role !== 'admin') throw new Error('Only an admin can record a deposit.')
  return admin
}

export async function listDeposits(admin: SupabaseClient) {
  const { data, error } = await admin
    .from('deposits')
    .select('id, baazex_id, amount_usd, questions_added, reference, created_at')
    .order('created_at', { ascending: false })
    .limit(20)
  if (error) throw new Error(error.message)
  return (data ?? []).map((row) => ({
    id: row.id,
    baazexId: row.baazex_id,
    amountUsd: Number(row.amount_usd),
    questionsAdded: row.questions_added,
    reference: row.reference,
    createdAt: row.created_at,
  }))
}

export async function recordDeposit(admin: SupabaseClient, baazexId: string, amountUsd: number, reference: string) {
  const id = baazexId.trim()
  const ticket = reference.trim()
  const questions = questionsFor(amountUsd)
  if (!id) throw new Error('Enter the Baazex ID.')
  if (!Number.isFinite(amountUsd) || amountUsd <= 0) throw new Error('Enter the deposit amount in dollars.')
  if (!ticket) throw new Error('Enter a deposit reference so it is only counted once.')
  if (questions < 1) throw new Error('That deposit is too small to add credit.')

  const { data: matches, error } = await admin
    .from('profiles')
    .select('id, bonus_questions, email, full_name')
    .eq('baazex_id', id)
  if (error) throw new Error(error.message)
  if (!matches || matches.length === 0) throw new Error('No student has saved that Baazex ID.')
  if (matches.length > 1) throw new Error('More than one student uses that Baazex ID.')

  const profile = matches[0]
  const { error: insertError } = await admin.from('deposits').insert({
    user_id: profile.id,
    baazex_id: id,
    amount_usd: amountUsd,
    questions_added: questions,
    reference: ticket,
  })
  if (insertError) {
    if (insertError.code === '23505') throw new Error('That deposit reference was already added.')
    throw new Error(insertError.message)
  }

  const bonusQuestions = Number(profile.bonus_questions ?? 0) + questions
  const { error: updateError } = await admin.from('profiles').update({ bonus_questions: bonusQuestions }).eq('id', profile.id)
  if (updateError) {
    await admin.from('deposits').delete().eq('reference', ticket)
    throw new Error(updateError.message)
  }

  return {
    questions,
    bonusQuestions,
    email: profile.email ?? '',
    fullName: profile.full_name ?? '',
  }
}

export async function handleDeposits(request: Request) {
  try {
    const admin = await requireStaff(request)
    if (request.method === 'GET') {
      return json(200, { deposits: await listDeposits(admin) })
    }
    if (request.method !== 'POST') return json(405, { error: 'Use GET or POST.' })
    const body = (await request.json()) as { baazexId?: string; amountUsd?: number; reference?: string }
    const result = await recordDeposit(admin, body.baazexId ?? '', Number(body.amountUsd), body.reference ?? '')
    return json(200, { ok: true, ...result })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not record the deposit.'
    const status = message.includes('admin') || message.includes('Sign in') ? 403 : 400
    return json(status, { error: message })
  }
}
