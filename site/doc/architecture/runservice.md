---
title: Run Service
lang: en-US
---

# Run Service

The run service manages and execute runs.
A **run** is a group of tasks. Each task can depend on another task to achieve fan-in and fan-out

## Features

- Fully distributed system
- Ability to store millions of runs
- Sharding (TODO)
- API to query, submit and manage runs
  - Provides optimistic locking to handle concurrent updates

The run service doesn't have any knowledge of some high level concepts provided by agola like "projects", "commit", "user" etc... it just manage and stores runs and provide these information to external clients.

## Executors

The executors talks with the runservice and execute the scheduled tasks.

Executors are primarily stateless (they temporary stores locally the steps logs and the workspace archives before they'll be fetched by the runservice).

Executors are the source of truth for the task state.
If the scheduler has scheduled a task on an executor and this executor disappears (cannot talk with the runservice for whatever reason) the runservice will never mark the task as finished until the executor comes back or it's forcefully removed by the runservice.

This is done to achieve at most once run execution and avoid problems like stale uncontrolled tasks acting concurrently with other task (not a problem during a build/test but quite an issue when doing a deploy).

Executors registers with the runservice. Their registration can be durable or temporary depending on the used driver (see below).

Permanent executors must be removed from the runservice when they are dismissed (this process is done calling an runservice api and can be automated to talk with a cloud provider api and remove the executor when the related instance doesn't exists anymore).
Temporary executors will be automatically removed since they will be part of an executor group that will report which executors are part of it and clean stale tasks from disappeared executors.

An executor can use different drivers:

* Docker (local docker daemon)
* Kubernetes

### Docker driver

The docker driver talks with a local docker daemon and schedule tasks as containers

In this mode executors is permanent since it's the unique one that has the control of the containers

### Kubernetes driver

The kubernetes driver talks with a k8s cluster. It executes tasks as pods on a specific namespace.
Executor can be deployed inside the k8s cluster or externally.

There can be multiple executors talking with the same k8s cluster on the same namespace. Every executor will manage its tasks.
These executor will form an executor group and will be automatically added/removed by the runservice. So they can be easility deployed as a k8s deployment and can come and go. The other executors will clean stale pods/secrets left by a disappeared executor.


## Concepts

### Change Groups

Every run, when queued, can be assigned to one or more rungroups.
These rungroups have the purpose to permit high level scheduling managed by the runservice clients:

- Query runs by their rungroup to know of many of them are queued, running etc...
- Do optimistic locking on API call to avoid concurrent changes

For example, if the scheduler wants to limit the number of active **runs** per project, it could define the changegroup of these runs to an unique id (for example the projectID) and use the **runservice** API to query how many runs are queued for this changegroup, how many runs are active and then start a new run only when the current running runs number is lesser then the limit for the project.
Since there can be multiple scheduler instances that can submit multiple concurrent operations on the same changegroup, the APIs also provides a _Changegroup Update Token_ when querying runs. This token can be used when calling mutating APIs and so only one of these concurrent operations will succeed.

In the above example, if two client instances tries to start a new run, without optimistic locking it may happen that both starts a new run and this create a number of active runs greater than the wanted limits.
