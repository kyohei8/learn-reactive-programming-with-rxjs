# [WIP] FrontEnd Development Environment for ME!

🚧👷 (eternal)WIP 👷🚧

brand new my frontend dev env.

## Introduction

### JavaScript
* writing ES2015.
* To compiled using babel and webpack.
* linting with eslint.

### CSS
* writing postcss
* To compiled using gulp-postcss
* `app/assets/images/sprites/` images in are summarized in one of the sprite image.

### HTML
* writing jade

## Requirements
Install some middlewares.

* Nodejs w/npm (>= 4.0)
* gulp `npm install -g gulp`

## Install

Install dependencies.

```sh
$ npm install
```

## Usage

### local
```sh
$ npm start
```
To launch local server, `app` and ` .tmp` as the root directory.

### product(dist)
```sh
$ npm run build
```
To launch local server, `dist` as the root directory.

### unit test
```sh
$ npm run test
```
To launch local server, `test` as the root directory.
