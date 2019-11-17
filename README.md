# Introduction 
Node js and Typescript based real time Alert delivery system, built on Kafka, Kafka-Streams, Redis and Cassandra. 

## Key Components

### Node js Express
Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications. We use it to expose REST API for sending Alerts into our system.

### Typescript
TypeScript is a strict syntactical superset of JavaScript, and adds optional static typing to the language. TypeScript is designed for development of large applications and transcompiles to JavaScript. TypeScript compiles to clean, simple JavaScript code which runs on any browser, in Node.js, or in any JavaScript engine that supports ECMAScript 3 (or newer).

### Apache Kafka
Apache Kafka is a community distributed event streaming platform capable of handling trillions of events a day. 

Pushblish + Subscribe, Store and Streams are the key features that Kafka provides. We publish alerts/events onto Kafka topics via Producer and process them using Streams (Consumer). Processing involves operations like picking relevant data, enriching data via lookups and storing enriched data back in kafka topics or calling other APIs that do further processing or store in a DB or trigger notifications based on some logic.

### Redis
Redis is an in-memory data structure project implementing a distributed, in-memory key-value database with optional durability. 

We use Redis in this solution to store and retrieve master data, that will be used to enrich our alert stream.  A WIP node service that pulls data from an SQL store and pushes onto Redis datastore. But this solution inserts sample lookup data into Redis datastore; finds users to be notified for each alert and enriches the alert with this lookup user data that can later be used by push notification services.

### Apache Cassandra (To be added)
Apache Cassandra is a free and open-source, distributed, wide column store, NoSQL database management system designed to handle large amounts of data across many commodity servers, providing high availability with no single point of failure.

In this solution, fully processed and enriched data is finally stored in Cassandra for further reporting and analysis purposes (Reporting and Analysis are currently not in scope of this solution).


# Installation process

### Prerequisites
This solution assumes you have the following are installed andset up in your deployment environment.
1. ### Node js and npm (LTS)
    https://nodejs.org/en/download/
2. ### Typescript 
        npm install -g typescript
3. ### Python = 2.7.x
    https://www.python.org/download/releases/2.7/ </br>
    Do not point to Python3 if you have already installed.
4. ### node-gyp
        npm install -g node-gyp
5. ### Apache Kafka >= 2.0
    https://kafka.apache.org/ 
    </br> I am not going to cover setting up Zookeeper or Kafka. Follow documentation on the how to part. 

    #### Start Zookeeper and Kafka-server
        C:\kafka_2.11-2.2.1\bin\windows\zookeeper-server-start.bat config\zookeeper.properties
        C:\kafka_2.11-2.2.1\bin\windows\kafka-server-start.bat config\server.properties

    #### Topics
    Create two topics: 'alert' and 'bad-alert'
    Valid alerts go to the 'alert' topic while invalid alerts that fail request validation (refer class-validator implementation) go to the 'bad-alert' topic. More info in the Request section.

        C:\kafka_2.11-2.2.1\bin\windows\kafka-topics.bat --zookeeper localhost:2181 --topic alert --create --partitions 3 --replication-factor 1

        C:\kafka_2.11-2.2.1\bin\windows\kafka-topics.bat --zookeeper localhost:2181 --topic bad-alert --create --partitions 3 --replication-factor 1

    #### Consumers

    Start listening to the newly created topics. New messages will be posted and be visible as when you produce them.

        C:\kafka_2.11-2.2.1\bin\windows\kafka-console-consumer.bat --bootstrap-server localhost:9092 --topic alert --from-beginning

        C:\kafka_2.11-2.2.1\bin\windows\kafka-console-consumer.bat --bootstrap-server localhost:9092 --topic alert --from-beginning

        C:\kafka_2.11-2.2.1\bin\windows\kafka-console-consumer.bat --bootstrap-server localhost:9092 --topic alert-streams-output --from-beginning

    The 'alert-streams-output' topic is the one created automatically by the kafka-streams application that processes alerts. It has the processed output.

6. ### Redis
    https://redis.io/download </br> 
    (OR) Follow this blogpost for setting up a dockerised version </br> https://markheath.net/post/exploring-redis-with-docker  

    Dump sample master data on to Redis cache:

    Go to the resources dir and give the following command.
     
        cat userdata.txt | redis-cli --pipe
    
    If your Redis instance runs on Docker, copy userdata.txt to the /data dir before running the --pipe command on the /data dir.
    
        docker cp <PATH TO RESOURCES>\userdata.txt <CONTAINER>:/data/
    

7. ### Apache Cassandra
    http://cassandra.apache.org/download/
    
### Deployment

Go to the root directory of the project (where the package.jsonfile is). Run below command to install all dependencies.

        npm install    

#### Windows
If you're on Windows, you'll need to perform the below additional steps to set up kafka-streams package.

Download and install Windows Build Tools. </br>
Follow this thread for a clean installation of the dependency package node-rdkafka
https://github.com/Blizzard/node-rdkafka/issues487#issuecomment-422239081
    
What worked for me on Windows is setting up correct path variables:

        npm install --global --production windows-build-tools
        set GYP_MSVS_VERSION=2013
        npm install --msvs_version=2013
        npm config get msvs_version 
        npm config set msvs_version 2013 -g

Ensure that you set these in env variables (set to appropriate version and path applicable to your version of build tool)
    
        MSBUILD_PATH=C:\Program Files (x86)\Microsoft Visual Studio\2017\BuildTools\MSBuild\15.0\Bin

        VCTargetsPath=C:\Program Files (x86)\Microsoft Visual Studio\2017\BuildTools\Common7\IDE\VC\VCTargets

Note that I've used specific versions of node-rdkafka and kafka-streams npm packages that are proven to work together seemlessly. You should try without -g option to avoid global installation of these versions; if 'npm install' still fails, try with -g option.

        npm install --save -g node-rdkafka@2.5.1 
        npm install --save -g kafka-streams@4.8.0


## Build
In the root directory of the project, run the command </br>

    npm run build

This will create /dist directory with the compiled .js files

## Start
In the root directory of the project, run the command </br>

    npm start

The output should look like this:

    Producer Server is running http://localhost:5000...
    Alert stream started, as kafka consumer is ready.
    Bad-alert stream started, as kafka consumer is ready.


# API Details
It's prefereble to use a tool like <b>Postman</b> to send alerts via the REST API.

## 1. Send Alert API

REST API to send alerts. It produces the alerts to the kafka topics. One or more streams applications pick these alerts up and do further processing.

### Request 
#### URL
    localhost:5000/sendAlert

#### Content-type: application/json

#### Sample payload
    [
        {
            "builderId": "0759BEC7-BE74-4CF7-868C-B8391198E1E1",
            "path": 
                { 
                    "buildingId": "0759BEC7-9cbf-4a36-819f-c306e7ee3700", 
                    "deviceId": "E445ED0F-94CE-4279-8103-77B1E2C65034"
                },
            "eventTimestamp": "2019-11-12T15:00:00+05:30",
            "severity": "High",
            "value": "165",
            "name": "High pressure"
        },
        {
            "builderId": "0759BEC7-BE74-4CF7-868C-B8391198E1E1",
            "path": 
                { 
                    "buildingId": "0759BEC7-9cbf-4a36-819f-c306e7ee3700", 
                    "deviceId": "E445ED0F-94CE-4279-8103-77B1E2C65030"
                },
            "eventTimestamp": "2019-11-12T15:00:00+05:30",
            "severity": "Low",
            "value": "130",
            "name": "High pressure"
        }
    ]
	
### Sample Response
    {
        "alertResponseModel": {
            "status": 200,
            "error": null,
            "name": null,
            "data": {
                "Total Alert Count": 2,
                "Valid Alert Count": 2,
                "Bad Alert Count": 0,
                "Bad Alerts": []
            }
        }
    }

# Contribute
Peers are welcome! Drop me a message if you are interested in contributing. I am in the process of expanding this solution and am aiming at making it generic.
