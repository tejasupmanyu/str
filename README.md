## Introduction

React-STR is a React Hooks library for remote data fetching.

"STR" stands for `stale-till-revalidate`, where STR returns data from cache (stale), until you revalidate it.

It features:

- Transport and protocol agnostic data fetching
- Revalidation on focus
- Typescript Ready
- Minimal API

... and a lot more coming soon.

With STR, components will get a stream of data updates constantly and automatically. Thus, the UI will be always fast and reactive.

## Quick Start

```jsx
import useSTR from "str";

const Home: React.FC = () => {
  const getData = async url => {
    const response = await fetch(url, { method: "GET" });
    return response.data;
  };

  const { lazyFetch, result, isFetching, error } = useSTR(getData);

  React.useEffect(() => {
    lazyFetch(`https://api/user`);
  }, []);

  if (error) return <div>Something went wrong</div>;
  if (isFetching) return <div>Loading...</div>;
  return <div>Hello, {data.name}</div>;
};
```

## Usage

Inside your React project, add `react-str` using,

`yarn add react-str`

or with npm:

`npm install react-str`

## API

```jsx
const { result, lazyFetch, isFetching, error, revalidator, viewCache } = useSTR(
  fetcherFn,
  options
);
```

### Arguments

- `fetcherFn`: A function which accepts url of type string, and some parameters as second argument and returns result of data fetching operations.

### Return Values

- `result`: result of data fetching operations, i.e result returned by `fetcherFn`.

- `lazyFetch`: function to be used for triggering data fetching, accepts same arguments as `fetcherFn`. Returns stale data if data already in cache.

- `isFetching`: Boolean value representing loading/fetching state of data fetching operation.

- `error`: Error object, in case data-fetching results in an error.

- `revalidator`: function to revalidate cache. Fetches data again, irrespective of its presence in cache and repopulates cache. Accepts same arguments as `lazyFetch`, arguments are optional. If no arguments provided, assumes arguments provided to lazyFetch.

- `viewCache`: Logs a snapshot of cache to console at that moment.

### Options

- `shouldRevalidateOnFocus = false`: auto revalidate when window gets focused.
- `loadingTimeout = undefined`: timeout to trigger the onLoadingSlow event.
- `onSuccess`: callback function when a request finishes successfully.
- `onError`: callback function when a request results in an error.
- `onLoadingTimeout`: callback function when a request takes too long to load (see `loadingTimeout`)
- `revalidateOnReconnect = false`: automatically revalidate when the browser regains a network connection

## Roadmap

In next releases, STR will bring the following features -

- Error retries
- Request Deduping
- Polling
- Suspense
- Cache mutations

## License

The MIT License.
