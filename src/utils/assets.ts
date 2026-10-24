/**
 * Resolves static public asset paths with Vite's BASE_URL
 * Ensures assets work on GitHub Pages subpaths (e.g. https://username.github.io/repo-name/)
 * as well as root domains and local development.
 */
export function getAssetUrl(path: string): string {
  if (!path) return '';
  // Return untouched if already external URL or base64 data URL
  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('data:') ||
    path.startsWith('blob:')
  ) {
    return path;
  }

  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const base = import.meta.env.BASE_URL || './';

  if (base === './' || base === '') {
    return `./${cleanPath}`;
  }

  return base.endsWith('/') ? `${base}${cleanPath}` : `${base}/${cleanPath}`;
}
