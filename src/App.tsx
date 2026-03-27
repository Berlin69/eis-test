import { useMemo } from 'react';
import { TableSection } from './components/table-section/table-section.tsx';
import { createRootStore, RootStoreProvider } from './models/root-store.ts';

function App() {
  const store = useMemo(() => createRootStore(), []);

  return (
    <RootStoreProvider store={store}>
      <div className="min-h-screen overflow-x-hidden bg-slate-50 font-roboto text-slate-900">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-4 py-10">
          <header>
            <h1 className="text-2xl font-semibold">Список счётчиков</h1>
          </header>

          <div className="rounded-xl border border-slate-200 bg-white">
            <TableSection />
          </div>
        </div>
      </div>
    </RootStoreProvider>
  );
}

export default App;
