const {
  getTrips,
  getDriver,
  getVehicle,
  getDrivers,
  getVehicles,
} = require('api');
const { normalizeAmount } = require('./utils');

/**
 * This function should return the data for drivers in the specified format
 *
 * @returns {any} Driver report data
 */
async function driverReport() {
  return Promise.all([getDrivers(), getTrips(), getVehicles()]).then(
    ([drivers, trips, vehicles]) => {
      const driverReports = [];

      for (const [driverId, driverObj] of Object.entries(drivers)) {
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
              billed: +normalizedAmount.toFixed(2),
              isCash: trip.isCash,
            };
          });

        const filteredVehicles = [];

        for (const vehicleId of driverObj.vehicleID) {
          const vehicle = vehicles[vehicleId];

          filteredVehicles.push({
            plate: vehicle.plate,
            manufacturer: vehicle.manufacturer,
          });
        }

        driverReports.push({
          fullName: driverObj.name,
          phone: driverObj.phone,
          id: driverId,
          vehicles: [...filteredVehicles],
          noOfTrips: filteredTrips.length,
          noOfCashTrips,
          noOfNonCashTrips,
          trips: [...filteredTrips],
          totalAmountEarned: +totalAmountEarned.toFixed(2),
          totalCashAmount: +totalCashAmount.toFixed(2),
          totalNonCashAmount: +totalNonCashAmount.toFixed(2),
        });
      }

      // console.log('driver reports -> ', driverReports);

      return driverReports;
    },
  );
}

module.exports = driverReport;
