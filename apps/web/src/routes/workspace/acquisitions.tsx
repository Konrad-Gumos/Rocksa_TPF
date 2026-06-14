import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Badge, Card, CardBody } from "@rocksa/ui";
import { fetchWorkspaceShipments } from "../../data/api-workspace.ts";

export const Route = createFileRoute("/workspace/acquisitions")({ component: Acquisitions });

function Acquisitions() {
  const { data: shipments = [], isLoading } = useQuery({
    queryKey: ["workspace", "shipments"],
    queryFn: fetchWorkspaceShipments,
  });

  return (
    <div>
      <h1 className="font-display text-5xl">Acquisitions Tracking</h1>
      <p className="text-ink-500 mt-1">Monitor active inbound logistics from the database.</p>

      <Card className="mt-8">
        <CardBody className="p-0">
          {isLoading ? (
            <p className="p-6 text-ink-500">Loading shipments…</p>
          ) : shipments.length === 0 ? (
            <p className="p-6 text-ink-500">No shipments recorded yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-ink-500">
                  <th className="px-6 py-3">Order</th>
                  <th>Origin</th>
                  <th>Status</th>
                  <th className="px-6">ETA</th>
                </tr>
              </thead>
              <tbody>
                {shipments.map((s) => (
                  <tr key={s.id} className="border-t border-ink-700/5">
                    <td className="px-6 py-3 font-mono text-xs">{s.orderId.slice(0, 8)}</td>
                    <td>{s.origin ?? "—"}</td>
                    <td>
                      <Badge tone="neutral">{s.status.replace(/_/g, " ")}</Badge>
                    </td>
                    <td className="px-6">{s.eta ? new Date(s.eta).toLocaleDateString() : "—"}</td>
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
