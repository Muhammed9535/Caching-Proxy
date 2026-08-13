
Node.js Application with TypeScript and Redis

cache's the response of http://dummyjson.com/products
headers shows X-Cache": "HIT"  when response is from redis and X-Cache": "MISS" otherwise 

Prerequisites

- Node.js (version 18 or higher)
- npm (Node Package Manager)
- Redis server (local, Docker, or managed service like AWS ElastiCache)
- Docker (if you plan to run Redis in a Docker container)

## Getting started

1 clone the repo
``` bash
git clone <repository url>
cd CACHING-PROXY
```
2 install dependencies
``` bash
npm install
```
3 install cache
``` bash
npm i -g
```
4 Run Redis on Docker
```bash
create .env
add REDIS_URL=redis://localhost:6379
start up redis with: docker run --name my-redis -p 6379:6379 -d redis
```
5 start application
```bash
cache-proxy --port 4100 --origin http://dummyjson.com/products
cache-proxy --clear-cache
```

6 website

```bash
go to http://localhost:4100/products
```


Project Url

https://roadmap.sh/projects/caching-server