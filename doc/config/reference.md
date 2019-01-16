---
title: Pipeline Configuration Reference
lang: en-US
---

# Config

This is the reference of the `.agola/config.yml` file

- [Config](#config)
  - [Version](#version)
  - [Runtimes](#runtimes)
    - [Runtime](#runtime)
      - [Container](#container)
  - [Tasks](#tasks)
      - [Task](#task)
        - [Step](#step)
          - [clone](#clone)
          - [run](#run)
          - [save_to_workspace](#savetoworkspace)
          - [restore_workspace](#restoreworkspace)
  - [Pipelines](#pipelines)
    - [Pipeline](#pipeline)
      - [Element](#element)
- [Examples](#examples)


| Option    | Type                                                | Description           |
| --------- | --------------------------------------------------- | --------------------- |
| version   | String                                              | Config version        |
| runtimes  | Map: Runtime Name(String) => [Runtime](#runtime)    | Runtimes definitions  |
| tasks     | Map: Task Name(String) => [Task](#task)             | Tasks definitions     |
| pipelines | Map: Pipeline Name(String) => [Pipeline](#pipeline) | Pipelines definitions |

## Version

## Runtimes

### Runtime

| Option     | Type                          | Description                                                                                                                                                                                   |
| ---------- | ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type       | String                        | Runtime Type (currently only `pod` is supported)                                                                                                                                              |
| arch       | String                        | Architecture (valid architectures are: `386` `amd64` `arm` `arm64`                                                                                                                            |
| containers | List: [Container](#container) | A list of containers, the first container will be the one where the tasks steps will be executed. Other containers may be defined to provide services needed for the task (a database etc...) |

#### Container

| Option      | Type                                             | Description                                                                        |
| ----------- | ------------------------------------------------ | ---------------------------------------------------------------------------------- |
| image       | String                                           | Image to use                                                                       |
| environment | Map: EnvVar Name(String) => EnvVar Value(String) | Environment variables to set                                                       |
| working_dir | String                                           | Working dir where the entrypoint will be executed (also used for steps in a task)  |
| user        | String                                           | The user id or username to use when executing the entrypoint or the task run steps |

## Tasks

#### Task

| Option      | Type                                             | Description                                      |
| ----------- | ------------------------------------------------ | ------------------------------------------------ |
| runtime     | String                                           | Runtimes to use                                  |
| steps       | List of Step types                               | Steps definitions                                |
| environment | Map: EnvVar Name(String) => EnvVar Value(String) | Environment variables to set                     |
| working_dir | String                                           | The working dir where the steps will be executed |
| shell       | String                                           | Shell to use (defaults to `/bin/sh -e`)          |

##### Step

There are different types of steps:

- clone: clones and checkouts (to the right commit sha) code
- run: executes e command
- save_to_workspace: save in the pipeline workspace the specified files/dirs
- restore_workspace: restores the pipeline workspace in the specified dir

###### clone

clone clones and checkouts (to the right commit sha) code

###### run

- Short form:

```
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
| user        | String                                           | The user id or username to use when executing the command                                                                           |

###### save_to_workspace

| Option   | Type          | Description                       |
| -------- | ------------- | --------------------------------- |
| contents | List: content | Contents to save in the workspace |

**content**

| Option     | Type         | Description                                       |
| ---------- | ------------ | ------------------------------------------------- |
| source_dir | String       | Source dir where to take the files to save        |
| dest_dir   | String       | Workspace destination dir where to save the files |
| paths      | List: String | Contents to save in the workspace                 |

###### restore_workspace

| Option   | Type   | Description                                    |
| -------- | ------ | ---------------------------------------------- |
| dest_dir | String | Destination dir where to restore the workspace |

## Pipelines

### Pipeline

| Option   | Type                                | Description       |
| -------- | ----------------------------------- | ----------------- |
| elements | Map (Element Name(String): Element) | Pipeline elements |

#### Element

| Option         | Type         | Description                                                                    |
| -------------- | ------------ | ------------------------------------------------------------------------------ |
| task           | String       | Reference to a task name to run inside this element                            |
| depends        | List: String | Reference to an element name in the pipeline which this element will depend on |
| ignore_failure | List: String | Don't mark the pipeline as failed if this task is failed                       |
| approval       | Boolean      | If true the task must be approved before it can start                          |


# Examples

``` yaml
runtimes:
  runtime01:
    type: pod
    arch: amd64
    containers:
      # Primary image
      - image: golang:1.11-stretch
        environment:
          ENV01: ENV01-01
          PIPPONE: PLUTONE
        entrypoint:
  runtime02:
    type: pod
    arch: amd64
    containers:
      # Primary image
      - image: golang:1.10-stretch
        environment:
          ENV01: ENV01-01
          PIPPONE: PLUTONE
        entrypoint:

tasks:
  task01:
    runtime: runtime01
    working_dir: /go/src/github.com/sorintlab/stolon
    environment:
      ENV01: ENV01-02
    steps:
      - run: env
      - run: git clone $REPOSITORY_URL .
      - run: ./build
      - run: ./test
      - run: find .
      - run:
          command: env
          environment:
            ENV01: ENV01-03
            BLA: FOO
      - run:
          #command: while true; do date; sleep 0.5; done
          command: touch /tmp/file01
      - run:
          command: find /tmp/ -ls
      - save_to_workspace:
          contents:
            - source_dir: /tmp
              paths:
                - "*"
  task02:
    runtime: runtime01
    steps:
      - run:
          #command: while true; do date; sleep 0.5; done
          name: "touch"
          command: touch /tmp/file01
      - run:
          command: find /tmp/ -ls
      - save_to_workspace:
          contents:
            - source_dir: /tmp
              paths:
                - "*"
  task03:
    runtime: runtime01
    steps:
      - restore_workspace:
          dest_dir: /tmp/workspace
      - run:
          #command: while true; do date; sleep 0.5; done
          command: find /tmp/ -ls
      - run:
          command: ls -l /tmp/

pipelines:
  pipeline01:
    elements:
      element 01:
        task: task01
      element 02:
        task: task02
      element 03:
        task: task03
        depends:
          - element 01
          - element 02
```
