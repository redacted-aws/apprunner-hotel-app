# AppRunner VPC Connector Demo

**Note: This is not Production grade and simply meant as a demo**

## Description

This project provisions the base layer infrastructure to demonstrate how AppRunner leverages a VPC Connector to interact with a DB in a private subnet.

## AWS Services

* VPC (private + public subnets, IGW, NGW)
* Aurora MySQL in private subnet
* VPC Connector for AppRunner and requisite security groups
* Secrets Manager for DB credentials with rotation enabled

## Deployment Instructions

*Note: Use us-east-1 only*

- Create a Cloudformation stack using *infra.yaml*  
- Deploy the application using the AppRunner Console.
  - Source
    - Point to your Github repo
  - Configure Build
    - Runtime: *Nodejs 14*
    - Build command:  *npm install*
    - Start command: *npm start*
    - Port: *8080* (default) 
  - Configure service
    - Environment variable:
      - secret: *Secrets Manager secret name* (Provisioned by infra.yaml)
    - Security: *AppRunnerV2NInstanceRole* (Provisioned by infra.yaml)
    - Networking: 
      - Custom VPC: *AppRunnerV2NPrototype-RDS-Connector* (Provisioned by infra.yaml)
    - Observability: Enable Tracing with AWS X-Ray



## Notes

This demo 
Hotel rooms
Display list of hotel rooms
* setup npm
```
  npm install express
  npm install mysql
```
* start application
```
  npm start
```
* build a image
```
  docker build -t hotel-demo .
```
* run
```
  docker run -p 3000:8080 -d hotel-demo
```
