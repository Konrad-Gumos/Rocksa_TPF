import { createFileRoute, Link } from "@tanstack/react-router";
import { Button, Card, CardBody } from "@rocksa/ui";
import { useAuth } from "@rocksa/auth";

export const Route = createFileRoute("/account/")({ component: AccountHome });

function AccountHome() {
  const { user, profile } = useAuth();

  return (
    <main className="flex-1 px-10 py-12">
      <h1 className="font-display text-5xl">Account</h1>
      <p className="mt-2 text-ink-500">Manage your profile, orders, and saved addresses.</p>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        <Card>
          <CardBody className="space-y-2">
            <p className="text-xs uppercase tracking-wider text-ink-500">Profile</p>
            <p className="font-medium">{profile?.fullName ?? user?.displayName ?? "—"}</p>
            <p className="text-sm text-ink-500">{user?.email}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="space-y-3">
            <p className="text-xs uppercase tracking-wider text-ink-500">Orders</p>
            <p className="text-sm text-ink-700">View your acquisition history.</p>
            <Button asChild size="sm" variant="secondary">
              <Link to="/account/orders">View orders</Link>
            </Button>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="space-y-3">
            <p className="text-xs uppercase tracking-wider text-ink-500">Addresses</p>
            <p className="text-sm text-ink-700">Saved shipping addresses for faster checkout.</p>
            <Button asChild size="sm" variant="secondary">
              <Link to="/account/addresses">Manage addresses</Link>
            </Button>
          </CardBody>
        </Card>
      </div>
    </main>
  );
}
