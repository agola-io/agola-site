---
title: User direct runs
lang: en-US
---

Users usually run the software tests manually on their workstation before committing and pushing to git. This usually requires a lot of resources, tests aren't executed in a clean environment and usually only part of the tests can be executed locally.

With agola we wanted to improve this workflow letting users execute the runs (also before committing and pushing). These runs are called **user direct runs** and are executed on the agola instances in the same environment as a project run. In this way users are able to test their software and runs in the same way they will be tested when pushing them or opening a pull request. All of this won't require a super powerful workstation.

## Executing a **user direct run**

A **user direct run** is executed with the agola cli. The agola cli command must be executed inside a local git repository. When executed it'll push the repository to the agola git repository and start a **user direct run**

```
agola --token $USER_TOKEN --gateway-url AGOLA_GATEWAY_URL directrun start
```

By default also untracked files are pushed but this can be disabled using the `--untracked=false` options. If you want to push also git ignored files you can pass the `--ignored` option



## How it works

Under the hood the `directrun start` command will commit changed files (and also untracked and optionally ignored files) in a temporary git branch (everything without impacting your current branch and local data) and push it to an internal agola git repository, then it'll create a direct run in the user namespace.

Why a git repository? In this way only changes are pushed instead of copying everytime all the repository files.