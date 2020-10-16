import { get, memoizeOne } from './lib';

export function createComputedPropertyBinder(parentPath, key, definition) {
  const memoisedResultFn = memoizeOne(definition.fn);
  return function createComputedProperty(parentState, storeState) {
    Object.defineProperty(parentState, key, {
      configurable: true,
      enumerable: true,
      get: () => {
        const state = get(parentPath, storeState);
        const inputs = definition.stateResolvers.map((resolver) =>
          resolver(state, storeState),
        );
        return memoisedResultFn(...inputs);
      },
    });
  };
}

export function createComputedPropertiesMiddleware(references) {
  return (store) => (next) => (action) => {
    references.internals._computedState.currentState = store.getState();
    references.internals._computedState.isInReducer = true;
    return next(action);
  };
}
