import { delimeterMsg, logF, logToHTML } from "./utils";

function diagramBuildingBlocks() {
  logToHTML(`
    Diagram block types:

    - Service. Drawn as a box with a name inside. Usually hidden by a load balancer inside the cluster. Don't draw the load balancer, draw a multi-box.
    - Users. Draw with a user icon.
    - Databases. Drawn as a barrel with a name inside.
    - HTTP calls. Drawn as a solid arrow with the call name (with parameters), e.g. -- GET /user/:id -->
    - Queues and async communnication. Drawn with a dotted line, e.g. - - - - - >
    `);
}

function diagramFlow() {
  logToHTML(`
    Diagram flow rules:

    - Make it one-directional, left-to-right or top-to-bottom.
    - Avoid intersections
    - Align elements
    `);
}

export default function introduction() {
  delimeterMsg('INTRODUCTION');
  logF(diagramBuildingBlocks);
  logF(diagramFlow);
}