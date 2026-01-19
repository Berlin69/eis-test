import {useRef, useState} from "react";
import {useOutsideClick} from "../../hooks/use-outside-click.ts";

export function Ellipsis({
                    totalPages,
                    onSelectPage,
                  }: {
  totalPages: number
  onSelectPage: (page: number) => void
}) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')
  const popoverRef = useRef<HTMLDivElement | null>(null)

  useOutsideClick(popoverRef, () => {
    if (open) {
      setOpen(false)
      setValue('')
    }
  })

  const toggle = () => setOpen((prev) => !prev)
  const close = () => {
    setOpen(false)
    setValue('')
  }

  const submit = () => {
    const parsed = Number(value)
    if (!Number.isFinite(parsed)) return
    const target = Math.max(1, Math.min(totalPages, Math.floor(parsed)))
    onSelectPage(target)
    close()
  }

  return (
    <div className="relative" ref={popoverRef}>
      <button
        type="button"
        className="cursor-pointer min-w-10 bg-white border border-[#CED5DE] text-center rounded-md px-3 py-2 text-sm font-medium text-slate-400 hover:bg-slate-50"
        onClick={toggle}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        …
      </button>
      {open && (
        <div className="absolute left-1/2 bottom-full z-10 mb-2 w-40 -translate-x-1/2 rounded-md border border-slate-200 bg-white p-3 shadow-lg">
          <label className="block text-xs font-medium text-slate-700 mb-2">
            Введите страницу
          </label>
          <input
            type="number"
            min={1}
            max={totalPages}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                submit()
              }
              if (e.key === 'Escape') {
                e.preventDefault()
                close()
              }
            }}
            className="w-full rounded-md border border-slate-200 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
          />
          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              className="rounded-md px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100"
              onClick={close}
            >
              Отмена
            </button>
            <button
              type="button"
              className="rounded-md bg-[#1F2939] px-2 py-1 text-xs font-medium text-white hover:bg-[#111827]"
              onClick={submit}
            >
              Перейти
            </button>
          </div>
        </div>
      )}
    </div>
  )
}