const analysis = require('../src/analysis');
const driverReport = require('../src/report');
const report = require('../fixtures/report.json');

describe('analysis spec', () => {
  test('matches the required data format', () => {
    return expect(analysis()).resolves.toEqual({
      noOfCashTrips: expect.any(Number),
      noOfNonCashTrips: expect.any(Number),
      billedTotal: expect.any(Number),
      cashBilledTotal: expect.any(Number),
      nonCashBilledTotal: expect.any(Number),
      noOfDriversWithMoreThanOneVehicle: expect.any(Number),
      mostTripsByDriver: {
        name: expect.any(String),
        email: expect.any(String),
        phone: expect.any(String),
        noOfTrips: expect.any(Number),
        totalAmountEarned: expect.any(Number),
      },
      highestEarningDriver: {
        name: expect.any(String),
        email: expect.any(String),
        phone: expect.any(String),
        noOfTrips: expect.any(Number),
        totalAmountEarned: expect.any(Number),
      },
    });
  }, 100000);

  test('analysis solution', () => {
    return expect(analysis()).resolves.toEqual({
      noOfCashTrips: 26,
      noOfNonCashTrips: 24,
      billedTotal: 128224.69,
      cashBilledTotal: 69043.8,
      nonCashBilledTotal: 59180.89,
      noOfDriversWithMoreThanOneVehicle: 3,
      mostTripsByDriver: {
        name: 'Bush Gibbs',
        email: 'bushgibbs@example.com',
        phone: '+234 808-204-2520',
        noOfTrips: 7,
        totalAmountEarned: 17656.46,
      },
      highestEarningDriver: {
        name: 'Hughes Strickland',
        email: 'hughesstrickland@example.com',
        phone: '+234 808-084-4833',
        noOfTrips: 7,
        totalAmountEarned: 24508.77,
      },
    });
  });
});

describe('driver report', () => {
  test('matches the required data format', async () => {
    return expect(driverReport()).resolves.toEqual(report);
  });
});
