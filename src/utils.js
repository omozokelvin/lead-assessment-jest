/**
 * This function should a correctly parsed number
 *
 * @returns {number} The parsed amount
 */
function normalizeAmount(amount) {
  if (typeof amount === 'number') {
    return amount;
  }

  return Number(amount.replace(/,/g, ''));
}

module.exports = { normalizeAmount };
