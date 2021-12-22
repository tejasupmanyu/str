import * as React from "react";
import { hasher } from "./hasher";
import { cacheGet, cacheSet, cacheView, cacheClear } from "./cache";

export interface ISTROptions {
  shouldRevalidateOnFocus?: boolean;
  loadingTimeout?: number;
  onSuccess?: () => void;
  onError?: () => void;
  onLoadingTimeout?: () => void;
  revalidateOnReconnect?: () => void;
}

const noop = () => {};

export const useSTR = (fetcher?: any, options?: ISTROptions) => {
  const [isFetching, setIsFetching] = React.useState(false);
  const [result, setResult] = React.useState<any>();
  const [error, setError] = React.useState<any>();
  const [fetcherURL, setFetcherURL] = React.useState<string | undefined>();
  const [fetcherParams, setFetcherParams] = React.useState<any>();

  const onSuccess = options && options.onSuccess ? options.onSuccess : noop;
  const onError = options && options.onError ? options.onError : noop;

  React.useEffect(() => {
    if (window) {
      window.addEventListener("focus", revalidateOnFocusHandler);
      window.addEventListener("visibilitychange", revalidateOnFocusHandler);
      window.addEventListener("online", revalidateOnReconnectHandler);
    }
    return () => {
      if (window) {
        window.removeEventListener("focus", revalidateOnFocusHandler);
        window.removeEventListener(
          "visibilitychange",
          revalidateOnFocusHandler
        );
        window.removeEventListener("online", revalidateOnReconnectHandler);
      }
    };
  }, []);

  const revalidateOnFocusHandler = () => {
    if (options && options.shouldRevalidateOnFocus && fetcherURL) {
      revalidator();
    }
  };

  const revalidateOnReconnectHandler = () => {
    if (options && options.revalidateOnReconnect && fetcherURL) {
      revalidator();
    }
  };

  const getCacheEntries = (cacheKey: string) => {
    const errorKey = getErrorCacheKey(cacheKey);
    return [cacheGet(cacheKey), cacheGet(errorKey)];
  };

  const getCacheKey = (url: string, params?: any) => {
    const cacheKey = `${url}${params ? hasher([params]) : ""}`;
    return cacheKey;
  };

  const getErrorCacheKey = (cacheKey: string) => {
    return `err@${cacheKey}`;
  };

  async function lazyFetch(url: string, params?: any) {
    setFetcherURL(url);
    setFetcherParams(params);
    if (url) {
      setIsFetching(true);
      const key = getCacheKey(url, params);
      const errorKey = getErrorCacheKey(key);
      const [staleResults, staleError] = getCacheEntries(key);

      // return stale data.
      if (staleResults) {
        setResult(staleResults);
        setIsFetching(false);
      } else if (staleError) {
        setError(staleError);
        setIsFetching(false);
      } else {
        try {
          if (options && options.loadingTimeout && options.onLoadingTimeout) {
            setTimeout(() => {
              if (isFetching) {
                options.onLoadingTimeout && options.onLoadingTimeout();
              }
            }, options.loadingTimeout);
          }
          const results = await fetcher(url, params);
          setResult(results);
          cacheSet(key, results);
          onSuccess();
          setIsFetching(false);
        } catch (err) {
          setError(err);
          cacheSet(errorKey, err);
          onError();
          setIsFetching(false);
        }
      }
    }
  }

  async function revalidator(url = fetcherURL, params = fetcherParams) {
    if (url) {
      setIsFetching(true);
      const cacheKey = `${url}${hasher(params)}`;
      const errorKey = getErrorCacheKey(cacheKey);
      try {
        const results = await fetcher(url, params);
        setResult(results);
        cacheSet(cacheKey, results);
        onSuccess();
        setIsFetching(false);
      } catch (err) {
        setError(err);
        cacheSet(errorKey, err);
        onError();
        setIsFetching(false);
      }
    }
  }

  function viewCache() {
    console.log(cacheView());
  }

  function clearCache() {
    cacheClear()
  }

  return { result, lazyFetch, isFetching, error, revalidator, viewCache, clearCache };
};
