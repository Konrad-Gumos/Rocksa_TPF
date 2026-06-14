import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button, Card, CardBody, Input, Label } from "@rocksa/ui";
import {
  addressToCheckout,
  createAddress,
  deleteAddress,
  fetchAddresses,
  type AddressInput,
} from "../../data/api-addresses.ts";

export const Route = createFileRoute("/account/addresses")({ component: AccountAddresses });

const emptyForm = (): AddressInput => ({
  country: "",
  firstName: "",
  lastName: "",
  line1: "",
  line2: "",
  city: "",
  postal: "",
  phone: "",
});

function AccountAddresses() {
  const queryClient = useQueryClient();
  const { data: addresses = [], isLoading } = useQuery({
    queryKey: ["addresses"],
    queryFn: fetchAddresses,
  });
  const [form, setForm] = useState<AddressInput>(emptyForm);
  const [showForm, setShowForm] = useState(false);

  const addMutation = useMutation({
    mutationFn: createAddress,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["addresses"] });
      setForm(emptyForm());
      setShowForm(false);
    },
  });

  const removeMutation = useMutation({
    mutationFn: deleteAddress,
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["addresses"] }),
  });

  const field = (key: keyof AddressInput) => ({
    value: form[key] ?? "",
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value })),
  });

  return (
    <main className="flex-1 px-10 py-12">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-5xl">Addresses</h1>
          <p className="mt-2 text-ink-500">Saved for checkout prefill.</p>
        </div>
        <Button variant="secondary" onClick={() => setShowForm((v) => !v)}>
          {showForm ? "Cancel" : "Add address"}
        </Button>
      </div>

      {showForm && (
        <Card className="mt-8">
          <CardBody className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>First name</Label>
              <Input {...field("firstName")} />
            </div>
            <div>
              <Label>Last name</Label>
              <Input {...field("lastName")} />
            </div>
            <div className="sm:col-span-2">
              <Label>Country</Label>
              <Input {...field("country")} />
            </div>
            <div className="sm:col-span-2">
              <Label>Address</Label>
              <Input {...field("line1")} />
            </div>
            <div className="sm:col-span-2">
              <Label>Apartment (optional)</Label>
              <Input {...field("line2")} />
            </div>
            <div>
              <Label>City</Label>
              <Input {...field("city")} />
            </div>
            <div>
              <Label>Postal code</Label>
              <Input {...field("postal")} />
            </div>
            <div className="sm:col-span-2">
              <Label>Phone</Label>
              <Input {...field("phone")} />
            </div>
            <div className="sm:col-span-2">
              <Button
                onClick={() => addMutation.mutate(form)}
                disabled={addMutation.isPending}
              >
                Save address
              </Button>
            </div>
          </CardBody>
        </Card>
      )}

      {isLoading && <p className="mt-10 text-ink-500">Loading addresses…</p>}

      <ul className="mt-10 space-y-4">
        {addresses.map((a) => {
          const lines = addressToCheckout(a);
          return (
            <li key={a.id}>
              <Card>
                <CardBody className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="text-sm">
                    <p className="font-medium">
                      {lines.firstName} {lines.lastName}
                    </p>
                    <p className="text-ink-500 mt-1">
                      {lines.address}
                      {lines.apartment ? `, ${lines.apartment}` : ""}
                      <br />
                      {lines.city}, {lines.postal}
                      <br />
                      {lines.country}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => removeMutation.mutate(a.id)}
                  >
                    Remove
                  </Button>
                </CardBody>
              </Card>
            </li>
          );
        })}
      </ul>

      {!isLoading && addresses.length === 0 && !showForm && (
        <p className="mt-10 text-ink-500">No saved addresses yet.</p>
      )}
    </main>
  );
}
