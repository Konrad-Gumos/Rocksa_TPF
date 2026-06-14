import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Badge, Button, Card, CardBody, Dialog, DialogContent, Input, Label } from "@rocksa/ui";
import { formatPrice } from "@rocksa/domain";
import { useSpecimens } from "../../data/specimens-query.ts";
import { createSpecimen, type NewSpecimenInput } from "../../data/api-workspace.ts";
import { PlusIcon } from "../../components/Icons.tsx";

export const Route = createFileRoute("/workspace/inventory")({ component: Inventory });

const STATUS_TONE = {
  in_stock: "brand",
  low_stock: "warning",
  on_display: "neutral",
  sold: "danger",
} as const;

const emptyForm = (): NewSpecimenInput => ({
  slug: "",
  name: "",
  category: "crystals",
  description: "",
  priceCents: 0,
});

function Inventory() {
  const queryClient = useQueryClient();
  const { data: items = [] } = useSpecimens();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const addMutation = useMutation({
    mutationFn: createSpecimen,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["specimens"] });
      setForm(emptyForm());
      setOpen(false);
    },
  });

  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-5xl">Inventory</h1>
          <p className="text-ink-500 mt-1">
            Manage and track your comprehensive gemstone and mineral collection.
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <PlusIcon className="h-4 w-4" /> Add New Specimen
        </Button>
      </div>

      <Card className="mt-8">
        <CardBody className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-ink-500">
                <th className="px-6 py-3">Specimen</th>
                <th>Category</th>
                <th>Status</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {items.map((s) => (
                <tr key={s.id} className="border-t border-ink-700/5">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={s.imageUrl} alt="" className="h-10 w-10 rounded-md object-cover" />
                      <span className="font-medium">{s.name}</span>
                    </div>
                  </td>
                  <td className="capitalize">{s.category}</td>
                  <td>
                    <Badge tone={STATUS_TONE[s.stockStatus]}>
                      {s.stockStatus.replace("_", " ")}
                    </Badge>
                  </td>
                  <td>{formatPrice(s.priceCents)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <h2 className="font-display text-2xl">Add specimen</h2>
          <div className="mt-4 space-y-3">
            <div>
              <Label>Slug</Label>
              <Input
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              />
            </div>
            <div>
              <Label>Name</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div>
              <Label>Category</Label>
              <Input
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>
            <div>
              <Label>Price (cents)</Label>
              <Input
                type="number"
                value={form.priceCents || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, priceCents: Number(e.target.value) || 0 }))
                }
              />
            </div>
            <Button
              className="w-full"
              onClick={() => addMutation.mutate(form)}
              disabled={addMutation.isPending}
            >
              Save specimen
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
