# mongoDB

Hu`mongo`us database

In a db, you have collections, which store schemaless (some data might be incomplete, documents can have different structure) documents in BSON format

You are responsible for the schemaless mess

It's very efficient for apps that have a huge IO workload

Highly efficient, because you can store multiple data in a logical way, not needing to join them like in a SQL db

## Installation

[Check docs](https://www.mongodb.com/docs/manual/installation/)

The data directory `/var/lib/mongodb` and the log directory `/var/log/mongodb` are created during the installation

Reset it by starting db with:

```bash
mongod --dbpath <path> --logpath <path>/file-name.log
```

### ulimit Considerations

Most Unix-like operating systems limit the system resources that a process may use

These limits may negatively impact MongoDB operation, and should be adjusted

[See UNIX ulimit Settings for Self-Managed Deployments for the recommended settings for your platform](https://www.mongodb.com/docs/manual/reference/ulimit/)

#### Recommended settings

```bash
isaac soft fsize unlimited
isaac hard fsize unlimited

isaac soft cpu unlimited
isaac hard cpu unlimited

isaac soft as unlimited
isaac hard as unlimited

isaac soft memlock unlimited
isaac hard memlock unlimited

isaac soft nofile 64000
isaac hard nofile 64000

isaac soft rss unlimited
isaac hard rss unlimited

isaac soft nproc 64000
isaac hard nproc 64000
```

## Working with mongoDB

Structure

![Collections framework](working-with-mongodb.png)

A closer look

![A closer look](a-closer-look.png)
