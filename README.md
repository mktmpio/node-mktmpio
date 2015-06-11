# mktmpio

Node client and CLI for https://mktmp.io/ service.

## Usage

```
$ npm install -g mktmpio
$ echo 'token: $MY_TOKEN' > ~/.mktmpio.yml
$ mktmpio $TYPE
```

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
Warning: Using a password on the command line interface can be insecure.
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 2
Server version: 5.6.25 MySQL Community Server (GPL)

Copyright (c) 2000, 2015, Oracle and/or its affiliates. All rights reserved.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

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
