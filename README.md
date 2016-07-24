# mktmpio [![Build Status](https://travis-ci.org/mktmpio/node-mktmpio.svg?branch=master)](https://travis-ci.org/mktmpio/node-mktmpio)

CLI and Node client for https://mktmp.io/ service.

> **Note:** If you are looking for a more full-featured CLI, you should take a
> look at [mktmpio/cli](https://github.com/mktmpio/cli).

## Installation

> **NOTE:** This package is open source, but installation from npmjs.com is
> subject to the [mktmpio Privacy Policy](https://mktmp.io/privacy-policy).

    $ npm install -g mktmpio
    $ echo 'token: $MY_TOKEN' > ~/.mktmpio.yml

## Usage

Once installed and your `~/.mktmpio.yml` config contains your mktmpio auth
token you can create an instance of any of the supported services:

    $ mktmpio $TYPE

### Examples

#### Redis

```
$ mktmpio redis
i.mktmp.io:32806> SCAN 0
1) "0"
2) (empty list or set)
i.mktmp.io:32806>exit
instance e19b07bca586 terminated
$
```

#### MySQL

```
$ mktmpio mysql
mysql> select 1, 2;
+---+---+
| 1 | 2 |
+---+---+
| 1 | 2 |
+---+---+
1 row in set (0.07 sec)

mysql> exit
Bye
instance 3b9f136893da terminated
$
```

## Legal

&copy; 2015,2016 Datajin Technologies, Inc.

This package is open source under an Artistic 2.0 license, but installation
of this module and use of the mktmpio service are both subject to the
[mktmpio Privacy Policy](https://mktmp.io/privacy-policy) and
[mktmpio Terms of Service policy](https://mktmp.io/terms-of-service).
