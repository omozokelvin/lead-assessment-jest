const { getTrips, getDriver, getVehicle, getDrivers } = require('api');
const { normalizeAmount } = require('./utils');

/**
 * This function should return the data for drivers in the specified format
 *
 * @returns {any} Driver report data
 */
async function driverReport() {
  const drivers = await getDrivers();
  const trips = await getTrips();

  const driverReports = [];

  for (const [driverId, driverObj] of Object.entries(drivers)) {
    const vehicles = [];

    for (const vehicleId of driverObj.vehicleID) {
      const vehicle = await getVehicle(vehicleId);

      vehicles.push({
        plate: vehicle.plate,
        manufacturer: vehicle.manufacturer,
      });
    }

    let noOfCashTrips = 0;
    let noOfNonCashTrips = 0;
    let totalAmountEarned = 0;
    let totalCashAmount = 0;
    let totalNonCashAmount = 0;

    const filteredTrips = trips
      .filter((trip) => trip.driverID === driverId)
      .map((trip) => {
        const normalizedAmount = normalizeAmount(trip.billedAmount);

        if (trip.isCash) {
          noOfCashTrips++;
          totalCashAmount += normalizedAmount;
        }

        if (!trip.isCash) {
          noOfNonCashTrips++;
          totalNonCashAmount += normalizedAmount;
        }

        totalAmountEarned += normalizedAmount;

        return {
          user: trip.user.name,
          created: trip.created,
          pickup: trip.pickup.address,
          destination: trip.destination.address,
          billed: normalizedAmount,
          isCash: trip.isCash,
        };
      });

    driverReports.push({
      name: driverObj.name,
      phone: driverObj.phone,
      id: driverId,
      vehicles: [...vehicles],
      noOfTrips: filteredTrips.length,
      noOfCashTrips,
      noOfNonCashTrips,
      trips: [...filteredTrips],
      totalAmountEarned,
      totalCashAmount,
      totalNonCashAmount,
    });
  }

  console.log('driver -> ', driverReports);

  return driverReports;
}

module.exports = driverReport;
