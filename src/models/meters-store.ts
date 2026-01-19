import { flow, types } from 'mobx-state-tree';
import type { Instance } from 'mobx-state-tree';
import type { MeterDto } from '../api/meters-api.ts';
import { deleteMeter, getMeters } from '../api/meters-api.ts';
import { AreasStore } from './areas-store.ts';

const MeterModel = types.model('Meter', {
  id: types.identifier,
  type: types.optional(types.string, ''),
  installation_date: types.optional(types.string, ''),
  area_id: types.optional(types.string, ''),
  is_automatic: types.optional(types.boolean, false),
  initial_values: types.optional(types.frozen(), []),
  description: types.optional(types.string, ''),
});

function toMeterSnapshot(meter: MeterDto) {
  return {
    id: meter.id,
    type: meter.type ?? meter._type?.[0] ?? '',
    installation_date: meter.installation_date ?? '',
    area_id: meter.area_id ?? meter.area?.id ?? '',
    is_automatic: Boolean(meter.is_automatic),
    initial_values: meter.initial_values ?? [],
    description: meter.description ?? '',
  };
}

type MeterSnapshot = ReturnType<typeof toMeterSnapshot>;

export const MetersStore = types
  .model('MetersStore', {
    items: types.optional(types.array(MeterModel), []),
    limit: types.optional(types.number, 20),
    offset: types.optional(types.number, 0),
    total: types.maybeNull(types.number),
    isLoading: types.optional(types.boolean, false),
    error: types.maybeNull(types.string),
    lastLoadedCount: types.optional(types.number, 0),
    deletingIds: types.optional(types.map(types.boolean), {}),
  })
  .volatile(() => ({
    areasStore: null as null | Instance<typeof AreasStore>,
  }))
  .views((self) => ({
    isDeleting(id: string) {
      return self.deletingIds.has(id);
    },
  }))
  .actions((self) => {
    const loadPage = flow(function* loadPage(offset: number) {
      self.isLoading = true;
      self.error = null;

      try {
        const data = yield getMeters(self.limit, offset);
        self.areasStore?.mergeInlineAreas(data.items);
        const snapshots: MeterSnapshot[] = data.items.map((meter: MeterDto) =>
          toMeterSnapshot(meter),
        );
        self.items.replace(snapshots);
        self.offset = offset;
        self.total = data.total ?? null;
        self.lastLoadedCount = data.items.length;

        const areaIds = snapshots
          .map((meter: MeterSnapshot) => meter.area_id)
          .filter(Boolean);
        // load areas in parallel; errors are handled inside AreasStore
        void self.areasStore?.ensureAreas(areaIds);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Failed to load meters';
        self.error = message;
      } finally {
        self.isLoading = false;
      }
    });

    const nextPage = () => loadPage(self.offset + self.limit);
    const prevPage = () => loadPage(Math.max(0, self.offset - self.limit));

    const remove = flow(function* remove(meterId: string) {
      self.deletingIds.set(meterId, true);

      try {
        yield deleteMeter(meterId);
        yield loadPage(self.offset);

        if (self.lastLoadedCount < self.limit && self.offset > 0) {
          yield loadPage(self.offset - self.limit);
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Failed to delete meter';
        self.error = message;
      } finally {
        self.deletingIds.delete(meterId);
      }
    });

    return {
      loadPage,
      nextPage,
      prevPage,
      deleteMeter: remove,
      setAreasStore(store: Instance<typeof AreasStore>) {
        self.areasStore = store;
      },
    };
  });

export type MetersStoreInstance = typeof MetersStore.Type;
export type MeterInstance = Instance<typeof MeterModel>;
