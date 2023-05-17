---
title: Demo
lang: en-US
---

## Agola demo image

The dockerhub `sorintlab/agolademo` is a demo image to easily test agola, it comes with a predefined configuration that uses an embedded etcd. Don't use it in production but build your own image or use the `sorintlab/agola` image

We assume `172.17.0.1` is the docker default network where ports are exported

## Start

```
docker run \
-v=/var/run/docker.sock:/var/run/docker.sock \
-v=/path/to/local/agola/data:/data/agola \
-p 8000:8000 \
sorintlab/agolademo \
serve --embedded-etcd --components all-base,executor
```

## Connect

Point your browser to `http://172.17.0.1:8000`

You'll see the main agola ui page with a `Register` and a `Login` button at the top right. But before being able to register and login we should first link agola with at least one remote source (github, gitlab, gitea). See the next steps.

## Test using a local gitea instance

First annotate your docker bridge local network address. Usually it's `172.17.0.1`. This is needed to correctly setup gitea and agola to communicate togheter without using docker links or a more complex network setup.

#### Start gitea local demo

::: warning
NOTE: if you have an ssh server running locally you should stop it
:::

```
docker run -d --name gitea -v /path/to/gitea-data:/data -p 3000:3000 -p 22:22 gitea/gitea:latest
```

This will save your gitea data inside your host `/path/to/gitea` directory

#### Setup gitea

* Access gitea on `http://172.17.0.1:3000`
* In the initial setup page you should change:
  * the *Gitea Base URL* to `http://$YOURDOCKERLOCALIP:3000` (i.e. `http://172.17.0.1:3000`)
  * the *SSH Server Domain* to `$YOURDOCKERLOCALIP` (i.e. `172.17.0.1`)
* Register a new user
* Under your user settings, add your ssh public key (to be able to push to repositories)

::: warning
Your gitea image should be new enough to support oauth2 (if pull a newer image or skip the next step).
:::

* Now create an oauth2 app under your user settings -> Applications -> Manage OAuth2 Applications. As the applicatin name set "Agola" and as redirect uri `http://172.17.0.1:8000/oauth2/callback`. Keep note of the provided "Client ID" and "Client Secret".

### Add a gitea remote source

A remote source defines a remote git provider (like gitea, gitlab, github)

Gitea only recently provided a oauth2 provider (<https://github.com/go-gitea/gitea/pull/5378>). For old version we can just use the old username/password flow to create an user api token (use `--auth-type password` instead of `--auth-type oauth2` in the below command)

The create a remote source we'll use the agola command in cli mode:

```
docker run --rm sorintlab/agolademo --token "admintoken" --gateway-url http://172.17.0.1:8000 remotesource create \
--name gitea \
--type gitea \
--api-url http://172.17.0.1:3000 \
--auth-type oauth2 \
--clientid $GITEA_APP_CLIENTID \
--secret $GITEA_APP_CLIENTSECRET \
--skip-ssh-host-key-check
```

"admintoken" is a token defined in the default agolademo configuration and will let you act with the api as an admin without the need of an user created inside agola.

* `--skip-ssh-host-key-check` is used to speed up things and tells agola to not check gitea host ssh host key when cloning repositories. The right thing to do will be to provide the ssh host key using the option `--ssh-host-key`. You can get the host key using `ssh-keyscan $giteahost` and choosing the ecdsa or rsa host key provided line (use the whole line)

### Register

Login to the agola web ui on <http://172.17.0.1:8000> and choose register, then **register with gitea**. If everything goes well gitea will ask you to accept the authorization and then you'll be redirected back to the user registration form. Next you can Login.

### Create a user api token

Use the web interface or the cli:

```
docker run --rm sorintlab/agolademo --token admintoken --gateway-url http://172.17.0.1:8000 user token create -n $YOUR_AGOLA_USERNAME -t default
```

Save the token since it won't be displayed again.

#### Testing with an example repository

We'll use the [agola-example-go](https://github.com/agola-io/agola-example-go) repository

* Clone to above repository locally

* Create a repository on gitea called `agola-example-go`

* Create a project in agola connected to the gitea repository using the web interface or the cli:

```
docker run --rm sorintlab/agolademo --token $TOKEN --gateway-url http://172.17.0.1:8000 project create \
--parent "user/$AGOLAUSER" \
--name agola-example-go \
--remote-source gitea \
--repo-path $GITEAUSER/agola-example-go
```

where:

* `--token` is your agola user api token
* `--name` is the agola project associated to your gitea repository that you want to create
* `--remote-source` is the remote source providing the repository
* `--repo-path` is the remote source repository path

* Push the `agola-example-go` repository you've previousy cloned to the gitea repository, for example:

```
git remote add mygitea git@172.17.0.1:$GITEAUSER/agola-example-go.git
git push -u mygitea master
```

If everything is ok, you should see a **run** started in the agola web ui (<http://172.17.0.1:8000>). Or take a look at the agola container logs to see what has failed.
