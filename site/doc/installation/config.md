---
title: Configuration
lang: en-US
---

## Components configuration

When starting an agola instance it will read its config from the configuration file

::: warning
Since agola is composed of many components that can be distributed you should keep the configuration file in sync between all components
:::

## Agola configuration file reference

This is a full commented example (with all the available options):

``` yaml
gateway:
  # The gateway api exposed url to client
  apiExposedURL: "https://youragola.com"
  # The web interface exposed url to client, usually the same as the api
  # exposed url but you can separate the api url from the web url
  webExposedURL: "https://youragola.com"
  # The run service url (use a load balancer when having multiple run services)
  runserviceURL: "http://runservice:4000"
  # The config store url (use a load balancer when having multiple run services)
  configstoreURL: "http://configstore:4002"
  # The agola internal git server url (currently only a single instance is supported)
  gitserverURL: "http://gitserver:4003"

  # web server config
  web:
    listenAddress: ":8000"
    # use TLS (https)
    tls: true
    # TLSCert is the path to the pem formatted server certificate. If the
    # certificate is signed by a certificate authority, the certFile should be
    # the concatenation of the server's certificate, any intermediates, and the
    # CA's certificate.
    #
    tlsCertFile: "/path/to/certfile"

    # Server cert private key
    #
    tlsKeyFile: "/path/to/certkeyfile"

    # CORS allowed origins
    # Enable if the web ui is on a different host:port than the gateway api
    #allowedOrigins: "*"

  # token signing configuration
  tokenSigning:
    # token duration (defaults to 12 hours)
    #duration: 12h

    # hmac or rsa (if possible use rsa)
    method: hmac
    # key to use when signing with hmac
    key: supersecretsigningkey

    # paths to the private and public keys in pem encoding when using rsa signing
    #privateKeyPath: /path/to/privatekey.pem
    #publicKeyPath: /path/to/public.pem

  # admin token, token to use to do super user agola administration
  adminToken: "changeme"

scheduler:
  runserviceURL: "http://runservice:4000"

notification:
  webExposedURL: "https://youragola.com"
  runserviceURL: "http://runservice:4000"
  configstoreURL: "http://configstore:4002"

  # etcd client configuration
  etcd:
    endpoints: "http://youretcd:2379"
    # etc client tls config
    #tlsCertFile
    #tlsKeyFile
    #tlsCAFile
    #tlsSkipVerify

configstore:
  dataDir: /data/agola/configstore

  etcd:
    endpoints: "http://localhost:2379"

  objectStorage:
    # posix based object storage. It requires a shared posix fs like nfs, chepfs etc...
    #
    #type: posix
    #path: /data/agola/configstore/ost

    # s3 based object storage
    type: s3
    # example with minio
    endpoint: "http://yourminio:9000"
    bucket: configstore
    accessKey: minio
    secretAccessKey: minio123

  web:
    listenAddress: ":4002"

runservice:
  #debug: true
  dataDir: /data/agola/runservice
  etcd:
    endpoints: "http://localhost:2379"
  objectStorage:
    # posix based object storage. It requires a shared posix fs like nfs, chepfs etc...
    #
    #type: posix
    #path: /data/agola/configstore/ost

    # s3 based object storage
    type: s3
    # example with minio
    endpoint: "http://yourminio:9000"
    bucket: configstore
    accessKey: minio
    secretAccessKey: minio123

  web:
    listenAddress: ":4000"

executor:
  # local data directory
  dataDir: /data/agola/executor
  # The directory containing the toolbox compiled for the various supported architectures
  toolboxPath: ./bin
  runserviceURL: "http://runservice:4000"
  web:
    listenAddress: ":4001"
  activeTasksLimit: 2
  driver:
    type: docker
  # allow to run privileged containers
  allowPrivilegedContainers: false
  # initial image used by the task setup phase. By default it'll be
  # busybox:stable (on dockerhub), to avoid possible pull errors due to
  # dockerhub limits you can define your own custom init image (it must be a
  # busybox like image) and optional registry authentication.
  initImage:
    image: "busybox:stable"
    #auth:
      # auth type: basic or encodedauth
      #type: "basic"
      #
      # basic auth
      #username: "username"
      #password: "password"
      #
      # encoded auth string
      #auth: "..."


gitserver:
  # local data directory
  dataDir: /data/agola/gitserver
  gatewayURL: "https://youragola.com"

  web:
    listenAddress: ":4003"
```
