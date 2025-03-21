export function getApiUrl(path: string): string {
  const basePath = process.env.NODE_ENV === 'production' ? '/timeguessr' : '';
  return `${basePath}${path}`;
} 