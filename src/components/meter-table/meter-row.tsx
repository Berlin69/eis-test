import { observer } from 'mobx-react-lite';
import type { MeterInstance } from '../../models/meters-store.ts';
import { formatDate, formatInitialValues } from '../../utils/format';
import { mapMeterType } from '../../utils/meter-type.ts';
import { IconColdWater } from '../icons/icon-cold-water.tsx';
import { IconHotWater } from '../icons/icon-hot-water.tsx';
import { IconTrash } from '../icons/icon-trash.tsx';

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
  const handleDelete = () => {
    if (isDeleting) {
      return;
    }

    onDelete(meter.id);
  };

  const typeLabel = mapMeterType(meter.type);
  const typeIcon =
    typeLabel === 'ХВС' ? (
      <IconColdWater />
    ) : typeLabel === 'ГВС' ? (
      <IconHotWater />
    ) : null;

  return (
    <div
      className={`relative ${gridClass} group min-h-[52px] w-full cursor-pointer items-center border-b border-slate-100 py-1 text-sm leading-5 transition-colors hover:bg-slate-50`}
      style={{ maxHeight: 52 }}
    >
      <div className="whitespace-nowrap pl-3 text-slate-500">
        {offset + index + 1}
      </div>
      <div className="flex items-center gap-2 whitespace-nowrap pl-3 font-medium text-slate-900">
        {typeIcon}
        {typeLabel}
      </div>
      <div className="whitespace-nowrap pl-3 text-slate-700">
        {formatDate(meter.installation_date)}
      </div>
      <div className="whitespace-nowrap pl-3 text-slate-700">
        {meter.is_automatic ? 'Да' : 'Нет'}
      </div>
      <div className="overflow-hidden text-ellipsis whitespace-nowrap pl-3 text-slate-700">
        {formatInitialValues(meter.initial_values)}
      </div>
      <div className="overflow-hidden text-ellipsis whitespace-nowrap pl-3 text-slate-700">
        {address}
      </div>
      <div className="overflow-hidden text-ellipsis whitespace-nowrap pl-3 text-slate-700">
        {meter.description || '-'}
      </div>
      <div
        className={`absolute right-3 flex justify-end whitespace-nowrap pl-3 transition-opacity ${
          isDeleting ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}
      >
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className={`flex cursor-pointer items-center rounded-md bg-[#FEE3E3] p-3 text-sm font-medium text-red-600 transition-opacity hover:bg-[#FED7D7] focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-red-200 ${
            isDeleting ? 'cursor-not-allowed opacity-50' : ''
          }`}
          aria-label="Удалить"
        >
          <IconTrash />
          <span className="sr-only">Удалить</span>
        </button>
      </div>
    </div>
  );
}

export const MeterRow = observer(MeterRowComponent);
