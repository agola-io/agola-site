---
title: Docker registries authentication
lang: en-US
---

# Docker Registries Authentication

If you need to authenticate to one or more docker registries you can define
the authentication information at the global, run or task level. The values
will be merged toghether (with override precedence: task -> run -> global).


### Example per run registries configuration

``` yaml
runs:
  - name: myrun
    docker_registries_auth:
      'index.docker.io':
        username: 'username'
        password:
          from_variable: dockerpassword
      # A private registry
      'myprivateregistry.myorg.com':
        username:
          from_variable: myprivareregistry_username
        password:
          from_variable: myprivareregistry_password
      # A local registry referenced by ip:port
      '192.168.122.1:5000':
        username: 'username'
        password: 'xxxxxxxxxxxx'
    tasks:

```