const {
  CarCrashError,
  SpeedingError,
  EngineFailureError,
  FlatTireError,
} = require("./errors");

function driveCar() {
  try {
    console.log("Starting the car...");
    startCar();

    console.log("Driving safely...");
    driveSafely();

    console.log("Checking speed...");
    checkSpeed();

    console.log("Parking the car...");
    parkCar();
  } catch (error) {
    if (error instanceof CarCrashError) {
      handleCarCrash();
    } else if (error instanceof SpeedingError) {
      handleSpeeding();
    } else if (error instanceof EngineFailureError) {
      handleEngineFailure();
    } else if (error instanceof FlatTireError) {
      handleFlatTire();
    } else {
      console.error("An unknown error occurred:", error);
      notifyAuthorities();
    }
  }
}

function startCar() {
  console.log("Car started.");
}

function driveSafely() {
  throw new CarCrashError("OOPs");
  console.log("Driving safely.");
}

function checkSpeed() {
  throw new SpeedingError("Driver was speeding");
  console.log("Speed checked.");
}

function parkCar() {
  console.log("Car parked.");
}

function handleCarCrash() {
  console.error("Car crash occurred");
  console.log("Activating airbags...");
  activateAirbags();
  console.log("Checking for injuries...");
  checkForInjuries();
  console.log("Assessing vehicle damage...");
  assessVehicleDamage();
  console.log("Emergency services called.");
}

function activateAirbags() {
  console.log("Airbags activated.");
}

function checkForInjuries() {
  const hasInjuries = Math.random() < 0.5;
  if (hasInjuries) {
    console.log(`Injuries detected for passenger.`);
    provideFirstAid();
  } else {
    console.log("No injuries detected.");
  }
}

function provideFirstAid() {
  console.log(`Providing first aid to passenger.`);
}

function assessVehicleDamage() {
  const vehicleDamage = Math.random() * 100;
  console.log(`Vehicle damage assessed: ${vehicleDamage.toFixed(2)}%.`);
}

function handleSpeeding() {
  console.error("Speeding occurred");
  console.log("Speeding ticket handled.");
}

function handleEngineFailure() {
  console.error("Engine failure occurred");
  console.log("Mechanic called.");
}

function handleFlatTire() {
  console.error("Flat tire occurred");
  console.log("Tire replaced.");
}

function notifyAuthorities() {
  console.log("Authorities notified.");
}

driveCar();
