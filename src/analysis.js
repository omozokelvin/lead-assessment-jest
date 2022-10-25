const { getTrips, getDriver } = require('api');
const { normalizeAmount } = require('./utils');

/**
 * This function should return the trip data analysis
 *
 * @returns {any} Trip data analysis
 */
async function analysis() {
  const trips = await getTrips();

  let noOfCashTrips = 0;
  let noOfNonCashTrips = 0;
  let billedTotal = 0;
  let cashBilledTotal = 0;
  let nonCashBilledTotal = 0;

  const driversWithMoreThanOneVehicle = new Set();

  let driversDetails = [];

  for (const trip of trips) {
    const normalizedAmount = normalizeAmount(trip.billedAmount);
    if (trip.isCash) {
      noOfCashTrips++;
      cashBilledTotal += normalizedAmount;
    }

    if (!trip.isCash) {
      noOfNonCashTrips++;
      nonCashBilledTotal += normalizedAmount;
    }

    billedTotal += normalizedAmount;

    try {
      const driver = await getDriver(trip.driverID);

      if (driver.vehicleID.length > 1) {
        driversWithMoreThanOneVehicle.add(trip.vehicleID);
      }

      const foundIndex = driversDetails.findIndex(
        (item) => item.driverID === trip.driverID,
      );

      if (foundIndex === -1) {
        driversDetails.push({
          driverID: trip.driverID,
          name: driver.name,
          email: driver.email,
          phone: driver.phone,
          noOfTrips: 1,
          totalAmountEarned: normalizedAmount,
        });
      } else {
        driversDetails[foundIndex].noOfTrips++;
        driversDetails[foundIndex].totalAmountEarned =
          driversDetails[foundIndex].totalAmountEarned + normalizedAmount;
      }
    } catch (error) {
      console.log('bad driver');
    }
  }

  // const driverIdWithHighestTrips =
  let highestTrips = 0;
  let highestTripsDriverId = null;

  let highestAmount = 0;
  let highestAmountDriverId = null;

  for (driver of driversDetails) {
    if (highestTrips <= driver.noOfTrips) {
      highestTripsDriverId = driver.driverID;
      highestTrips = driver.noOfTrips;
    }

    if (highestAmount <= driver.totalAmountEarned) {
      highestAmountDriverId = driver.driverID;
      highestAmount = driver.totalAmountEarned;
    }
  }

  const mostTripsByDriver = driversDetails.find(
    ({ driverID }) => driverID === highestTripsDriverId,
  );

  const highestEarningDriver = driversDetails.find(
    ({ driverID }) => driverID === highestAmountDriverId,
  );

  delete mostTripsByDriver.driverID;
  delete highestEarningDriver.driverID;

  return {
    noOfCashTrips,
    noOfNonCashTrips,
    billedTotal,
    cashBilledTotal,
    nonCashBilledTotal,
    noOfDriversWithMoreThanOneVehicle: driversWithMoreThanOneVehicle.size,
    mostTripsByDriver,
    highestEarningDriver,
  };
}

module.exports = analysis;
