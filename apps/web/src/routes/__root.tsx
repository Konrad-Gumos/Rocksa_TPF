import { Link, Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import type { AuthValue } from "@rocksa/auth";
import { CartProvider } from "@rocksa/cart";
import { Button, Card, CardBody } from "@rocksa/ui";
import { OrderProvider } from "../state/order.tsx";
import { WishlistProvider } from "../state/wishlist.tsx";

export interface RouterContext {
  queryClient: QueryClient;
  auth: AuthValue;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
  errorComponent: ({ error }) => <RouteError error={error} />,
  notFoundComponent: () => <NotFoundState />,
});

function RootLayout() {
  return (
    <CartProvider>
      <OrderProvider>
        <WishlistProvider>
          <div className="min-h-screen text-ink-900">
            <Outlet />
          </div>
        </WishlistProvider>
      </OrderProvider>
    </CartProvider>
  );
}

function RouteError({ error }: { error: Error }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface-muted p-8">
      <Card className="max-w-xl">
        <CardBody className="space-y-4">
          <p className="text-sm uppercase tracking-[0.25em] text-brand-700">Something went wrong</p>
          <h1 className="font-display text-3xl text-ink-900">The app shell could not render.</h1>
          <p className="text-sm text-ink-500">{error.message}</p>
          <Button asChild>
            <Link to="/">Return home</Link>
          </Button>
        </CardBody>
      </Card>
    </main>
  );
}

function NotFoundState() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface-muted p-8">
      <Card className="max-w-xl">
        <CardBody className="space-y-4">
          <p className="text-sm uppercase tracking-[0.25em] text-brand-700">404</p>
          <h1 className="font-display text-3xl text-ink-900">Page not found</h1>
          <p className="text-sm text-ink-500">The route you tried to open does not exist yet.</p>
          <Button asChild>
            <Link to="/">Go to the storefront</Link>
          </Button>
        </CardBody>
      </Card>
    </main>
  );
}
