export function getShortAddress(addr) {
  const len = addr.length;
  return addr.substring(0, 6) + "..." + addr.substring(len - 5, len);
}
