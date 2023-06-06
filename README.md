# Backend Microservice with Nginx Load Balancer and Caching Solution (Dockerized)
*This repository contains the code and configuration files for a backend microservice that utilizes Nginx as a load balancer and caching solution to deliver Question & Answer data to the front end of a eCommerce product detail page.*

*The microservice is designed to handle incoming requests, distribute them across multiple backend servers, and leverage caching to improve performance and reduce load on the backend. The microservice is deployed in two Docker containers to AWS EC2 t2.micro instances.*

## Features
- **Load balancing**: Nginx acts as a reverse proxy and distributes incoming requests across multiple backend servers.
- **Caching**: Nginx caching mechanism is employed to store and serve frequently requested resources, reducing the load on backend servers and improving response time.
- **High Availability**: The microservice is deployed on two AWS EC2 t2.micro instances, ensuring redundancy and fault tolerance.
- **Scalability**: The microservice can be easily scaled by adding or removing backend servers or by utilizing larger EC2 instance types.
- **Security**: Nginx can be configured with SSL/TLS certificates to enable secure communication between clients and the backend servers.
- **Logging**: Detailed logging is enabled to capture information about incoming requests, load balancing decisions, and caching activities for monitoring and debugging purposes.

## Prerequisites
- **Docker**: Install Docker on your local machine. Refer to the official Docker documentation for installation instructions (https://docs.docker.com/get-docker/).

- **AWS Account**: Set up an AWS account and create two t2.micro EC2 instances. Ensure that you have the necessary access permissions and security groups configured.

## Installation and Setup
Clone the repository to your local machine:

```
git clone https://github.com/rpp2209-copernicium/qa-service
```

### Build Docker images:
Navigate to the repository's root directory and build the Docker images for the backend servers and Nginx load balancer using the provided Dockerfiles.

```
cd qa-service
```

<!-- docker build -t backend-server:latest backend-server/ -->
```
docker build -t qa-service .
```

```
docker build -t nginx-load-balancer nginx/
```

### Push Docker images (optional):
If you want to deploy the Docker images from a container registry, push the built Docker images to your preferred registry (e.g., Docker Hub, Amazon ECR) using appropriate commands.

### Configure Nginx:

Update the Nginx configuration file **nginx.conf** with the appropriate settings for your backend servers, ports, and caching rules. You can find examples and detailed documentation in the Nginx documentation (https://nginx.org/en/docs/).

Place the updated **nginx.conf** file in the nginx directory.

### Deploy microservice to EC2 instances:

- SSH into each EC2 instance and perform the following steps:
  - Install Docker on the EC2 instances by following the official Docker documentation.

### Pull the Docker images:

```
docker pull <image-repository>/<image-name>:latest
```

Run the backend server containers on each EC2 instance:

```
docker run -d --name backend-server-1 backend-server:latest
```

```
docker run -d --name backend-server-2 backend-server:latest
```

### Run the Nginx load balancer container:

```
docker run -d -p 80:80 --name nginx-load-balancer --link backend-server-1 --link backend-server-2 nginx-load-balancer
```

### Verify the microservice:

Access the public IP address or DNS name of the EC2 instances in a web browser or send test requests using a tool like cURL. Ensure that the requests are properly load balanced across the backend servers and that caching is functioning as expected.

## Configuration
The configuration of the microservice can be customized to suit your specific requirements. Below are the key configuration files and their purposes:

- **nginx.conf**: The Nginx configuration file that defines the behavior of the load balancer, caching rules, SSL/TLS settings, and other relevant options.
backend_servers.conf: A file that lists the backend servers' IP addresses or hostnames and their corresponding ports. Update this file to reflect the IP addresses or hostnames of your EC2 instances.
- **caching_rules.conf**: A configuration file that specifies the caching rules for different types of resources. Modify this file to adjust caching behavior according to your application needs.

## Usage
Once the microservice is deployed and running on the EC2 instances, it automatically handles incoming requests, distributes them across the backend servers, and utilizes caching for improved performance.

To monitor and troubleshoot the microservice, you can:

- Examine the Nginx logs within the Nginx container using the command docker logs  nginx-load-balancer.
- Analyze the logs within each backend server container using the appropriate Docker command.

## License
This project is licensed under the MIT License.

## Acknowledgements
The creators and maintainers of **Nginx** for providing a powerful and versatile web server and reverse proxy solution.

**Amazon Web Services (AWS)** for providing the EC2 instances and infrastructure for deployment.

Feel free to update this README file with additional information about your specific microservice implementation, any limitations or considerations, and any further documentation that might be useful for users or developers.
