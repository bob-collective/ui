const truncateBtcAddress = (address: string) => address.slice(0, 6) + '...' + address.slice(-6);

const truncateUrl = (string: string) => string.slice(0, 10) + '...' + string.slice(-4);

// Captures 0x + 4 characters, then the last 4 characters.
const truncateEthRegex = /^(0x[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/;

/**
 * Truncates an ethereum address to the format 0x0000…0000
 * @param address Full address to truncate
 * @returns Truncated address
 */
const truncateEthAddress = (address: string | `0x${string}`) => {
  const match = address.match(truncateEthRegex);

  if (!match) return address;

  return `${match[1]}…${match[2]}`;
};

export { truncateEthAddress, truncateBtcAddress, truncateUrl };
