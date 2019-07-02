---
title: Standalone
lang: en-US
---


## Deployment types

Since agola is composed of multiple components you can deploy it in many different ways based on your requirements and scaling needs. Here some examples:

## Prerequisites

* An etcd cluster
* An object storage:
  * A posix shared fs like nfs or cephfs
  * A S3 based storage

Create a configuration file with the correct entries to your etcd, objectstorage and components config (see the [configuration reference](config))


### High available with N executors

#### Start all the management components (except executor)
```
agola serve --config ./config-localhost.yml --components all-base
```
You can have N instances of all the base components for high availability and scaling (with the current exclusion of the git server used for user direct runs that is currently a single instance so only one of the n started will be used based on the gateway `gitserverURL` setting in your config file)

#### Start the executors

On every "executor" machine:

```
agola serve --config ./config-localhost.yml --components executor
```


