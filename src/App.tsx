import { useEffect, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { MeterTable } from './components/MeterTable/meter-table.tsx';
import { Pagination } from './components/Pagination/pagination.tsx';
import {
  createRootStore,
  RootStoreProvider,
  useRootStore,
} from './models/root-store.ts';

const TableSection = observer(() => {
  const { metersStore } = useRootStore();

  useEffect(() => {
    metersStore.loadPage(0);
  }, [metersStore]);

  const currentPage = Math.floor(metersStore.offset / metersStore.limit) + 1;
  const totalPages = metersStore.total
    ? Math.max(1, Math.ceil(metersStore.total / metersStore.limit))
    : Math.max(
        currentPage,
        metersStore.lastLoadedCount === metersStore.limit
          ? currentPage + 1
          : currentPage,
      );

  return (
    <div className="">
      <MeterTable />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onSelectPage={(page) =>
          metersStore.loadPage((page - 1) * metersStore.limit)
        }
        disabled={metersStore.isLoading}
      />
    </div>
  );
});

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
