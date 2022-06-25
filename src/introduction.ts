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
      Destributed Cache      16GB - 128GB
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
    - Can be of 2 types:
        Push - you manually upload the content to CDN
        Pull - content will be cached only after first user requests it
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

function protocols() {
  logToHTML(`
    Protocols:

    TCP(Transmission Control Protocol)
    - The protocol of the internet
    - WebSocket, HTTP(REST, gRPC, GraplQL) based on TCP
    + Connection-oriented, Reliable (3-way handshake: syn->syn/ack->ack, detect loss, retransmit), Ordered (ack after received), Error-checked (checksums)
    - Slower than some other protocols

    UDP (User Datagram Protocol)
    - Does not wait for ACK or ensures ordering, possible packet loss
    + Good for streaming data (video, gaming ect..)
    + Built for speed

    HTTP (Hypertext Transfer Protocol)
    - Based on TCP
    - Request/Responce Protocol
    - Includes Status, Headers & Body
    - Has GET, HEAD (same as Get, but only status & headers), POST, PUT, PATCH (partial update), DELETE, OPTIONS, CONNECT (establish a tunnel), TRACE (message loop-back test). 
    - GET method has a limitation of the url lenght. In this case, we can use POST instead
    - Status Codes:
        100 - 199 Informational
        200 - 299 Successful
        300 - 399 Redirection
        400 - 499 Client Error
        500 - 599 Server Error
    - Use only common codes: 200 OK, 201 Created, 400 Bad Request, 404 Not Found, 401 Not Authorized, 403 Forbidden, 500 Server Error
    
    REST (Representational State Transfer)
    - A protocol, built on HTTP
    - Uses headers, statuses & JSON as body format
    - Client-Server, Cachable, Stateless, Layered
    - RESTfullness: 
        REST API that follows REST architecture
        usage: GET - read, POST - create, PUT - update, DELETE - delete
        resources: GET users/123123
        actions: PUT users/123123/enable
        pagination: GET users?page=1&pageSize=50&sortby=created
    - API Best Practices:
        Don't overcomplicate (simple is better)
        Do less requests (nest data)
        Be consistent in your API
        Don't mutate data with GET
        Use nouns and not verbs, use plural (GET /employees and not GET /getAllEmployees)
        Use Versioning, e.g. /v1, /v2
        Errors: use object and error code, e.g. return 400 {"errorMsg": "error description", code: 10030}
        Authentication: use SSL, OAUTH or API key
        Use DTO, not the full model (to avoid updating wrong fields)
        Use validation.
        Controller -> Request -> Vlidator -> Handling/Service
        Documentation: Endpoints, Parameters, Schema, Formatting, Gotchas/Errors

    WebSocket
    - Protocol built on top of TCP. that maintains persistent connection between client and server
    + Client and Server can exchange massages in both directions
    - More complex to maintain, load balancers issues (websocket is a long-live connection)

    Long Polling
    - Is a technique that tries to solve polling with REST issues
    - Instead of polling every X seconds, it polls once, then server waits until it has a new message/data.
    - After that, server releases a REST call and returns a responce.
    - Client receives the responce and immediately requests a new data

    SOAP (Simple Object Access Protocol)
    - A messaging protocol (similar to REST) between client and server, on top of HTTP
    - Uses xml data, can be stateless or stateful (store data between calls)
    - Best used in bank transacions. chains of messaging
    - Document is built of root <envelope> element with <header> and <body> elements, and a <fault> element for errors
    - Uses WSDL files (Web Service Description Language) to describe the available web service APIs

    gRPC (Google Remote Procedure Call)
    - PRC protol allows to invoke another service as if is a local function
    - Uses protobuff and HTTP2
    - Cannot be used in Browser

    Protobuff (Protocol Buffers)
    - A binary protocol, which is not human readable. More efficient than JSON
    - Stores instructions in *.proto files. Not supported bu browsers
    - Messages are smaller / faster than JSON/XML
    - Great for communication between services

    GraphQL (Graph Query Language)
    - A protocol on top of HTTP, developed by Facebook in 2015, based on JSON
    - Solves the problem of overfetching (too much data fetched) and underfetching (too little data, only ids for example)
    - Lets you define which fields and entities to return
    - uses 'Query' for GET, and 'Mutation' for POST, PUT, DELETE
    - GraphQL uses POST requests, which are not cacheable, support outside the JS ecosystem is not great
    `);
}

function concurrency() {
  logToHTML(`
    Concurrency:

    Concurrency vs Parallelism
    - Parallelism is doing more that one thing at a same time
    - Concurrency is providing an illution of doing more that one thing at a same time
    - If one person doing multiple things while switching betweem them it is concurrency, it two, it is parallelism

    Processes
    - Programs can have one process at whole system (Java) or one process per CPU (NodeJS).
    - Interprocess comminication:
         File: share data in a file (or in-memory mapped file)
         Signal: for example "CTRL+C" or "kill -9 818" to Terminal -> node(SIGKILL). Signal is a number, limited
         Pipe: for example "ls | grep hello" IO exchange between processes, two-way communication
         Socket: two-way connection similar to the external sockets calls (e.g. WebSockets) but on the same machine
    - Can share memory
    - Can pass messages

    Threads
    - Threads are places where we put tasks to execute.
    - They can have different purposes: Code execution thread, UI thread, Garbage Collection Thread ect..
    - Using the code, we can create custom threads that will do parralel tasks
    - Process has heap and Thread has stack
    - Creating a thread is costly, consumes memory, heap (shared memory), locks, CPU time, number of threads is limited.
    - In cases we have many concurrent connections it is better to use Concurrency and not Threads
    _ Thread pools: assigns tasks to threads, orders, limits and manages threads execution. Has task queue.
    `);
}

export default function introduction() {
  delimeterMsg('INTRODUCTION');
  logF(diagramsAndEstimations);
  logF(networks);
  logF(caching);
  logF(queues);
  logF(protocols);
  logF(concurrency);
}