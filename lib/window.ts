export const safeWindow = (cb: any) => {
  if (typeof window !== 'undefined') {
    return cb();
  }
};
