import { Seo } from '@/components/Seo'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { countries } from '@/data/countries'
import { authService } from '@/services/auth'
import { initials } from '@/utils/format'
import { isPhone, isStrongPassword } from '@/utils/validation'
import { useState } from 'react'

export function ProfilePage() {
  const { user, refresh } = useAuth()
  const { push } = useToast()
  const [fullName, setFullName] = useState(user?.fullName ?? '')
  const [mobile, setMobile] = useState(user?.mobile ?? '')
  const [countryCode, setCountryCode] = useState(user?.countryCode ?? 'AE')
  const [currentPassword, setCurrentPassword] = useState('')
  const [nextPassword, setNextPassword] = useState('')
  const [prefs, setPrefs] = useState(user?.emailPreferences ?? { productUpdates: true, courseNotifications: true, weeklyDigest: false })

  if (!user) return null
  const currentUser = user

  function saveProfile() {
    if (!isPhone(mobile)) {
      push('error', 'Enter a valid mobile number')
      return
    }
    const country = countries.find((item) => item.code === countryCode)
    authService.updateProfile(currentUser.id, {
      fullName,
      mobile,
      countryCode,
      country: country?.name ?? currentUser.country,
      emailPreferences: prefs,
    })
    refresh()
    push('success', 'Profile updated')
  }

  function savePassword() {
    if (!isStrongPassword(nextPassword)) {
      push('error', 'New password must be at least 8 characters with a letter and a number')
      return
    }
    const result = authService.changePassword(currentUser.id, currentPassword, nextPassword)
    push(result.ok ? 'success' : 'error', result.message)
    if (result.ok) {
      setCurrentPassword('')
      setNextPassword('')
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Seo title="Profile and settings" description="Manage your Baazex Academy profile, password, and notification preferences." />
      <h1 className="text-3xl font-extrabold text-navy">Profile and settings</h1>

      <section className="mt-8 rounded-3xl border border-line bg-white p-6">
        <div className="flex items-center gap-4">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-navy text-lg font-bold text-white">
            {initials(fullName)}
          </span>
          <div>
            <p className="font-bold text-navy">Profile photo</p>
            <p className="text-sm text-muted">A placeholder mark is used until media uploads are connected to the API.</p>
          </div>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Input label="Full name" value={fullName} onChange={(event) => setFullName(event.target.value)} />
          <Input label="Email address" value={user.email} disabled />
          <Select
            label="Country"
            value={countryCode}
            onChange={(event) => setCountryCode(event.target.value)}
            options={countries.map((item) => ({ value: item.code, label: `${item.name} (${item.dial})` }))}
          />
          <Input label="Mobile number" value={mobile} onChange={(event) => setMobile(event.target.value.replace(/[^\d]/g, ''))} />
        </div>
        <Button className="mt-5" onClick={saveProfile}>
          Save personal information
        </Button>
      </section>

      <section className="mt-6 rounded-3xl border border-line bg-white p-6">
        <h2 className="font-bold text-navy">Change password</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Input label="Current password" type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} />
          <Input label="New password" type="password" value={nextPassword} onChange={(event) => setNextPassword(event.target.value)} />
        </div>
        <Button className="mt-5" variant="navy" onClick={savePassword}>
          Update password
        </Button>
      </section>

      <section className="mt-6 rounded-3xl border border-line bg-white p-6">
        <h2 className="font-bold text-navy">Email and course notifications</h2>
        <div className="mt-4 space-y-3">
          {(
            [
              ['productUpdates', 'Product updates from Baazex Academy'],
              ['courseNotifications', 'Course notification settings'],
              ['weeklyDigest', 'Weekly learning digest'],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="flex items-center justify-between gap-4 rounded-xl bg-canvas px-4 py-3 text-sm">
              <span className="font-medium text-navy">{label}</span>
              <input
                type="checkbox"
                checked={prefs[key]}
                onChange={(event) => setPrefs((current) => ({ ...current, [key]: event.target.checked }))}
              />
            </label>
          ))}
        </div>
        <Button className="mt-5" variant="secondary" onClick={saveProfile}>
          Save preferences
        </Button>
      </section>
    </div>
  )
}
