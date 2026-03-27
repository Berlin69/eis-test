import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useRootStore } from '../../models/root-store.ts';
import { MeterTable } from '../meter-table/meter-table.tsx';
import { Pagination } from '../pagination/pagination.tsx';

export const TableSection = observer(() => {
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
    <div>
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
