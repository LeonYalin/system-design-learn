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
    - Strategies: round robin, lease connections ect..
    - Types: Layer 4 (has access to TCP/UDP, IP, PORT) and Layer 7 (has access to Layer 4 stuff + headers, cookies, payload).

    CDN
    - Hepls distribute the content across different regions.
    - A cache for static assets
    - Reduces costs, decreases latency. Increases complexity
    - Can be of 2 types: Push (you manually upload the content to CDN) and Pull (content will be cached only after first user requests it).
    - Protects from DDOS attacks
    `);
}

export default function introduction() {
  delimeterMsg('INTRODUCTION');
  logF(diagramsAndEstimations);
  logF(networks);
}