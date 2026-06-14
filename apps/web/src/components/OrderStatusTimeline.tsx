import type { OrderStatus } from "@rocksa/domain";

const STEPS: { key: OrderStatus; label: string }[] = [
  { key: "pending_payment", label: "Pending payment" },
  { key: "paid", label: "Paid" },
  { key: "fulfilling", label: "Fulfilling" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
];

const rank = (status: string): number => {
  const idx = STEPS.findIndex((s) => s.key === status);
  return idx === -1 ? 0 : idx;
};

export const OrderStatusTimeline = ({ status }: { status: string }) => {
  const current = rank(status);

  return (
    <ol className="flex flex-wrap gap-2">
      {STEPS.map((step, i) => {
        const done = i <= current;
        const active = i === current;
        return (
          <li
            key={step.key}
            className={
              "rounded-md border px-3 py-1.5 text-xs " +
              (active
                ? "border-brand-600 bg-brand-50 text-brand-700"
                : done
                  ? "border-ink-700/10 bg-white text-ink-700"
                  : "border-ink-700/5 bg-surface-muted text-ink-400")
            }
          >
            {step.label}
          </li>
        );
      })}
    </ol>
  );
};
