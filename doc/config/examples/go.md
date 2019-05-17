---
title: Go runs examples
lang: en-US
---

## Sample config (using go modules and caching)

This example uses the yaml format and defines a run that will fetch the repository source, restore and save a cache of go modules, build and run it

``` yaml
version: v1

runs:
  - name: agola example go run
    tasks:
      - name: build go 1.12
        runtime:
          type: pod
          arch: amd64
          containers:
            - image: golang:1.12-stretch
        environment:
          GO111MODULE: "on"
        steps:
          - clone:
          - restore_cache:
              keys:
                - cache-sum-{{ md5sum "go.sum" }}
                - cache-date-
              ## golang image sets GOPATH to /go
              dest_dir: /go/pkg/mod/cache
          ## This will create a binary called `agola-example-go` under ./bin
          - run:
              name: build the program
              command: go build .
          ## Copy the built binary to the workspace
          - save_to_workspace:
              contents:
                - source_dir: .
                  dest_dir: /bin/
                  paths:
                    - agola-example-go
          - save_cache:
              key: cache-sum-{{ md5sum "go.sum" }}
              contents:
                - source_dir: /go/pkg/mod/cache
          - save_cache:
              key: cache-date-{{ year }}-{{ month }}-{{ day }}
              contents:
                - source_dir: /go/pkg/mod/cache
      - name: run
        ## This task will run the built binary in the parent task and leverages the workspace capabilities
        runtime:
          type: pod
          arch: amd64
          containers:
            - image: debian:stretch
        steps:
          - restore_workspace:
              dest_dir: .
          - run: ./bin/agola-example-go
        depends:
          - build go 1.12
```

## Matrix build

This example enhances the above one using the `jsonnet` format and adds matrix builds based on two go versions and two different architectures

``` jsonnet
local go_runtime(version, arch) = {
  arch: arch,
  containers: [
    { image: 'golang:' + version + '-stretch' },
  ],
};

local task_build_go(version, arch) = {
  name: 'build go ' + version + ' ' + arch,
  runtime: go_runtime(version, arch),
  working_dir: '/go/src/github.com/sorintlab/agola',
  environment: {
    GO111MODULE: 'on',
  },
  steps: [
    { type: 'clone' },
    { type: 'restore_cache', keys: ['cache-sum-{{ md5sum "go.sum" }}', 'cache-date-'], dest_dir: '/go/pkg/mod/cache' },
    { type: 'run', name: 'build the program', command: 'go build .' },
    { type: 'save_to_workspace', contents: [{ source_dir: '.', dest_dir: '/bin/', paths: ['agola-example-go'] }] },
    { type: 'save_cache', key: 'cache-sum-{{ md5sum "go.sum" }}', contents: [{ source_dir: '/go/pkg/mod/cache' }] },
    { type: 'save_cache', key: 'cache-date-{{ year }}-{{ month }}-{{ day }}', contents: [{ source_dir: '/go/pkg/mod/cache' }] },
  ],
};

{
  runs: [
    {
      name: 'agola build/test',
      tasks: [
        task_build_go(version, arch)
        for version in ['1.11', '1.12']
        for arch in ['amd64', 'arm64']
      ] + [
        {
          name: 'run',
          runtime: {
            arch: 'amd64',
            containers: [
              { image: 'debian:stretch' }
            ],
          },
          steps: [
            { type: 'restore_workspace', dest_dir: '.' },
            { type: 'run', command: './bin/agola-example-go' },
          ],
          depends: [
            'build go 1.12 amd64',
          ],
        },
      ],
    },
  ],
}
```