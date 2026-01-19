import { useCallback, useState } from 'react';

type ConfirmOptions = {
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
};

const DEFAULT_OPTIONS: Required<ConfirmOptions> = {
  title: 'Подтвердите действие',
  description: 'Вы уверены, что хотите продолжить?',
  confirmText: 'Удалить',
  cancelText: 'Отмена',
};

export function useConfirm() {
  const [state, setState] = useState<{
    open: boolean;
    options: Required<ConfirmOptions>;
    resolve: ((value: boolean) => void) | null;
  }>({
    open: false,
    options: DEFAULT_OPTIONS,
    resolve: null,
  });

  const close = useCallback(
    (result: boolean) => {
      if (state.resolve) {
        state.resolve(result);
      }
      setState((prev) => ({ ...prev, open: false, resolve: null }));
    },
    [state.resolve],
  );

  const confirm = useCallback(
    (options?: ConfirmOptions) => {
      const merged = { ...DEFAULT_OPTIONS, ...options };

      return new Promise<boolean>((resolve) => {
        setState({ open: true, options: merged, resolve });
      });
    },
    [],
  );

  const Dialog = () => {
    if (!state.open) return null;

    const { title, description, confirmText, cancelText } = state.options;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
        <div className="w-full max-w-sm rounded-lg bg-white shadow-xl ring-1 ring-slate-200">
          <div className="px-5 py-4 space-y-2">
            <div className="text-base font-semibold text-slate-900">{title}</div>
            {description ? (
              <p className="text-sm text-slate-600">{description}</p>
            ) : null}
          </div>
          <div className="flex justify-end gap-2 px-5 py-3">
            <button
              type="button"
              className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              onClick={() => close(false)}
            >
              {cancelText}
            </button>
            <button
              type="button"
              className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-700"
              onClick={() => close(true)}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return { confirm, ConfirmDialog: Dialog };
}
