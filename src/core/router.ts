type RouteHandler = (params: Record<string, string>) => void | Promise<void>;

const routes = new Map<string, RouteHandler>();
let currentPath = '';

export function registerRoute(path: string, handler: RouteHandler): void {
  routes.set(path, handler);
}

export function navigate(path: string): void {
  const target = path.startsWith('/') ? path : `/${path}`;
  const currentHash = window.location.hash.slice(1);

  if (target === currentHash) {
    // Same hash — hashchange won't fire, so re-render manually
    void handleRoute();
    return;
  }
  window.location.hash = target;
}

export function getCurrentPath(): string {
  return currentPath;
}

function parseHash(): { route: string; params: Record<string, string> } {
  const hash = window.location.hash.slice(1) || '/';
  const [route, query] = hash.split('?');
  const params: Record<string, string> = {};
  if (query) {
    new URLSearchParams(query).forEach((v, k) => (params[k] = v));
  }
  return { route, params };
}

async function handleRoute(): Promise<void> {
  const { route, params } = parseHash();
  currentPath = route;

  const exact = routes.get(route);
  if (exact) {
    await exact(params);
    return;
  }

  for (const [pattern, handler] of routes) {
    const parts = pattern.split('/');
    const routeParts = route.split('/');
    if (parts.length !== routeParts.length) continue;

    const matchParams: Record<string, string> = { ...params };
    let matched = true;
    for (let i = 0; i < parts.length; i++) {
      if (parts[i].startsWith(':')) {
        matchParams[parts[i].slice(1)] = routeParts[i];
      } else if (parts[i] !== routeParts[i]) {
        matched = false;
        break;
      }
    }
    if (matched) {
      await handler(matchParams);
      return;
    }
  }

  const fallback = routes.get('/404');
  if (fallback) await fallback(params);
}

export function initRouter(): void {
  window.addEventListener('hashchange', () => void handleRoute());
  void handleRoute();
}
