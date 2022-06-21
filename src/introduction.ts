import { delimeterMsg, logF, logToHTML } from "./utils";

function diagramsAndEstimations() {
  logToHTML(`
    Diagram block types:

    - Service. Drawn as a box with a name inside. Usually hidden by a load balancer inside the cluster. Don't draw the load balancer, draw a multi-box.
    - Users. Draw with a user icon.
    - Databases. Drawn as a barrel with a name inside.
    - HTTP calls. Drawn as a solid arrow with the call name (with parameters), e.g. -- GET /user/:id -->
    - Queues and async communnication. Drawn with a dotted line, e.g. - - - - - >

    Diagram flow rules:

    - Make it one-directional, left-to-right or top-to-bottom.
    - Avoid intersections
    - Align elements

    Estimatons:
    - Latency
      CPU cache (L1, L2, L3) -> RAM -> Disc -> local network -> global network (Fast to slow).

    - Throughput
      Type                | Reads per second   | Writes per second
      RDBMS                 10000                5000
      Distributed Cache     100000               100000
      Message Queue         100000               100000
      NoSQL                 20000                10000

    - Capacity
      Type                 | Maximum effective capacity
      RDBMS                  3TB
      Destributed Cache   ch   16GB - 128GB
      NoSQL                  Depends
    `);
}

function networks() {
  logToHTML(`
    Networks:

    Load balancer
    - Acts as a reverse proxy, makes system horisontally scalable and handles servers falls (resilent)
    - Strategies: round robin, least connections ect..
    - Types: Layer 4 (has access to TCP/UDP, IP, PORT) and Layer 7 (has access to Layer 4 stuff + headers, cookies, payload).

    CDN
    - Hepls distribute the content across different regions.
    - A cache for static assets
    - Reduces costs, decreases latency. Increases complexity
    - Can be of 2 types: Push (you manually upload the content to CDN) and Pull (content will be cached only after first user requests it).
    - Protects from DDOS attacks
    `);
}

function caching() {
  logToHTML(`
    Caching:

    Caching main characteristics
    + Improve read performance (aka Latency)
    + Reduce the load (aka Throughput)
    - Increases complexity
    - Consumes resourses

    Caching strategies
    - Cache aside
        Client talks to the app. App checks the cache and serves data. In data not in cache, app goes to DB and updates the cache.
        + Cache only what's needed
        - Cache misses are expensive(goes to the DB)
        - Data staleness (expires TTL)
        - implementation complexity (one API for cache and another for the DB)
    - Read Through
        Client talks to the app. App interacts with the cache only, not directly with the DB. Cache itself updates the DB periodically.
        The database reads the data from cache.
        + Cache only what's needed
        + Easy to work with (you work only with the cache).
        - Data staleness
        - Reliability (if the cache goes down, data is lost).
    - Write Through
        Is is like Read Through, but the cache writes to the DB
    - Write Behind
        Write begind is similar to Write Through except the writes are done in bulk, using a buffer
        + Reduces load to the DB
        + Handles DB temporal failures
        - If the cache goes down, the app goes down

    Cache Eviction policies
    - LRU: Least Recently Used (Based on linked list. First in, first out).
    - LFU: Least Frequently Used (Based on a usages hashmap with key:count).

    Redis as a cache system
    - in-memory key-value store, limited by RAM
    + Supports TTL policy
    + Supports persistance to disk (every second)
    - No support for JSON or nested structures
    - Can loose data
    `);
}

function queues() {
  logToHTML(`
    Queues:

    + Queues are async, which enables fast parallel processing
    + Acts as a buffer, and persistence in case of crash
    - Adds complexity, hard error handling (no response)

    Messaging models:
    - Message Queue (Action, serve the result to one consumer, can arrive out of order)
    - Publish/Subscribe (server the result to multiple consumers, always in order)
    - Most popular libraries are RabbitMQ and Kafka
    - RabbitMQ:
        + Message queue to exactly 1 customer (but can work as a pub/sub as well)
        + Reliability through acknowledgements
        + Concurrency through channels
    - Kafka:
        + Best used as a pub/sub
        + Has very high throughput, can process 100k+ events per second
        + Slow customers don't affect queue performance 
    `);
}

export default function introduction() {
  delimeterMsg('INTRODUCTION');
  logF(diagramsAndEstimations);
  logF(networks);
  logF(caching);
  logF(queues);
}