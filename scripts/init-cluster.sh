#!/bin/bash
# init-cluster.sh

echo "Inicializando Config Server..."
docker exec -it configsvr mongosh --port 27017 --eval 'rs.initiate({_id: "configReplSet", configsvr: true, members: [{ _id: 0, host: "configsvr:27017" }]})'

echo "Esperando 5 segundos para estabilizar Config Server..."
sleep 5

#inicializa evaluando el comando rs.initiate() para iniciar el conjunto de réplicas del shard 1
echo "Inicializando Shard 1..."
docker exec -it shard1 mongosh --port 27018 --eval 'rs.initiate({_id: "shard1ReplSet", members: [{ _id: 0, host: "shard1:27018" }]})' 

echo "Inicializando Shard 2..."
docker exec -it shard2 mongosh --port 27019 --eval 'rs.initiate({_id: "shard2ReplSet", members: [{ _id: 0, host: "shard2:27019" }]})'

echo "Inicializando Shard 3..."
docker exec -it shard3 mongosh --port 27020 --eval 'rs.initiate({_id: "shard3ReplSet", members: [{ _id: 0, host: "shard3:27020" }]})'

echo "Esperando 10 segundos para que los Shards levanten correctamente..."
sleep 10

echo "Agregando Shards al Router (mongos) y configurando BD de autos..."
#Evaluado el comando sh.addShard() para agregar los shards al router mongos y sh.enableSharding() para habilitar el sharding en la base de datos "agencia" 
#y sh.shardCollection() para shardear la colección "cars" de la base de datos "agencia" usando un índice hashed en el campo "_id"
docker exec -it mongos mongosh --port 27021 --eval '
  sh.addShard("shard1ReplSet/shard1:27018");
  sh.addShard("shard2ReplSet/shard2:27019");
  sh.addShard("shard3ReplSet/shard3:27020");
  sh.enableSharding("agencia");
  sh.shardCollection("agencia.cars", { "_id": "hashed" });
' 
#shardkey es un índice hashed en el campo "_id" de la colección "cars"

echo "Cluster distribuido inicializado con éxito!"