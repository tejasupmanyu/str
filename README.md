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
