# SWARM-WORKSHOP

This repository is a small workshop to test and learn how to create and build a based production Docker Swarm architecture
Swarm commands:


## Swarm-commands


```sh
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


```

