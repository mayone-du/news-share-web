export const genId = (() => {
  let count = 0;
  return () => (++count).toString();
})();
