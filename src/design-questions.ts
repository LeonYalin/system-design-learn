import { delimeterMsg, logF, logToHTML } from "./utils";

function designATaxiApp() {
  logToHTML(`
    Design a taxi app (aka Uber):

    Main Topics:
    - Marketplace
    - Geolocation
    - Geosharding
    
    - Ask how will the system will expect to behave
    - If you make an assumption, ask an interviewer if this is the right assumption
    - Write down the assumptions, numbers, design decisions

    Marketplace
    - 2 kinds of users: users (taxi riders), taxi drivers
    - I assume that taxi driver have mobile devices, can they receive an order
    - Numbers: how many drivers/riders in total, e.g. 100m active riders, 10 riders per months, 1m drivers in total, 500k active drivers

    Drivers:
    - Every 5 seconds will send the location update
    - Communication: external communication -> not message queues and gRPC, use REST/WebSockets/UDP, WebSockets here is the best.
    - Data interface: {latitude: float, longitude: float, direction?: float, driver_id: uuid}
    - Throughput:
        500k active drivers
        Average shift: 6 hours
        4 shifhs a day
        125k drivers at any moment on average
        Message every 5 seconds
        25k requests per second on average
    - Load and spikes:
        How many drivers during peak?
        X2 (50k) drivers, X4 (100k) drivers
        Scaling read operations: replicas
        Scaling write operations: sharding. 5k writes to one shard -> 10 shards (GeoSharding - Uk, Fr, IL ect..)
    - In Us may be much more drivers than in other countries, the GeoSharding can be inefficient. Using locator service is complicated.
    - Using geospatial libs like Google s2, to divide the world into hexagons and map them to shards

    Riders:
    - Display 10 drivers at most
    - Communication: fetching drivers locations every 5 seconds, placing an order -> REST based
    - Throughput:
      10m active riders
      5 opens of app a dy per user = 50m opens a day
      Refresh every 5 seconds
      Average session time is 1 minute = 12 refreshes
      50m * 12 = 600m requests per day
      600m / 24 = 25m requests per hour
      25m / 60 = 400k requests per minute
      400k / 60 = ~7k requests per second
    - Getting drivers positions: DriverLocationService -> ShardLocatorService.
    - Need to perform Geospatial Search -> Postgre SQL, e.g. "find 10 closest points to (x,y) -> 100k drivers. React for frontend
    - In case the DB does not have geospacial capabilities, use SQRS approach. Create a job, that will periodically query all DB instances to build a in-memory geospacial index.
    - Match an order to driver.
        Create a MatchingService -> DriverLocationService -> get a suitable driver list.
        Query drivers to approve the order. Strategies:
          - Sequential: Query drivers one by one and wait a couple of seconds to receive an approval. If not, go to next driver. Unoptimal
          - Concurrent: send an offer to all drivers, the first to approve wins. Good for riders, not good for drivers.
          - RiderGateway, DriverGateway to handle the logic and find an optimal solution for bith sides.
          - Polling on a user side after an oerder has been made.

    Summary:
    - Create a marketplace system that can scale up to 10m riders and 500k drivers.
    - Each driver has a persistent connection to the Gateway using WebSockets.
    - We receive locations from all drivers and store them in a sharded database
    - Query the DB in a while to create a Geospatial Index, that speeds up the matching process to find a drover for a ride
    - 
    `);
}

export default function designQuestions() {
  delimeterMsg('DESIGN QUESTIONS');
  logF(designATaxiApp);
}