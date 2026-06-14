import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Button, Card, CardBody } from "@rocksa/ui";
import { formatPrice } from "@rocksa/domain";
import { useAuth } from "@rocksa/auth";
import { useOrder } from "../../state/order.tsx";
import { useSpecimenLookup } from "../../data/api-specimens.ts";
import { fetchOrder, type ServerOrderItem } from "../../data/api-orders.ts";
import { DiamondIcon } from "../../components/Icons.tsx";

export const Route = createFileRoute("/orders/$orderId")({ component: OrderPage });

type DisplayItem = {
  key: string;
  name: string;
  description: string;
  imageUrl: string;
  attributes: Record<string, string>;
  qty: number;
  unitPriceCents: number;
};

const itemFromSnapshot = (item: ServerOrderItem): DisplayItem => {
  const snap = item.snapshotJson;
  const attrs = (snap["attributes"] as Record<string, string> | undefined) ?? {};
  return {
    key: item.specimenId,
    name: String(snap["name"] ?? "Specimen"),
    description: String(snap["description"] ?? ""),
    imageUrl: String(snap["imageUrl"] ?? ""),
    attributes: attrs,
    qty: item.qty,
    unitPriceCents: item.unitPriceCents,
  };
};

function OrderPage() {
  const { orderId } = Route.useParams();
  const { lastOrder } = useOrder();
  const { status } = useAuth();
  const findSpecimenById = useSpecimenLookup();

  const { data: fetched, isLoading } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => fetchOrder(orderId),
    enabled: status === "authed",
    staleTime: 60_000,
  });

  const sessionOrder =
    lastOrder && lastOrder.id === orderId ? lastOrder : null;
  const order = fetched ?? sessionOrder;

  if (isLoading && status === "authed" && !sessionOrder) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-surface-muted text-ink-500">
        Loading order…
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-surface-muted">
        <Card className="max-w-md">
          <CardBody className="text-center space-y-4">
            <p className="text-ink-500">We couldn't locate this order.</p>
            <Button asChild>
              <Link to="/">Return home</Link>
            </Button>
          </CardBody>
        </Card>
      </main>
    );
  }

  const displayItems: DisplayItem[] = fetched
    ? fetched.items.map(itemFromSnapshot)
    : sessionOrder
      ? sessionOrder.items
          .map((item) => {
            const s = findSpecimenById(item.specimenId);
            if (!s) return null;
            return {
              key: item.specimenId,
              name: s.name,
              description: s.description,
              imageUrl: s.imageUrl,
              attributes: s.attributes,
              qty: item.qty,
              unitPriceCents: item.unitPriceCents,
            };
          })
          .filter((i): i is DisplayItem => i !== null)
      : [];

  const reference = order.reference;

  return (
    <main className="min-h-screen flex items-center justify-center bg-surface-muted px-6 py-16">
      <Card className="w-full max-w-2xl">
        <CardBody className="space-y-8 p-10">
          <div className="text-center space-y-3">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-md bg-brand-100 text-brand-600">
              <DiamondIcon className="h-7 w-7" />
            </span>
            <h1 className="font-display text-5xl text-brand-600">Acquisition Confirmed</h1>
            <p className="text-xs uppercase tracking-wider text-ink-500">
              Order Reference — #{reference}
            </p>
            <p className="text-ink-700 leading-relaxed max-w-md mx-auto">
              Thank you for entrusting Rocksa with this exceptional addition to your collection. One
              of our senior curators will be in touch shortly to coordinate secure vault transfer,
              insurance underwriting, and personalized delivery logistics.
            </p>
          </div>

          <div className="space-y-3">
            {displayItems.map((item) => (
              <div
                key={item.key}
                className="flex gap-5 rounded-md border border-ink-700/5 bg-surface-muted p-4"
              >
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt="" className="h-24 w-24 rounded-md object-cover" />
                ) : (
                  <div className="h-24 w-24 rounded-md bg-surface-soft" />
                )}
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-display text-xl">{item.name}</h3>
                    <p className="font-medium">{formatPrice(item.unitPriceCents * item.qty)}</p>
                  </div>
                  {item.description && (
                    <p className="text-xs text-ink-500 mt-1 line-clamp-2">{item.description}</p>
                  )}
                  <dl className="mt-3 grid grid-cols-4 gap-3 text-xs">
                    {Object.entries(item.attributes)
                      .slice(0, 4)
                      .map(([k, v]) => (
                        <div key={k}>
                          <dt className="uppercase tracking-wider text-ink-500">{k}</dt>
                          <dd className="text-ink-900">{v}</dd>
                        </div>
                      ))}
                  </dl>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <Button asChild variant="secondary">
              <Link to="/">Continue shopping</Link>
            </Button>
          </div>
        </CardBody>
      </Card>
    </main>
  );
}
