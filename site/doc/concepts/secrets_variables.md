---
title: Secrets and Variables
lang: en-US
---

Agola secrets and variables are a powerful way to provide secret data to a run (that cannot be stored inside the run definition or it'll leak important secrets)

They are designed to achieve multiple goals:

* Ability to execute a run on different environments reusing the same run definition (avoiding as much as possible creating conditional tasks based on the environment). The idea is that users could "test" a run on a testing environment when opening a PR or committing to a development branch and then use the same run definition when merging the PR/branch or creating a tag to deploy on the production environemt. This is achieved by the variable values conditions: a variable will have a different value based on the first matching condition (branch, tag, ref).
* Ability to inherit secret/variables on multiple project. I.E. define the secrets/variable on a project group and have them inherited by all the child projects/projectgroups. In this way user don't have to redefine the same secret/variable multiple times on every project and manage to keep them updated when something changes.

## Secrets

Every organization, project group or project can have some secrets assigned. 

Each secret may contain one or more couples key-value, that can be referenced by the variables. 

These secrets can be:

* **local secrets**
* **remote secrets**: secrets provided by a remote secret manager (like hashicorp vault)

::: warning
Currently only local secrets are implemented (see the related [enhancement tracking issue](https://github.com/agola-io/agola/issues/31))
:::

Secrets are "inherited" by child projectgroups/projects. To add a secret to an organization, you can use the root projectgroup (`-- projectgroup org/{org-name}`).


## Variables

Every organization, project group or project can have some variables defined.

Each variables will expose only one value to the runs.

A variable can be created with multiple values, each value with its condition (`when`, for `branch`, `ref` or `tag`).
The final value assigned to a run will be the first matched condition, top to bottom.

The variable value references a secret. The first secret with the referenced name starting from the current project and walking up until the root project group will be used.
Currently if no secret is found the variable values will be empty.

Variables are "inherited" by child projectgroups/projects.
To add a variable to an organization, you can use the root projectgroup (`-- projectgroup org/{org-name}`)

## Example

Suppose we have a project group called "product01" and two sub projects "service01" and "service02". These projects will have a run definition that, after successful build and tests will build a docker image and push it to a docker registry and then deploy the service to a kubernetes cluster.

We'll use a git based workflow where the **master** branch is the primary branch, users will create PRs (tests and code review) and then merge PRs on the **master** branch. When master is ready for a release a tag will be pushed.

PRs will use their own test environments, master will use it's own staging environment and tags will use the production environment.

We could create 3 different secrets with all the related key/value pairs (docker registry auth, k8s cluster auth etc...) for testing/staging/production 

We'll then define a variable containing the docker credential with some condition that will choose the right variable. Example using the cli.

### Create the secrets

`secret-testing.yml:`
``` yaml
dockerpassword: secretdockerpassword
kubecfg: kubecfgbase64
```

``` sh
agola projectgroup secret create --projectgroup org/org01/product01 --name secret-testing -f secret-testing.yml
```

Then we'll do the same for the staging and production secrets.


### Create the variable

`dockerpassword.yml:`
``` yaml
- secret_name: secret-testing
  secret_var: dockerpassword
  when:
    ref: '#/refs/pull/.*#'
- secret_name: secret-staging
  secret_var: dockerpassword
  when:
    branch: master
- secret_name: secret-production
  secret_var: dockerpassword
  when:
    tag: '#v1\..*'
```

``` sh
agola projectgroup variable create --projectgroup org/org01/product01 --name dockerpassword -f dockerpassword.yml
```

Then we'll do the same for the other variables (i.e. kubecfg)

Our run definition  can be the same. An excerpt defining the docker registry auth could be something like:


``` yaml
runs:
  - name: deploy
    docker_registries_auth:
      'myprivateregistry.example.com':
        username: 'username'
        password:
          from_variable: dockerpassword
    tasks:
      - ...
      - name: build docker image
        environment:
          DOCKERAUTH:
            from_variable: dockerpassword
        steps:
         # Steps to build and push the docker image
         - ...
      ...
```

When a run is created, the variable condition will be evaluated and the matching variable value will be used, then a secret matching the secret name will be used and the registry password will be set to its value. In this case the "dockerpassword" variable will be set both as the docker registries auth entry (all the images fetched by the executor for a task will use these credential) and also exported as an environment variable for a task.
