---
title: Runs/Tasks/Steps
lang: en-US
---

## Run

A run is a workflow that executes different tasks.

## Task

A Task is a group of steps.

Every tasks is executed in the same container and is composed of multiple steps that are executed sequentially. If a step fails the whole task is marked as failed.

Every task can have dependencies from other tasks and tasks can be grouped (coming soon) toghether.

## Step

A step does a specific operation. There are multiple kinds of steps:

* clone: clones the git repository and checkouts the right commit
* run: executes a shell script
* save_to_workspace: saves some contents in the workspace
* restore_workspace: restores the workspace
* save_cache: saves some contents in the cache
* restore_cache: restores the cache
