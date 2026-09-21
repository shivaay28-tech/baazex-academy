import { cn } from '@/utils/cn'
import { Mic, MonitorUp, Paperclip, Phone, SendHorizonal, Square } from 'lucide-react'
import type { FormEvent, ReactNode } from 'react'

export function EngineComposer({
  value,
  onChange,
  onSubmit,
  onAttach,
  onScreen,
  onVoice,
  onStop,
  disabled,
  sending,
  hasAttachments,
}: {
  value: string
  onChange: (value: string) => void
  onSubmit: (event?: FormEvent, value?: string) => void
  onAttach: () => void
  onScreen: () => void
  onVoice: () => void
  onStop?: () => void
  disabled?: boolean
  sending?: boolean
  hasAttachments?: boolean
}) {
  const canSend = Boolean(value.trim() || hasAttachments)

  return (
    <form
      onSubmit={onSubmit}
      className={cn(
        'rounded-[28px] border bg-[#0b1220] p-3 shadow-[0_0_0_1px_rgb(0_163_255_/_0.12),0_20px_60px_-30px_rgb(0_102_255_/_0.55)]',
        disabled ? 'border-white/10 opacity-70' : 'border-bright/35',
      )}
    >
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault()
            if (sending) return
            onSubmit(event, event.currentTarget.value)
          }
        }}
        placeholder="Ask anything about markets, charts, MT5, or risk…"
        rows={2}
        disabled={disabled}
        className="w-full resize-none bg-transparent px-2 pt-1 text-sm text-white outline-none placeholder:text-white/35"
      />
      <div className="mt-1 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <IconButton label="Attach image or video" onClick={onAttach}>
            <Paperclip className="h-4 w-4" />
          </IconButton>
          <IconButton label="Share screen" onClick={onScreen}>
            <MonitorUp className="h-4 w-4" />
          </IconButton>
          <IconButton label="Record a voice note" onClick={onVoice}>
            <Mic className="h-4 w-4" />
          </IconButton>
          <span className="hidden items-center gap-1 px-2 text-white/20 sm:inline-flex" title="Live voice is not enabled in this educational demo">
            <Phone className="h-4 w-4" />
          </span>
        </div>
        <div className="flex items-center gap-2">
          <p className="hidden text-[11px] text-white/30 sm:block">Live tutor · education only</p>
          {sending ? (
            <button
              type="button"
              onClick={onStop}
              className="grid h-9 w-9 place-items-center rounded-full bg-white/15 text-white hover:bg-white/25"
              aria-label="Stop generating"
            >
              <Square className="h-3.5 w-3.5 fill-current" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={disabled || !canSend}
              className="grid h-9 w-9 place-items-center rounded-full bg-baazex text-white disabled:bg-white/10 disabled:text-white/30"
              aria-label="Send"
            >
              <SendHorizonal className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </form>
  )
}

function IconButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} className="grid h-8 w-8 place-items-center rounded-lg text-white/55 hover:bg-white/8 hover:text-white">
      {children}
    </button>
  )
}
