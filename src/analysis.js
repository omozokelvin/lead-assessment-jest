const { getTrips, getDriver, getDrivers } = require('api');
const { normalizeAmount } = require('./utils');

/**
 * This function should return the trip data analysis
 *
 * @returns {any} Trip data analysis
 */
async function analysis() {
  return getTrips().then((trips) => {
    let tripDrivers = [];

    let noOfCashTrips = 0;
    let noOfNonCashTrips = 0;
    let billedTotal = 0;
    let cashBilledTotal = 0;
    let nonCashBilledTotal = 0;

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

      const foundIndex = tripDrivers.findIndex(
        (driver) => driver.id === trip.driverID,
      );

      if (foundIndex === -1) {
        tripDrivers.push({
          id: trip.driverID,
          noOfTrips: 1,
          totalAmountEarned: normalizedAmount,
        });
      } else {
        tripDrivers[foundIndex].noOfTrips++;
        tripDrivers[foundIndex].totalAmountEarned =
          tripDrivers[foundIndex].totalAmountEarned + normalizedAmount;
      }
    }

    let tempMostTripsByDriver = {
      driverID: null,
      noOfTrips: 0,
      totalAmountEarned: 0,
    };

    let tempHighestEarningDriver = {
      driverID: null,
      noOfTrips: 0,
      totalAmountEarned: 0,
    };

    for (driver of tripDrivers) {
      if (tempMostTripsByDriver.noOfTrips < driver.noOfTrips) {
        tempMostTripsByDriver.driverID = driver.id;
        tempMostTripsByDriver.noOfTrips = driver.noOfTrips;
        tempMostTripsByDriver.totalAmountEarned = driver.totalAmountEarned;
      }

      if (
        tempHighestEarningDriver.totalAmountEarned < driver.totalAmountEarned
      ) {
        tempHighestEarningDriver.driverID = driver.id;
        tempHighestEarningDriver.noOfTrips = driver.noOfTrips;
        tempHighestEarningDriver.totalAmountEarned = driver.totalAmountEarned;
      }
    }

    return getDrivers().then((drivers) => {
      const filteredDrivers = [];

      let noOfDriversWithMoreThanOneVehicle = 0;

      let mostTripsByDriver = {};
      let highestEarningDriver = {};

      const tripDriverIDS = tripDrivers.map((item) => item.id);

      for (const [driverId, driverObj] of Object.entries(drivers)) {
        if (tripDriverIDS.includes(driverId)) {
          filteredDrivers.push({
            id: driverId,
            name: driverObj.name,
            phone: driverObj.phone,
            vehicleID: driverObj.vehicleID,
          });

          if (driverObj.vehicleID.length > 1) {
            noOfDriversWithMoreThanOneVehicle++;
          }

          if (driverId === tempMostTripsByDriver.driverID) {
            mostTripsByDriver.name = driverObj.name;
            mostTripsByDriver.email = driverObj.email;
            mostTripsByDriver.phone = driverObj.phone;

            mostTripsByDriver.noOfTrips = tempMostTripsByDriver.noOfTrips;
            mostTripsByDriver.totalAmountEarned =
              tempMostTripsByDriver.totalAmountEarned;
          }

          if (driverId === tempHighestEarningDriver.driverID) {
            highestEarningDriver.name = driverObj.name;
            highestEarningDriver.email = driverObj.email;
            highestEarningDriver.phone = driverObj.phone;
            highestEarningDriver.noOfTrips = tempHighestEarningDriver.noOfTrips;
            highestEarningDriver.totalAmountEarned =
              tempHighestEarningDriver.totalAmountEarned;
          }
        }
      }

      const payload = {
        noOfCashTrips,
        noOfNonCashTrips,
        billedTotal: +billedTotal.toFixed(2),
        cashBilledTotal: +cashBilledTotal.toFixed(2),
        nonCashBilledTotal: +nonCashBilledTotal.toFixed(2),
        noOfDriversWithMoreThanOneVehicle,
        mostTripsByDriver,
        highestEarningDriver,
      };

      // console.log('payload => ', payload);

      return payload;
    });
  });
}

module.exports = analysis;
