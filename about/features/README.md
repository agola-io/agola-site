---
title: Features 
lang: en-US
---


# Agola features

## Git managed workflow

Runs definitions are committed inside your git repositories and triggered upon push/tag/pull request.

We want to leverage your existing git workflow, for this reason the Run definitions should live inside your git repositories. This has lot of advantages:
* The run definition is tied to the rest of the code:
  * You'll be able to execute a run from a specific commit at every time without surprises since the definition isn't changed
  * You can have multiple definitions for different branches (if really needed...)

## Testable Runs

What is a CI/CD environment if you cannot test your changes to the Runs definitions?

To easily test your Runs definitions you need the ability to keep the same Runs definition but access to different resource (different deploy environments, different docker registries etc...)

For example you'd like to test your deployments on different test environments before executing them on production without changing parts of the definition.

This ability is provided by an easy but powerful dynamic variable system: you can define different variable values to be applied to you runs (i.e. test environment endpoints, credentials etc...) based on the branch/tag/ref

In this way you can make your changes to thw runs definition, push it to a test branch (or a pull request). The triggred run will be executed on the environment defined in the related project variables for the branch. If everything is ok you can commit the change to master and have it applied to the production environment without changing a line of your run definition

# Restartable runs

Runs can be restarted from failed tasks, from start or from every completed tasks (coming soon).

This is possible thanks to the run [workspace](/doc/concepts/workspaces) layering.

## Containerized and reproducible Runs

Every run task is executed inside containers using your preferred image.

Multiple kind of [executors](/doc/architecture/runservice.html#executors)

Execute your runs in a reproducible containerized environment.

## Advanced workflows (fan-in, fan-out, multi arch etc...)
Implement every kind of workflow you want from simple builds to complex deployments.

## Multiple git sources integrations
GitHub, GitLab, Gitea, custom Git repositories (and more to come)

## Multiple execution platforms
Execute you tasks inside a Kubernetes cluster, local docker etc...

## Enhance your git workflow
Runs definitions are committed inside your git repositories and triggered upon push/tag/pull request.

## Users Local Runs
Execute user runs from your local git repository on agola with just one command (also without the need to commit/push)



### Architectural features

