# cfdns

A command line tool for managing Cloudflare DNS records

## Install

```shell
$ npm i -g cfdns-cli
```

## Usage

```
Usage: cfdns [options] [command]

Options:
  -V, --version                output the version number
  -h, --help                   output usage information

Commands:
  login <email> <key>          login Cloudflare with email and key
  logout                       logout Cloudflare
  list [domain]                list all DNS records
  add <name> <type> <content>  add a DNS record
  modify <name> [new_content]  modify a DNS record
  remove <name> [content]      remove a DNS record
  help [cmd]                   display help for [cmd]
```

### Login

**Syntax:**

```shell
$ cfdns login <email> <key>
```

**Examples:**

```shell
$ cfdns login admin@example.com 8c9ec98e451df3a798029dd98abee27d
```

### Logout

**Syntax:**

```shell
$ cfdns logout
```

### List


**Syntax:**

```shell
$ cfdns list [domain]
```

**Examples:**

```shell
$ cfdns list
$ cfdns list example.com
```

### Add

**Syntax:**

```shell
$ cfdns add <name> <type> <content>
```

**Arguments:**

 * `--ttl` Special TTL value (default: 1)
 * `--proxy` Enable Cloudflare's proxy

**Examples:**

```shell
$ cfdns add www.example.com A 8.8.8.8
$ cfdns add www.example.com A 8.8.8.8 --ttl 120
$ cfdns add www.example.com A 8.8.8.8 --ttl 120 --proxy
```

### Modify

**Syntax:**

```shell
$ cfdns modify <name> <type> <new-content>
```

**Arguments:**

 * `--ttl` Special TTL value (default: 1)
 * `--proxy` Enable Cloudflare's proxy
 * `--old-content` Old DNS record content

**Examples:**

```shell
$ cfdns modify www.example.com A 8.8.4.4
$ cfdns modify www.example.com A 8.8.4.4 --ttl 360
$ cfdns modify www.example.com A 8.8.4.4 --proxy
$ cfdns modify www.example.com A 8.8.4.4 --old-content 8.8.8.8
```

### Remove

**Syntax:**

```shell
$ cfdns remove <name> [type] [content]
```

**Arguments:**

 * `-f, --force` Force to delete multiple records

**Examples:**

```shell
$ cfdns remove www.example.com
$ cfdns remove www.example.com A
$ cfdns remove www.example.com A 8.8.4.4
$ cfdns remove www.example.com A 8.8.4.4 --force
```
