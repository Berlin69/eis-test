import { flow, types } from 'mobx-state-tree';
import type { AreaDto } from '../api/areas-api.ts';
import { getAreasByIds } from '../api/areas-api.ts';

const AreaModel = types.model('Area', {
  id: types.identifier,
  city: types.optional(types.string, ''),
  street: types.optional(types.string, ''),
  house: types.optional(types.string, ''),
  flat: types.optional(types.string, ''),
});

function toAreaSnapshot(area: AreaDto) {
  return {
    id: area.id,
    city: area.city ?? '',
    street: area.street ?? '',
    house: area.house ?? '',
    flat: area.flat ?? '',
  };
}

export const AreasStore = types
  .model('AreasStore', {
    areasMap: types.optional(types.map(AreaModel), {}),
    isLoading: types.optional(types.boolean, false),
    error: types.maybeNull(types.string),
  })
  .volatile(() => ({
    pendingIds: new Set<string>(),
  }))
  .views((self) => ({
    getAddress(areaId: string): string {
      const area = self.areasMap.get(areaId);
      if (!area) {
        return '-';
      }

      const parts = [area.street, area.house, area.flat].filter(Boolean);
      return parts.length ? parts.join(', ') : '-';
    },
  }))
  .actions((self) => {
    function markPending(ids: string[]) {
      ids.forEach((id) => self.pendingIds.add(id));
    }

    function clearPending(ids: string[]) {
      ids.forEach((id) => self.pendingIds.delete(id));
    }

    function setError(message: string | null) {
      self.error = message;
    }

    function mergeAreas(areas: AreaDto[]) {
      areas.forEach((area) => {
        self.areasMap.set(area.id, toAreaSnapshot(area));
      });
    }

    function mergeInlineAreas(meters: { area?: AreaDto }[]) {
      const areas = meters
        .map((meter) => meter.area)
        .filter((area): area is AreaDto & { id: string } => Boolean(area?.id))
        .filter(
          (area) =>
            Boolean(area.street) || Boolean(area.house) || Boolean(area.flat),
        );

      if (areas.length) {
        mergeAreas(areas);
      }
    }

    const ensureAreas = flow(function* ensureAreas(ids: string[]) {
      const uniqueIds = Array.from(new Set(ids.filter(Boolean)));
      const missingIds = uniqueIds.filter(
        (id) => !self.areasMap.has(id) && !self.pendingIds.has(id),
      );

      if (missingIds.length === 0) {
        return;
      }

      self.isLoading = true;
      markPending(missingIds);
      setError(null);

      try {
        const areas = yield getAreasByIds(missingIds);
        mergeAreas(areas);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Failed to load areas';
        setError(message);
      } finally {
        clearPending(missingIds);
        if (self.pendingIds.size === 0) {
          self.isLoading = false;
        }
      }
    });

    return {
      setError,
      mergeAreas,
      mergeInlineAreas,
      ensureAreas,
    };
  });

export type AreasStoreInstance = typeof AreasStore.Type;
