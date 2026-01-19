import {useMemo} from "react";
import {
  createRootStore,
  RootStoreProvider,
} from './models/root-store.ts';
import {TableSection} from "./components/table-section/table-section.tsx";



function App() {
  const store = useMemo(() => createRootStore(), []);

  return (
    <RootStoreProvider store={store}>
      <div className="min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden font-roboto">
        <div className="mx-auto max-w-[1440px] w-full px-4 py-10 space-y-6">
          <header className="space-y-2">
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
