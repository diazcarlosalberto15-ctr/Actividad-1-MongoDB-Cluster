const carsToLoad = [
  { _id: 101, makerId: 1, model_name: "Jetta", description: "Jetta 2.0", year: 2024, cylinders: 4, hp: 150, weight_lb: 3000, accel_0_60_s: 8.5, mpg: 36 },
  { _id: 102, makerId: 1, model_name: "Golf", description: "Golf R 2.0t", year: 2024, cylinders: 4, hp: 315, weight_lb: 3300, accel_0_60_s: 4.5, mpg: 28 },
  { _id: 103, makerId: 2, model_name: "Prius", description: "Prius Hybrid", year: 2024, cylinders: 4, hp: 120, weight_lb: 2900, accel_0_60_s: 9.8, mpg: 55 },
  { _id: 104, makerId: 3, model_name: "Mustang", description: "Mustang GT", year: 2023, cylinders: 8, hp: 450, weight_lb: 3800, accel_0_60_s: 4.2, mpg: 19 },
  { _id: 105, makerId: 3, model_name: "F-150", description: "F-150 Raptor", year: 2022, cylinders: 8, hp: 400, weight_lb: 5000, accel_0_60_s: 5.5, mpg: 15 },
  { _id: 106, makerId: 4, model_name: "Civic", description: "Civic Si 1.5t", year: 2023, cylinders: 4, hp: 200, weight_lb: 2900, accel_0_60_s: 6.8, mpg: 38 },
  { _id: 107, makerId: 4, model_name: "Accord", description: "Accord V6", year: 2018, cylinders: 6, hp: 278, weight_lb: 3400, accel_0_60_s: 5.8, mpg: 25 },
  { _id: 108, makerId: 5, model_name: "GTR", description: "GTR 3.8t", year: 2024, cylinders: 6, hp: 565, weight_lb: 3900, accel_0_60_s: 2.9, mpg: 16 }
];

let inserted = 0;
let updated = 0;
let unchanged = 0;

for (const car of carsToLoad) {
  const { _id, ...fields } = car;
  const result = db.cars.updateOne(
    { _id },
    { $set: fields },
    { upsert: true }
  );

  if (result.upsertedCount === 1) {
    inserted++;
  } else if (result.modifiedCount === 1) {
    updated++;
  } else {
    unchanged++;
  }
}

print("Autos procesados: " + carsToLoad.length);
print("Insertados: " + inserted);
print("Actualizados: " + updated);
print("Sin cambios: " + unchanged);
print("Total de documentos en agencia.cars: " + db.cars.countDocuments({}));
print("Listado de autos:");
printjson(db.cars.find({}, { _id: 1, makerId: 1, model_name: 1 }).sort({ _id: 1 }).toArray());
