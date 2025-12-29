# SWARM-WORKSHOP

This repository is a small workshop to test and learn how to create and build a based production Docker Swarm architecture
Swarm commands:


## Docker Local Registry

```sh
## for testing create a docker registry for our swarm cluster
docker run -d   --name registry   --restart always   -p 5000:5000   -v /opt/registry/data:/var/lib/registry   registry:2
```

## Swarm-commands

```sh

# init the master 
docker swarm init --advertise-addr 192.168.56.101

# deploy stack or update
docker stack deploy -c stack.yml demo

# to debug about specific service
docker service ps <SERVICE_NAME> --no-trunc

# stop the stack
docker stack rm demo


# to scale
docker service scale <service_name>=5


# create a service
docker service create --name web --replicas 3 -p 80:80 nginx
docker service scale web=6   # Scale out
docker service scale web=1   # Scale in

# add label to NODE
docker node update --label-add role=worker <worker-1>

```
## Monitoring

Example of prometheus query 

```sh
# rate cpu usage in the container demo valkey (Redis DB)
rate(container_cpu_usage_seconds_total{container_label_com_docker_swarm_service_name="demo_valkey"}[1m]) * 100

```