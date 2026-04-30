const DEFAULT_LOCALE = 'uk';
const SUPPORTED_LOCALES = new Set(['uk', 'ru']);

export default {
  async fetch(request, env) {
    const requestUrl = new URL(request.url);
    const { pathname } = requestUrl;

    if (pathname === '/') {
      return redirectTo(requestUrl, `/${DEFAULT_LOCALE}/`, 302);
    }

    if (pathname === '/uk' || pathname === '/ru') {
      return redirectTo(requestUrl, `${pathname}/`, 308);
    }

    const assetResponse = await env.ASSETS.fetch(request);
    if (assetResponse.status !== 404) {
      return assetResponse;
    }

    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return assetResponse;
    }

    if (looksLikeFilePath(pathname)) {
      return assetResponse;
    }

    const acceptHeader = request.headers.get('accept') || '';
    if (!acceptHeader.includes('text/html')) {
      return assetResponse;
    }

    const locale = resolveLocale(pathname);
    const localizedIndexUrl = new URL(`/${locale}/index.html`, requestUrl);
    return env.ASSETS.fetch(new Request(localizedIndexUrl.toString(), request));
  },
};

function resolveLocale(pathname) {
  const firstSegment = pathname.split('/').filter(Boolean)[0];
  return SUPPORTED_LOCALES.has(firstSegment) ? firstSegment : DEFAULT_LOCALE;
}

function looksLikeFilePath(pathname) {
  const lastSegment = pathname.split('/').filter(Boolean).pop() || '';
  return lastSegment.includes('.');
}

function redirectTo(requestUrl, pathname, status) {
  const redirectUrl = new URL(requestUrl.toString());
  redirectUrl.pathname = pathname;
  return Response.redirect(redirectUrl, status);
}
