import { observer } from 'mobx-react-lite';
import type { MeterInstance } from '../../models/meters-store.ts';
import { formatDate, formatInitialValues } from '../../utils/format';
import { mapMeterType } from '../../utils/meter-type.ts';
import { useConfirm } from '../../hooks/use-confirm.tsx';
import { IconColdWater, IconHotWater, IconTrash } from '../icons';

interface MeterRowProps {
  meter: MeterInstance;
  index: number;
  offset: number;
  address: string;
  isDeleting: boolean;
  onDelete: (id: string) => void;
  gridClass: string;
}

function MeterRowComponent({
  meter,
  index,
  offset,
  address,
  isDeleting,
  onDelete,
  gridClass,
}: MeterRowProps) {
  const { confirm, ConfirmDialog } = useConfirm();

  const handleDelete = async () => {
    if (isDeleting) return;

    const confirmed = await confirm({
      title: 'Удалить счётчик?',
      description: 'Это действие удалит счётчик безвозвратно',
      confirmText: 'Удалить',
      cancelText: 'Отмена',
    });

    if (confirmed) {
      onDelete(meter.id);
    }
  };

  const typeLabel = mapMeterType(meter.type);
  const typeIcon =
    typeLabel === 'ХВС' ? (
      <IconColdWater />
    ) : typeLabel === 'ГВС' ? (
      <IconHotWater />
    ) : null;

  return (
    <>
      <div
        className={`relative ${gridClass} cursor-pointer w-full items-center border-b border-slate-100 min-h-[52px] py-1 text-sm leading-5 transition-colors hover:bg-slate-50 group`}
        style={{ maxHeight: 52 }}
      >
        <div className="text-slate-500 whitespace-nowrap pl-3">
          {offset + index + 1}
        </div>
        <div className="flex items-center gap-2 font-medium pl-3 text-slate-900 whitespace-nowrap">
          {typeIcon}
          {typeLabel}
        </div>
        <div className="text-slate-700 whitespace-nowrap pl-3">
          {formatDate(meter.installation_date)}
        </div>
        <div className="text-slate-700 whitespace-nowrap pl-3">
          {meter.is_automatic ? 'Да' : 'Нет'}
        </div>
        <div className="text-slate-700 whitespace-nowrap overflow-hidden text-ellipsis pl-3">
          {formatInitialValues(meter.initial_values)}
        </div>
        <div className="text-slate-700 whitespace-nowrap overflow-hidden text-ellipsis pl-3">
          {address}
        </div>
        <div className="text-slate-700 whitespace-nowrap overflow-hidden text-ellipsis pl-3">
          {meter.description || '-'}
        </div>
        <div
          className={`absolute right-3 flex justify-end whitespace-nowrap transition-opacity pl-3 ${
            isDeleting ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
        >
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className={`cursor-pointer flex items-center rounded-md p-3 text-sm font-medium text-red-600 bg-[#FEE3E3] hover:bg-[#FED7D7] transition-opacity  focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-red-200 ${
              isDeleting ? 'cursor-not-allowed opacity-50' : ''
            }`}
            aria-label="Удалить"
          >
            <IconTrash />
            <span className="sr-only">Удалить</span>
          </button>
        </div>
      </div>
      <ConfirmDialog />
    </>
  );
}

export const MeterRow = observer(MeterRowComponent);
