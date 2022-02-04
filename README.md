# node-mitm-proxy-chain 

## Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
- [Usage](#usage)

## About <a name = "about"></a>

Simple forward proxy for http/s, with a feature of **chaining** such proxies.
Better version of [node-mitm-proxy](https://github.com/SanariSan/node-mitm-proxy)

## Getting Started <a name = "getting_started"></a>

- Change host/port in dotenv file.
- If planning on chaining fill in proxy host/port.
- Otherwise, if not planning on chaining or this is the last proxy node in chain, just remove both params entirely

## Usage <a name = "usage"></a>

`yarn mon`

`yarn start`