import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Badge, Card, CardBody } from "@rocksa/ui";
import { formatPrice } from "@rocksa/domain";
import { TruckIcon, VaultIcon, DiamondIcon } from "../../components/Icons.tsx";
import { fetchWorkspaceOverview } from "../../data/api-workspace.ts";

export const Route = createFileRoute("/workspace/overview")({ component: Overview });

const STAT_ICONS = [VaultIcon, DiamondIcon, TruckIcon] as const;

function Overview() {
  const { data } = useQuery({
    queryKey: ["workspace", "overview"],
    queryFn: fetchWorkspaceOverview,
  });

  const stats = data?.stats;
  const cards = [
    {
      label: "Total Specimens",
      value: String(stats?.specimenCount ?? "—"),
      hint: "In catalog",
      hintTone: "ink" as const,
    },
    {
      label: "Collection Value",
      value: stats ? formatPrice(stats.collectionValueCents) : "—",
      hint: "Estimated",
      hintTone: "ink" as const,
    },
    {
      label: "Pending Shipments",
      value: String(stats?.pendingShipments ?? "—"),
      hint: "Awaiting dispatch",
      hintTone: "danger" as const,
    },
  ];

  const recent = data?.recentOrders ?? [];

  return (
    <div>
      <h1 className="font-display text-5xl">Overview</h1>
      <p className="text-ink-500 mt-1">
        At-a-glance summary of your curated collection and recent logistical activities.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {cards.map((s, i) => {
          const Icon = STAT_ICONS[i] ?? VaultIcon;
          return (
            <Card key={s.label}>
              <CardBody>
                <div className="flex items-start justify-between">
                  <p className="text-xs uppercase tracking-wider text-ink-500">{s.label}</p>
                  <Icon className="text-brand-600" />
                </div>
                <p className="font-display text-5xl mt-3">{s.value}</p>
                <p
                  className={
                    "text-xs mt-1 " + (s.hintTone === "danger" ? "text-rose-600" : "text-ink-400")
                  }
                >
                  {s.hint}
                </p>
              </CardBody>
            </Card>
          );
        })}
      </div>

      <Card className="mt-10">
        <CardBody>
          <h2 className="font-display text-2xl">Recent Orders</h2>
          {recent.length === 0 ? (
            <p className="mt-4 text-sm text-ink-500">No orders yet.</p>
          ) : (
            <table className="mt-4 w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-ink-500">
                  <th className="py-2">Reference</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((o) => (
                  <tr key={o.id} className="border-t border-ink-700/5">
                    <td className="py-3 font-medium">#{o.reference}</td>
                    <td>
                      <Badge tone="neutral">{o.status.replace(/_/g, " ")}</Badge>
                    </td>
                    <td>{formatPrice(o.totalCents)}</td>
                    <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
