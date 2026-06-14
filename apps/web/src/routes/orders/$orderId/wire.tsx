import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Button, Card, CardBody } from "@rocksa/ui";
import { formatPrice } from "@rocksa/domain";
import { useAuth } from "@rocksa/auth";
import { useOrder } from "../../../state/order.tsx";
import { fetchOrder } from "../../../data/api-orders.ts";
import { TopNav } from "../../../components/TopNav.tsx";

export const Route = createFileRoute("/orders/$orderId/wire")({
  component: WireInstructionsPage,
});

function WireInstructionsPage() {
  const { orderId } = Route.useParams();
  const { lastOrder } = useOrder();
  const { status } = useAuth();

  const { data: fetched } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => fetchOrder(orderId),
    enabled: status === "authed",
  });

  const order = fetched ?? (lastOrder?.id === orderId ? lastOrder : null);
  const reference = order?.reference ?? "—";
  const total = order?.totalCents ?? 0;

  return (
    <div className="min-h-screen">
      <TopNav variant="minimal" />
      <main className="mx-auto max-w-2xl px-6 py-16">
        <Card>
          <CardBody className="space-y-6 p-10">
            <h1 className="font-display text-4xl text-brand-600">Wire Transfer Instructions</h1>
            <p className="text-sm text-ink-700 leading-relaxed">
              Your order <strong>#{reference}</strong> is held in{" "}
              <strong>pending_payment</strong> until funds clear. Use the details below and
              include your order reference in the transfer memo.
            </p>
            <dl className="grid gap-3 text-sm rounded-md border border-ink-700/5 bg-surface-muted p-5">
              <div className="flex justify-between gap-4">
                <dt className="text-ink-500">Beneficiary</dt>
                <dd className="font-medium text-right">Rocksa Vault Holdings Ltd.</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-500">Bank</dt>
                <dd className="font-medium text-right">First National Trust</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-500">SWIFT / BIC</dt>
                <dd className="font-mono text-right">FNTRUS33</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-500">Account</dt>
                <dd className="font-mono text-right">8842-1093-7721</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-500">Reference</dt>
                <dd className="font-mono text-right">{reference}</dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-ink-700/10 pt-3">
                <dt className="text-ink-500">Amount due</dt>
                <dd className="font-display text-xl text-brand-600">{formatPrice(total)}</dd>
              </div>
            </dl>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button asChild variant="secondary">
                <Link to="/orders/$orderId" params={{ orderId }}>
                  Back to order
                </Link>
              </Button>
              <Button asChild>
                <Link to="/">Continue shopping</Link>
              </Button>
            </div>
          </CardBody>
        </Card>
      </main>
    </div>
  );
}
