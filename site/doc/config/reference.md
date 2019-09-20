---
title: Run Configuration Reference
lang: en-US
---

- [Config](#config)
  - [Config file formats](#config-file-formats)
- [Global](#global)
  - [Version](#version)
  - [Runs](#runs)
    - [Run](#run)
      - [Task](#task)
        - [Depend](#depend)
        - [Step](#step)
          - [clone](#clone)
          - [run](#run)
          - [save_to_workspace](#savetoworkspace)
          - [restore_workspace](#restoreworkspace)
          - [save_cache](#savecache)
          - [restore_cache](#restorecache)
      - [Runtime](#runtime)
        - [Container](#container)
  - [Additional types](#additional-types)
    - [When](#when)
      - [Example](#example)
    - [Value](#value)
      - [As a string](#as-a-string)
      - [As a project variable](#as-a-project-variable)
    - [Docker Registry Auth](#docker-registry-auth)
- [Examples](#examples)
  - [yaml config](#yaml-config)
  - [jsonnet config](#jsonnet-config)

# Config

This is the reference of the agola config file format.

## Config file formats

The accepted syntaxes are (checked in this order):

* **jsonnet** (`.agola/config.jsonnet`)
* **yaml** (`.agola/config.yml`)
* **json** (`.agola/config.json`)

The config file is quite simple with just some syntactic sugar for easier definitions of some task steps. 

For basic configs you would prefer to use the `yml` syntax but for more complex configs we suggest to use the `jsonnet` syntax (see the examples).

Instead of adding some templating facilities to yaml that will always leave some open unsupported cases and add much more complexity we choosed to push the use of [jsonnet](https://jsonnet.org/) .

**jsonnet** helps writing a parametrizable and easy to maintain config. See the below matrix build example.

Generating a config with jsonnet keeps the principle of reproducible runs since a jsonnet file will always produce the same output.

You're also free to use you own way to generate the config file. Just commit the final result to git.


# Global

| Option  | Type              | Description      |
| ------- | ----------------- | ---------------- |
| version | String            | Config version   |
| runs    | List: [Run](#run) | Runs definitions |

## Version

The config file version. Currently only `v0`.


## Runs

### Run

| Option                 | Type                                                                                         | Description                                                                                   |
| ---------------------- | -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| name                   | String                                                                                       | Run name                                                                                      |
| tasks                  | List: Task                                                                                   | Run tasks                                                                                     |
| when                   | [When](#when)                                                                                | Conditions to match to execute this run. If the conditions aren't met then the run is skipped |
| docker_registries_auth | Map: RegistryHost(String) => DockerRegistryAuth([DockerRegistryAuth](#docker-registry-auth)) | Docker registries authentication data                                                         |

#### Task

| Option                 | Type                                                                                         | Description                                                                                     |
| ---------------------- | -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| name                   | String                                                                                       | Task name                                                                                       |
| runtime                | [Runtime](#runtime)                                                                          | Runtime definition                                                                              |
| steps                  | List: [Step](#step)                                                                          | Steps definitions                                                                               |
| environment            | Map: EnvVarName(String) => EnvVarValue([Value](#value))                                      | Environment variables to set                                                                    |
| working_dir            | String                                                                                       | The working dir where the steps will be executed (defualt: `~/project`)                         |
| shell                  | String                                                                                       | Shell to use (defaults to `/bin/sh -e`)                                                         |
| user                   | String                                                                                       | The user id or username to use when executing the task steps                                    |
| ignore_failure         | Boolean                                                                                      | Don't mark the run as failed if this task is failed                                             |
| approval               | Boolean                                                                                      | If true the task must be approved before it can start                                           |
| depends                | List: [Depend](#depend)                                                                      | List of task dependencies and conditions                                                        |
| when                   | [When](#when)                                                                                | Conditions to match to execute this task. If the conditions aren't met then the task is skipped |
| docker_registries_auth | Map: RegistryHost(String) => DockerRegistryAuth([DockerRegistryAuth](#docker-registry-auth)) | Docker registries authentication data                                                           |

##### Depend

| Option     | Type            | Description                                                                                                                                             |
| ---------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| task       | String          | Task name                                                                                                                                               |
| conditions | List: Condition | List of conditions to satisfy. If no condition is satisfied the task will be skipped. Possible conditions are: `on_success`, `on_failure`, `on_skipped` |

It's also available a short form for specifying a dependency (simpler when using yaml):

```yaml
  depends:
    - task 01 # depends on task 01 with default condition on_success 
    - task 02: # depends on task 02 with conditions on_failure, on_skipped 
      - on_failure
      - on_skipped
```


##### Step


| Option | Type   | Description |
| ------ | ------ | ----------- |
| Type   | String | Step type   |

There are different types of steps:

- clone: clones and checkouts (to the right commit sha) code
- run: executes e command
- save_to_workspace: save in the run workspace the specified files/dirs
- restore_workspace: restores the run workspace in the specified dir
- save_cache: save some contents in a project cache key.
- restore_cache: restores contents from a project cache.

Every step can have a short form (simpler when using yaml) or a normal form:

- Short form:
```yaml
   $stepname: $stepdefinition
```

Examples:
```yaml
   run:
     name: "run step"
     command: "echo something"
```

- Normal form:
```yaml
   type: $steptype
   $otherstep fields
```

Examples:
```yaml
   type: run
   name: "run step"
   command: "echo something"
```

###### clone

clone clones and checkouts (to the right commit sha) code

###### run

- Short form:

```yaml
run: command
```

The command must be a one line command
In this case the run step name will be the same of the command trimmed at the maximum name size.

- Long form:

| Option      | Type                                             | Description                                                                                                                         |
| ----------- | ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| name        | String                                           | Step name. Required when the command is multiline. If not provided will be the same of the command trimmed at the maximum name size |
| command     | String                                           | Command to run                                                                                                                      |
| environment | Map: EnvVar Name(String) => EnvVar Value(String) | Environment variables to set                                                                                                        |
| working_dir | String                                           | The working dir where the steps will be executed                                                                                    |
| shell       | String                                           | Shell to use (defaults to `/bin/sh -e`)                                                                                             |

###### save_to_workspace

| Option   | Type          | Description                       |
| -------- | ------------- | --------------------------------- |
| contents | List: content | Contents to save in the workspace |

**content**

| Option     | Type         | Description                                                                                                     |
| ---------- | ------------ | --------------------------------------------------------------------------------------------------------------- |
| source_dir | String       | Source dir where to take the files to save                                                                      |
| dest_dir   | String       | Workspace destination dir where to save the files                                                               |
| paths      | List: String | Contents to save in the workspace. Every path accepts the `**` (doublestar) notation to match all the subchilds |

###### restore_workspace

| Option   | Type   | Description                                    |
| -------- | ------ | ---------------------------------------------- |
| dest_dir | String | Destination dir where to restore the workspace |

###### save_cache

| Option   | Type          | Description                       |
| -------- | ------------- | --------------------------------- |
| contents | List: content | Contents to save in the workspace |

**content**

| Option     | Type         | Description                                                                                                                                                             |
| ---------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| key        | String       | Cache key to save. It's a template to dynamically generate cache keys based on runtime data. See [caching](caching.md)                                                  |
| source_dir | String       | Source dir where to take the files to save                                                                                                                              |
| dest_dir   | String       | Workspace destination dir where to save the files                                                                                                                       |
| paths      | List: String | Contents to save in the workspace, if empty all the files inside source_dir will be saved. Every path accepts the `**` (doublestar) notation to match all the subchilds |

###### restore_cache

| Option   | Type           | Description                                                                                                                                                                                                                                                             |
| -------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| keys     | List of String | List of cache key to restore. Every entry is a template to dynamically generate cache keys based on runtime data. See [caching](caching.md). They'll tried in order until a match by prefix of an existing cache key is found, the newest matching key will be restored |
| dest_dir | String         | Destination dir where to restore the cache                                                                                                                                                                                                                              |


#### Runtime

| Option     | Type                          | Description                                                                                                                                                                                   |
| ---------- | ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type       | String                        | Runtime Type (currently only `pod` is supported)                                                                                                                                              |
| arch       | String                        | Architecture (valid architectures are: `386` `amd64` `arm` `arm64`                                                                                                                            |
| containers | List: [Container](#container) | A list of containers, the first container will be the one where the tasks steps will be executed. Other containers may be defined to provide services needed for the task (a database etc...) |

##### Container

| Option      | Type                                                    | Description                                                                        |
| ----------- | ------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| image       | String                                                  | Image to use                                                                       |
| environment | Map: EnvVarName(String) => EnvVarValue([Value](#value)) | Environment variables to set                                                       |
| working_dir | String                                                  | Working dir where the entrypoint will be executed (also used for steps in a task)  |
| user        | String                                                  | The user id or username to use when executing the entrypoint or the task run steps |

## Additional types

### When

When represent a set of conditions to match

| Option | Type                                                        | Description                                  |
| ------ | ----------------------------------------------------------- | -------------------------------------------- |
| branch | String, List of String or map with keys `include`/`exclude` | Match a branch with the specified conditions |
| tag    | String, List of String or map with keys `include`/`exclude` | Match a tag with the specified conditions    |
| ref    | String, List of String or map with keys `include`/`exclude` | Match a ref with the specified conditions    |

The value provided to branch/tag/ref can be different:
* A string
* A list of strings
* A map with keys `include` and `exclude` and values string or list of string (like above). In this way the branch/ref/tag must be included and not excluded

The provided strings can be a simple string (the value must match that string) or a regular expression (when enclosed in `/` or `#`)


#### Example

``` yaml
  runs:
    - name: run01
      tasks:
        - name: task01
          when:
            branch: master
            tag:
              - v1.0
              - /v1\..*/
            ref:
              include: master
              exclude: [ '#/refs/pull/.*#' , /refs/heads/branch01 ]
```

The task `task01` will be executed only if:
* we are on a branch with value `master`
* we are on a tag with value `v1.0` or that matches the regexp `v1\..*` (i.e `v1.0`, `v1.2` but not `v10` or `v2`)
* we are on a ref that match the regexp `/refs/pull/.*` or the value "/refs/heads/branch01`

### Value

A value that can be defined as a string or from a project variable

#### As a string

``` yaml
password: yoursecretpassword
```

#### As a project variable

``` yaml
password:
  from_variable: yoursecretpassword
```

### Docker Registry Auth

| Option   | Type            | Description                                                                                                        |
| -------- | --------------- | ------------------------------------------------------------------------------------------------------------------ |
| type     | String          | Registry authentication type: `basic` (default) or `encodeauth` only `default` is supported)                       |
| username | [Value](#value) | Registry username. Can be a string or from a variable                                                              |
| password | [Value](#value) | Registry password. Can be a string or from a variable                                                              |
| auth     | [Value](#value) | Represents and encoded auth string like the one used in the docker config.json. Can be a string or from a variable |


# Examples

## yaml config

``` yaml
version: v0

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

## jsonnet config

This is an example jsonnet config the creates a build matrix between go version and architecture.

It generates 4 "go build" with the different combinations.

``` json
local go_runtime(version, arch) = {
  type: 'pod',
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
            type: 'pod',
            arch: 'amd64',
            containers: [
              { image: 'debian:stretch' },
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