/* eslint-disable xo/no-process-exit */
export default function logErrorAndExit(err) {
  console.error(err.stack)
  process.exit(1)
}
