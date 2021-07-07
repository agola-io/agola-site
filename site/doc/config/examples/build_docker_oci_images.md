---
title: Building and pushing docker/oci images
lang: en-US
---

You can build and push docker/oci images without the need to execute a docker daemon (and requiring privileged containers) thanks to tools like [kaniko](https://github.com/GoogleContainerTools/kaniko) and [buildah](https://buildah.io)

### Using Kaniko

#### Basic image build

A basic task for building images using kaniko is this. Add `--no-push` if you don't want to push the image. This doesn't take care of registry authentication. See below for an example with registry authentication.

``` yaml
    tasks:
      # kaniko image doesn't have the git command installed
      - name: checkout code
        runtime:
          containers:
            - image: alpine/git
        steps:
          - clone:
          - save_to_workspace:
              contents:
                - source_dir: .
                  dest_dir: .
                  paths:
                    - '**'
      - name: build docker image
        runtime:
          containers:
            - image: gcr.io/kaniko-project/executor:debug
        shell: /busybox/sh
        steps:
          - restore_workspace:
              dest_dir: .
          #- run: /kaniko/executor --no-push
          - run: /kaniko/executor --destination registry/image
        depends:
          - checkout code
```

#### With authentication

For more information refer to the kaniko doc.
Kaniko document some ways to authenticate to gcr and aws registries and its images already include a credential helper for amazon ecr.

At the end you should create a docker config.json config file with the required auth data:


``` yaml
    tasks:
      # kaniko image doesn't have the git command installed
      - name: checkout code
        runtime:
          containers:
            - image: alpine/git
        steps:
          - clone:
          - save_to_workspace:
              contents:
                - source_dir: .
                  dest_dir: .
                  paths:
                    - '**'
      - name: build docker image
        runtime:
          containers:
            - image: gcr.io/kaniko-project/executor:debug
        environment:
          DOCKERAUTH:
            from_variable: dockerauth
        shell: /busybox/sh
        steps:
          - restore_workspace:
              dest_dir: .
          - run:
              name: generate docker config
              command: |
                cat << EOF > /kaniko/.docker/config.json
                {
                  "auths": {
                    "https://index.docker.io/v1/": { "auth" : "$DOCKERAUTH" }
                  }
                }
                EOF
          - run: /kaniko/executor --destination registry/image
        depends:
          - checkout code
```

### Using Buildah

#### Basic image build

A basic task for building images using buildah is this. Comment `buildah push` run step if you don't want to push the image. This doesn't take care of registry authentication. See below for an example with registry authentication.

``` yaml
    tasks:
      # buildah image doesn't have the git command installed
      - name: checkout code
        runtime:
          containers:
            - image: alpine/git
        steps:
          - clone:
          - save_to_workspace:
              contents:
                - source_dir: .
                  dest_dir: .
                  paths:
                    - '**'
      - name: build docker image
        runtime:
          containers:
            - image: buildah/buildah:latest
              privileged: true
        steps:
          - restore_workspace:
              dest_dir: .
          - run: buildah bud --format docker -t registry/image .
          - run: buildah push registry/image
        depends:
          - checkout code
```
#### With authentication

In this example credentials are in the simplest format `username:password` stored into a project variable. For more information refer to the buildah doc.

``` yaml
    tasks:
      # buildah image doesn't have the git command installed
      - name: checkout code
        runtime:
          containers:
            - image: alpine/git
        environment:
          DOCKERAUTH:
            from_variable: dockerauth
        steps:
          - clone:
          - save_to_workspace:
              contents:
                - source_dir: .
                  dest_dir: .
                  paths:
                    - '**'
      - name: build docker image
        runtime:
          containers:
            - image: buildah/buildah:latest
              privileged: true
        steps:
          - restore_workspace:
              dest_dir: .
          - run: buildah bud --format docker -t registry/image .
          - run: buildah push --creds=$DOCKERAUTH registry/image
        depends:
          - checkout code
```
