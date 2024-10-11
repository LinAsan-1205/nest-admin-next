/**
 * 过多久后执行resolve
 * @param waitingMilliseconds
 * @returns {Promise<void>}
 */
export function waitingDelayResolve(waitingMilliseconds = 500) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, waitingMilliseconds);
  });
}
