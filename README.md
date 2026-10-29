Actividad 1: MongoDB Cluster

## Colección de autos

La práctica utiliza la base de datos `agencia` y la colección `cars`. El clúster está compuesto por tres shards y un router `mongos`. Las operaciones se ejecutan a través del router, en el puerto `27021`.

## 1. Iniciar el clúster

Con Docker Desktop abierto, desde la carpeta principal del repositorio ejecuta:

```bash
docker compose -f docker/docker-compose.yml up -d
bash scripts/init-cluster.sh
```

El segundo comando inicializa los conjuntos de réplicas, registra los tres shards en `mongos` y configura el sharding de `agencia.cars`.

## 2. Cargar los datos

Desde la carpeta principal, ejecuta este comando para cargar los ocho vehículos:

```bash
docker exec -i mongos mongosh --port 27021 agencia < scripts/seed-cars.js
```

El script identifica cada auto con su `_id`. Se puede ejecutar más de una vez: actualiza los documentos existentes e inserta los que falten, sin duplicarlos.

Para revisar los registros:

```javascript
db.cars.find({}, { _id: 1, makerId: 1, model_name: 1 }).sort({ _id: 1 })
db.cars.countDocuments()
```

## 3. Ejecutar las operaciones CRUD

El archivo `crud.js` realiza las cuatro operaciones con un registro temporal: lo inserta, lo consulta, modifica algunos campos y al final lo elimina. Así se comprueba el CRUD sin cambiar los ocho autos de la colección.

```bash
docker exec -i mongos mongosh --port 27021 agencia < crud.js
```

## 4. Revisar la distribución entre shards

Abre una sesión de MongoDB a través de `mongos`:

```bash
docker exec -it mongos mongosh --port 27021
```

Después ejecuta:

```javascript
use agencia
db.cars.getShardDistribution()
sh.status()
```

`getShardDistribution()` muestra el número de documentos y el espacio utilizado en cada shard. `sh.status()` permite revisar la configuración del clúster y la colección fragmentada.

## Justificación de la Shard Key

La colección `agencia.cars` está configurada con `{ _id: "hashed" }`. Se eligió esta clave porque cada auto tiene un `_id` distinto y el hash reparte los valores a lo largo del espacio de claves, en lugar de concentrar las inserciones consecutivas en un solo rango. Esto permite que MongoDB distribuya documentos entre los shards según los rangos asignados y que las operaciones enviadas mediante `mongos` se dirijan al shard correspondiente.

La colección de esta práctica contiene ocho autos, por lo que sirve para comprobar el funcionamiento del sharding, pero no para medir el balanceo bajo una carga real. La distribución efectiva debe revisarse con `db.cars.getShardDistribution()` después de cargar los datos y dejar que el clúster termine de estabilizarse.

## Evidencias

1. La carga y consulta de los ocho autos.<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/5018902f-a3ff-4385-9f8d-8ed8d7a699e5" />

2. La salida de `crud.js`, mostrando insertar, consultar, actualizar y eliminar.
3. La salida de `db.cars.getShardDistribution()` para comprobar la distribución entre los tres shards.
