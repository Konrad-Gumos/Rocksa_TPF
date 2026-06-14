import { api, apiOptional } from "../lib/api.ts";

export interface Address {
  id: string;
  userId: string;
  country: string;
  firstName: string;
  lastName: string;
  line1: string;
  line2: string | null;
  city: string;
  postal: string;
  phone: string | null;
  kind: string;
}

export interface AddressInput {
  country: string;
  firstName: string;
  lastName: string;
  line1: string;
  line2?: string;
  city: string;
  postal: string;
  phone?: string;
}

export const fetchAddresses = async (): Promise<Address[]> => {
  const res = await apiOptional<{ addresses: Address[] }>("/v1/addresses");
  return res?.addresses ?? [];
};

export const createAddress = async (input: AddressInput): Promise<Address | null> => {
  const res = await apiOptional<{ address: Address }>("/v1/addresses", {
    method: "POST",
    body: input,
  });
  return res?.address ?? null;
};

export const deleteAddress = async (id: string): Promise<void> => {
  await api(`/v1/addresses/${id}`, { method: "DELETE" });
};

export const addressToCheckout = (a: Address) => ({
  firstName: a.firstName,
  lastName: a.lastName,
  country: a.country,
  address: a.line1,
  apartment: a.line2 ?? "",
  city: a.city,
  postal: a.postal,
  phone: a.phone ?? "",
});
