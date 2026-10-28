const cars = db.getCollection("cars");

const testCar = {
  _id: 9000001,
  makerId: 99,
  model_name: "Prueba CRUD",
  description: "Registro temporal para probar las operaciones CRUD",
  year: 2026,
  cylinders: 4,
  hp: 150,
  weight_lb: 3100,
  accel_0_60_s: 8.0,
  mpg: 30
};

cars.deleteOne({ _id: testCar._id });

print("========== CREATE: insertar auto ==========");
printjson(cars.insertOne(testCar));

print("========== READ: consultar auto ==========");
printjson(cars.findOne({ _id: testCar._id }));

print("========== UPDATE: modificar auto ==========");
printjson(cars.updateOne(
  { _id: testCar._id },
  { $set: { description: "Registro actualizado", hp: 160 } }
));
printjson(cars.findOne({ _id: testCar._id }));

print("========== DELETE: eliminar auto ==========");
printjson(cars.deleteOne({ _id: testCar._id }));
print("Auto temporal restante: " + cars.countDocuments({ _id: testCar._id }));
print("Total de autos al terminar: " + cars.countDocuments({}));

print("========== DISTRIBUCIÓN POR SHARD ==========");
cars.getShardDistribution();
