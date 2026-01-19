import { observer } from 'mobx-react-lite';
import { useRootStore } from '../../models/root-store.ts';
import { MeterRow } from './meter-row.tsx';

export const GRID_TEMPLATE =
  'grid grid-cols-[48px_120px_160px_128px_146px_430px_326px]';

function MeterTableComponent() {
  const { metersStore, areasStore } = useRootStore();
  const { items, offset, isLoading, error } = metersStore;

  return (
    <div className="relative">
      <div className="w-full overflow-hidden rounded-lg border border-[#E0E5EB]">
        <div className="w-full overflow-x-auto">
          <div className="min-w-[1408px] w-fit">
            <div className="max-h-[896px] overflow-y-auto">
              <div
                className={`${GRID_TEMPLATE} w-full font-roboto text-[13px] leading-4 bg-[#f0f3f7] border-b min-h-[32px] border-slate-200 py-1 text-sm font-semibold text-slate-700`}
              >
                <div className="whitespace-nowrap pl-3">№</div>
                <div className="whitespace-nowrap pl-3">Тип</div>
                <div className="whitespace-nowrap pl-3">Дата установки</div>
                <div className="whitespace-nowrap pl-3">Автоматический</div>
                <div className="whitespace-nowrap pl-3">Текущие показания</div>
                <div className="whitespace-nowrap pl-3">Адрес</div>
                <div className="whitespace-nowrap pl-3">Примечание</div>
              </div>

              {error && (
                <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 text-sm text-red-700">
                  <span className="pr-4 whitespace-nowrap overflow-hidden text-ellipsis">
                    {error}
                  </span>
                  <button
                    type="button"
                    className="rounded-md bg-red-50 px-3 py-1 text-red-700 transition hover:bg-red-100"
                    onClick={() => metersStore.loadPage(offset)}
                  >
                    Повторить
                  </button>
                </div>
              )}

              {items?.map((meter, index) => (
                <MeterRow
                  key={meter.id}
                  meter={meter}
                  index={index}
                  offset={offset}
                  address={areasStore.getAddress(meter.area_id)}
                  isDeleting={metersStore.isDeleting(meter.id)}
                  onDelete={(id) => metersStore.deleteMeter(id)}
                  gridClass={GRID_TEMPLATE}
                />
              ))}

              {!items.length && !isLoading && !error ? (
                <div className="px-4 py-6 text-sm text-slate-500">Нет данных</div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="pointer-events-none absolute inset-x-0 top-12 flex justify-center">
          <div className="rounded-full bg-white/90 px-4 py-2 text-sm text-slate-700 shadow">
            Загрузка...
          </div>
        </div>
      ) : null}
    </div>
  );
}

export const MeterTable = observer(MeterTableComponent);
