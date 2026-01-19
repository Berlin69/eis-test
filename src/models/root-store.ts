import { createContext, createElement, useContext } from 'react';
import type { ReactNode } from 'react';
import { types } from 'mobx-state-tree';
import type { Instance } from 'mobx-state-tree';
import { AreasStore } from './areas-store.ts';
import { MetersStore } from './meters-store.ts';

export const RootStore = types
  .model('RootStore', {
    areasStore: types.optional(AreasStore, {}),
    metersStore: types.optional(MetersStore, {}),
  })
  .actions((self) => ({
    afterCreate() {
      self.metersStore.setAreasStore(self.areasStore);
    },
  }));

export type RootStoreInstance = Instance<typeof RootStore>;

export function createRootStore() {
  const store = RootStore.create({
    areasStore: {},
    metersStore: {},
  });

  store.metersStore.setAreasStore(store.areasStore);

  return store;
}

const RootStoreContext = createContext<RootStoreInstance | null>(null);

export function RootStoreProvider({
  store,
  children,
}: {
  store: RootStoreInstance;
  children: ReactNode;
}) {
  return createElement(RootStoreContext.Provider, { value: store, children });
}

export function useRootStore(): RootStoreInstance {
  const store = useContext(RootStoreContext);
  if (!store) {
    throw new Error('RootStore is not provided');
  }

  return store;
}
