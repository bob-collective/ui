import '@gobob/react-query';
import { DefaultError, Query } from '@gobob/react-query';

// https://tanstack.com/query/latest/docs/framework/react/typescript#typing-meta
interface CustomQueryMeta<TQueryFnData = unknown> extends Record<string, unknown> {
  onSuccess?: ((data: TQueryFnData, query: Query<TQueryFnData, unknown, unknown>) => void) | undefined;
  onError?: ((error: DefaultError, query: Query<TQueryFnData, unknown, unknown>) => void) | undefined;
  onSettled?:
    | ((
        data: TQueryFnData | undefined,
        error: DefaultError | null,
        query: Query<TQueryFnData, unknown, unknown>
      ) => void)
    | undefined;
}

declare module '@gobob/react-query' {
  interface Register extends Record<string, unknown> {
    queryMeta: CustomQueryMeta;
  }
}
