export const basePath = process.env.WORLDLING_BASE_PATH || "/";
if (!/^\/(?:[A-Za-z0-9_.-]+\/)*$/.test(basePath)) {
  throw new Error(
    "WORLDLING_BASE_PATH must be an absolute directory path with a trailing slash.",
  );
}
