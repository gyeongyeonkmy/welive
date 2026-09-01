export const isVercelRuntime = () => {
  return Boolean(process.env.VERCEL || process.env.VERCEL_ENV);
};
