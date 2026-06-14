import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Button, Card, CardBody } from "@rocksa/ui";
import { formatPrice } from "@rocksa/domain";
import { fetchOrders } from "../../data/api-orders.ts";
import { storefrontMainClassName } from "../../lib/layout.ts";

export const Route = createFileRoute("/account/orders")({ component: AccountOrdersPage });

const formatOrderDate = (iso: string): string =>
  new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const statusLabel = (status: string): string =>
  status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

function AccountOrdersPage() {
  const {
    data: orders = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
    staleTime: 30_000,
  });

  return (
    <main className={storefrontMainClassName}>
      <h1 className="font-display text-5xl">Your Orders</h1>
      <p className="mt-2 text-ink-500">A record of your acquisitions with Rocksa.</p>

      {isLoading && <p className="mt-10 text-ink-500">Loading orders…</p>}

      {isError && (
        <Card className="mt-10">
          <CardBody className="text-center py-12">
            <p className="text-ink-500">We couldn't load your order history.</p>
            <Button asChild className="mt-4" variant="secondary">
              <Link to="/">Continue shopping</Link>
            </Button>
          </CardBody>
        </Card>
      )}

      {!isLoading && !isError && orders.length === 0 && (
        <Card className="mt-10">
          <CardBody className="text-center py-12">
            <p className="text-ink-500">You haven't placed any orders yet.</p>
            <Button asChild className="mt-4" variant="secondary">
              <Link to="/">Explore the collection</Link>
            </Button>
          </CardBody>
        </Card>
      )}

      {!isLoading && !isError && orders.length > 0 && (
        <ul className="mt-10 space-y-4">
          {orders.map((order) => (
            <li key={order.id}>
              <Link
                to="/orders/$orderId"
                params={{ orderId: order.id }}
                className="block rounded-md border border-ink-700/5 bg-surface-muted transition hover:border-brand-200"
              >
                <CardBody className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-ink-500">
                      #{order.reference}
                    </p>
                    <p className="font-display text-xl">{formatOrderDate(order.createdAt)}</p>
                    <p className="mt-1 text-sm text-ink-500">{statusLabel(order.status)}</p>
                  </div>
                  <p className="font-medium text-lg">{formatPrice(order.totalCents)}</p>
                </CardBody>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
