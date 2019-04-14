---
title: Caching
lang: en-US
---

# Caching

Caching let you cache some files for later reuse. Caching happens at the project level so every run for the same project has access to all the cache entries created by previous runs.
Every cache entry is distinguished by a key.

There are two steps to manage caching `save_cache` and `restore_cache`

During `save_cache` if the key already exists no new cache entry will be added. 

`restore_cache` accepts a list of cache keys (that can be dynamically generated using a template). It'll iterate over this list in order and will use the first matching key.
Cache key matching is **by prefix**. If there're multiple prefix matches, the newest cache entry will be used.
**prefix matching** helps create a lot of useful caching modes. See below.

## Cache key template

The cache key can be generated based on some information available only at runtime (like a file checksum). To achieve this, the cache key in the `save_cache` and the keys list in the `restore_cache` steps can be provided as a [go template](https://golang.org/pkg/text/template/) 

This template can use some provided functions to generate the cache key.

### Available template functions

| Function  | Description                                                                         |
| --------- | ----------------------------------------------------------------------------------- |
| md5sum    | Calculates the md5sum of the provided file                                          |
| sha256sum | Calculates the sha256sum of the provided file                                       |
| env       | returns the value of the provided environment variable (empty if it doesn't exists) |
| os        | returns the os name                                                                 |
| arch      | returns the machine architecture                                                    |
| day       | returns the current day, with leading zero (01 - 31)                                |
| month     | returns the current month, with leading zero (01 - 12)                              |
| year      | returns the current year (i.e 2019)                                                 |
| unixtime  | returns unix seconds (seconds since 1 Jan 1970)                                     |

### Examples

```
    save_cache:
      key: go-mod-cache-{{ md5sum go.mod }}
      contents:
        - source_dir: /go/pkg/mod/cache
```

This will generate a cache key based on the md5sum of the go.mod file and save all the contents of `/go/pkg/mod/cache`

### Caching strategies for project dependencies

Cache could be used to avoid fetching all the project dependencies at every run. You don't need to have an uptodate cache of dependencies but you can just rely on a partial caching so the package manager will just fetch the missing/updated dependencies.
To optimize it you can also save multiple caches at different key with an increasing degree of precision and in the `restore_cache` step provide a list of keys from the most precise to the less one

For example:

```
    restore_cache:
      keys:
       - go-mod-cache-sum-{{ md5sum go.mod }}
       - go-mod-cache-date
      dest_dir: /go/pkg/mod/cache

    run: go build .
    save_cache:
      key: go-mod-cache-sum-{{ md5sum go.mod }}
      contents:
        - source_dir: /go/pkg/mod/cache
    save_cache:
      key: go-mod-cache-date-{{ year }}-{{ month }}-{{ day }}
      contents:
        - source_dir: /go/pkg/mod/cache
```

In this example, in the `save_cache` step we are creating two cache keys (for the same contents). The first one is the more specific since it's based on the md5sum of the go.mod file, the other one is based on the current day (so only one cache entry per day will be created). To always create a new cache entry for every run you can use `{{ unixtime }}`

In the `restore_cache` step we are trying to first fetch a cache based on the go.mod md5sum, if such key doesn't exists we'll try to get a key based on the current day, if also this doesn't exists we'll try the first cache for the current month. Since keys are matched by prefix the last cache key will match every key of the current month. If we have the following cache keys:

`go-mod-cache-20190415`
`go-mod-cache-20190414`
`go-mod-cache-20190410`

If the step is executed at `20190425`, then the key template `go-mod-cache-{{ year }}-{{ month }}` will generate a key: `go-mod-cache-201904` and it'll match by prefix `go-mod-cache-20190415`
