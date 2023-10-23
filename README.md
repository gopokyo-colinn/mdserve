# Simple Markdown Server

Serve a directory of markdown files as a static webserver.

**Version**: 1.1.1

**NOTE: This is an early prototype. Work is in-progress! Breaking changes to `master` may occur.**

## Installation

```
npm install -g pubmd
```

## Usage

Given a directory, `sample`, which looks like this:

```plaintext
sample
├── index.md
├── subfolder-a
│   ├── hello.md
│   └── index.md
└── subfolder-b
    ├── another.md
    ├── example.md
    ├── index.md
    └── subfolder-ba
        ├── asdf.md
        ├── index.md
        └── qwer.md
```

You can run a webserver which shows this contents with this `pubmd` CLI:

```
pubmd --directory sample/ --port 3000
```

Navigate to the port you specify and you'll see a page which looks like this:

![screenshot](docs/screenshot.png)

## Flags

`*` denotes required flags

```
* --directory (-d) = path to directory of markdown files
  --port      (-p) = port number for the server to run on
```
