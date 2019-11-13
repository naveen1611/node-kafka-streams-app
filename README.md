# Introduction 
Node js and Typescript based real time Alert delivery system, built on Kafka, Kafka-Streams, Redis and Cassandra. 

## Key Components

#### Node js Express
Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications. We use it to expose REST API for sending Alerts into our system.

#### Typescript
TypeScript is a strict syntactical superset of JavaScript, and adds optional static typing to the language. TypeScript is designed for development of large applications and transcompiles to JavaScript. TypeScript compiles to clean, simple JavaScript code which runs on any browser, in Node.js, or in any JavaScript engine that supports ECMAScript 3 (or newer).

#### Apache Kafka
Apache Kafka is a community distributed event streaming platform capable of handling trillions of events a day. 

Pushblish + Subscribe, Store and Streams are the key features that Kafka provides. We publish alerts/events onto Kafka topics via Producer and process them using Streams (Consumer). Processing involves operations like picking relevant data, enriching data via lookups and storing enriched data back in kafka topics or calling other APIs that do further processing or store in a DB or trigger notifications based on some logic.

#### Redis (To be added)
Redis is an in-memory data structure project implementing a distributed, in-memory key-value database with optional durability. 

We use Redis in this solution to store and retrieve master data, that will be used to enrich our alert stream.  A WIP node service that pulls data from an SQL store and pushes onto Redis datastore. But this solution inserts sample data into Redis datastore.

#### Cassandra (To be added)
Apache Cassandra is a free and open-source, distributed, wide column store, NoSQL database management system designed to handle large amounts of data across many commodity servers, providing high availability with no single point of failure.

In this solution, fully processed and enriched data is finally stored in Cassandra for further reporting and analysis purposes (Reporting and Analysis are currently not in scope of this solution).


# Getting Started

1.	## Installation process
    ### Prerequisites
    This solution assumes you have the following are installed and set up in your deployment environment.
    1. #### Node js and npm (LTS)
        https://nodejs.org/en/download/
    2. #### Typescript 
            npm install -g typescript
    3. #### Python = 2.7.x
        https://www.python.org/download/releases/2.7/ </br>
        Do not point to Python3 if you have already installed.
    4. #### node-gyp
            npm install -g node-gyp
    5. #### Apache Kafka >= 2.0
        https://kafka.apache.org/ 
    6. #### Redis
        https://redis.io/download </br> 
        (OR) Follow this blogpost for setting up a dockerised version </br> https://markheath.net/post/exploring-redis-with-docker        
    7. #### Cassandra
        http://cassandra.apache.org/download/

    
    ### Deployment

    Go to the root directory of the project (where the package.json file is). Run below command to install all dependencies.

        npm install    

    #### Windows
    If you're on Windows, you'll need to perform the below additional steps to set up kafka-streams package.

    Download and install Windows Build Tools </br>
    Follow this thread for a clean installation of the dependancy package node-rdkafka
    https://github.com/Blizzard/node-rdkafka/issues/487#issuecomment-422239081

    What worked for me on Windows is setting up correct path variables:

        npm install --global --production windows-build-tools
        set GYP_MSVS_VERSION=2013
        npm install --msvs_version=2013
        npm config get msvs_version 
        npm config set msvs_version 2013 -g

    Ensure that you set these in env variables (set to appropriate version and path applicable to your version of build tool)

    MSBUILD_PATH=C:\Program Files (x86)\Microsoft Visual Studio\2017\BuildTools\MSBuild\15.0\Bin

    VCTargetsPath=C:\Program Files (x86)\Microsoft Visual Studio\2017\BuildTools\Common7\IDE\VC\VCTargets
       

# Build
In the root directory of the project, run the command </br>

    npm run build

This will create /dist directory with the compiled .js files

# Start
In the root directory of the project, run the command </br>

    npm start

The output should look like this:

    Producer Server is running http://localhost:5000...
    Alert stream started, as kafka consumer is ready.
    Bad-alert stream started, as kafka consumer is ready.

# Contribute
Peers are welcome! Drop me a message if you are interested in contributing. I am in the process of expanding this solution and aiming at making it generic.
