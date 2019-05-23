---
title: Vue.js runs examples
lang: en-US
---

``` jsonnet
local node_runtime(version, arch) = {
  type: 'pod',
  arch: arch,
  containers: [
    {
      image: 'node:' + version,
    },
  ],
};

local task_build(version, arch) = {
  name: 'build - node ' + version + ' ' + arch,
  runtime: node_runtime(version, arch),
  environment: {},
  steps: [
    { type: 'run', command: 'env' },
    { type: 'clone' },
    { type: 'restore_cache', keys: ['cache-sum-{{ md5sum "package.json" }}', 'cache-date-'], dest_dir: './node_modules' },
    { type: 'run', command: 'npm install' },
    { type: 'run', command: 'npm run build' },
    { type: 'save_cache', key: 'cache-sum-{{ md5sum "package.json" }}', contents: [{ source_dir: './node_modules' }] },
    { type: 'save_cache', key: 'cache-date-{{ year }}-{{ month }}-{{ day }}', contents: [{ source_dir: './node_modules' }] },
  ],
};

{
  runs: [
    {
      name: 'agola web build/test',
      tasks: std.flattenArrays([
        [
          task_build(version, arch),
        ]
        for version in ['11', '12']
        for arch in ['amd64', 'arm64']
      ])
    },
  ],
}
```