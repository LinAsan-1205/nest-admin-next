/**
 * 过多久后执行resolve
 * @param waitingMilliseconds
 * @returns {Promise<void>}
 */

export function waitingDelayResolve(waitingMilliseconds = 500) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, waitingMilliseconds);
  });
}
