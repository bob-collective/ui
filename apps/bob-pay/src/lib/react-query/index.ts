import { QueryCache, QueryClient } from '@gobob/react-query';

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      if (typeof query.meta?.onError === 'function') query.meta.onError(error, query);
    },
    onSuccess(data, query) {
      if (typeof query.meta?.onSuccess === 'function') query.meta.onSuccess(data, query);
    },
    onSettled(data, error, query) {
      if (typeof query.meta?.onSettled === 'function') query.meta.onSettled(data, error, query);
    }
  })
});

export { queryClient };
