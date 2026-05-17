import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Trash2, ShoppingBag } from "lucide-react";
import { cart, useCart } from "@/lib/cart";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/panier")({
  component: PanierPage,
  head: () => ({ meta: [{ title: "Panier — Verodav" }] }),
});

type Address = {
  full_name: string;
  line1: string;
  line2?: string | null;
  postal_code: string;
  city: string;
  country: string;
  phone?: string | null;
};

function PanierPage() {
  const items = useCart();
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [address, setAddress] = useState<Address>({
    full_name: "",
    line1: "",
    line2: "",
    postal_code: "",
    city: "",
    country: "France",
    phone: "",
  });
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const uid = data.user?.id ?? null;
      setUserId(uid);
      if (!uid) return;
      supabase
        .from("addresses")
        .select("*")
        .eq("user_id", uid)
        .order("is_default", { ascending: false })
        .limit(1)
        .maybeSingle()
        .then(({ data: a }) => {
          if (a) {
            setAddress({
              full_name: a.full_name ?? "",
              line1: a.line1 ?? "",
              line2: a.line2 ?? "",
              postal_code: a.postal_code ?? "",
              city: a.city ?? "",
              country: a.country ?? "France",
              phone: a.phone ?? "",
            });
          }
        });
    });
  }, []);

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) {
      navigate({ to: "/auth", search: { redirect: "/panier" } as never });
      return;
    }
    if (items.length === 0) return;
    setSubmitting(true);
    const { data, error } = await supabase.rpc("place_order", {
      _items: items.map((i) => ({ id: i.id, qty: i.qty })),
      _shipping_address: address,
      _notes: notes || undefined,
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message || "Erreur lors de la commande");
      return;
    }
    cart.clear();
    toast.success("Commande créée avec succès");
    navigate({ to: "/commandes" });
    void data;
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground" />
        <h1 className="mt-6 text-2xl font-semibold">Votre panier est vide</h1>
        <Link to="/boutique" className="mt-6 inline-block bg-primary px-6 py-3 text-xs uppercase tracking-widest text-primary-foreground hover:bg-copper transition">
          Continuer mes achats
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-semibold mb-8">Panier</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((i) => (
            <div key={i.id} className="flex gap-4 border border-border p-4">
              {i.image && <img src={i.image} alt={i.name} className="h-24 w-24 object-cover" />}
              <div className="flex-1">
                <div className="font-medium">{i.name}</div>
                <div className="text-sm text-muted-foreground">{i.price.toFixed(2)} €</div>
                <div className="mt-2 inline-flex items-center border border-border">
                  <button onClick={() => cart.setQty(i.id, i.qty - 1)} className="px-3 py-1 hover:bg-secondary">−</button>
                  <span className="px-4 py-1 min-w-10 text-center">{i.qty}</span>
                  <button onClick={() => cart.setQty(i.id, i.qty + 1)} className="px-3 py-1 hover:bg-secondary">+</button>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold">{(i.price * i.qty).toFixed(2)} €</div>
                <button onClick={() => cart.remove(i.id)} className="mt-2 text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleCheckout} className="border border-border p-6 space-y-4 h-fit">
          <h2 className="text-lg font-semibold">Livraison</h2>
          {!userId && (
            <p className="text-sm text-muted-foreground">
              Vous devez <Link to="/auth" className="underline">vous connecter</Link> pour valider la commande.
            </p>
          )}
          <input required placeholder="Nom complet" value={address.full_name} onChange={(e) => setAddress({ ...address, full_name: e.target.value })} className="w-full border border-border px-3 py-2 text-sm" />
          <input required placeholder="Adresse" value={address.line1} onChange={(e) => setAddress({ ...address, line1: e.target.value })} className="w-full border border-border px-3 py-2 text-sm" />
          <input placeholder="Complément" value={address.line2 ?? ""} onChange={(e) => setAddress({ ...address, line2: e.target.value })} className="w-full border border-border px-3 py-2 text-sm" />
          <div className="grid grid-cols-2 gap-3">
            <input required placeholder="Code postal" value={address.postal_code} onChange={(e) => setAddress({ ...address, postal_code: e.target.value })} className="w-full border border-border px-3 py-2 text-sm" />
            <input required placeholder="Ville" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} className="w-full border border-border px-3 py-2 text-sm" />
          </div>
          <input required placeholder="Pays" value={address.country} onChange={(e) => setAddress({ ...address, country: e.target.value })} className="w-full border border-border px-3 py-2 text-sm" />
          <input placeholder="Téléphone" value={address.phone ?? ""} onChange={(e) => setAddress({ ...address, phone: e.target.value })} className="w-full border border-border px-3 py-2 text-sm" />
          <textarea placeholder="Notes (facultatif)" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="w-full border border-border px-3 py-2 text-sm" />

          <div className="flex justify-between border-t border-border pt-4 text-lg font-semibold">
            <span>Total</span>
            <span>{total.toFixed(2)} €</span>
          </div>

          <button type="submit" disabled={submitting} className="w-full bg-primary px-6 py-3 text-xs uppercase tracking-widest text-primary-foreground hover:bg-copper transition disabled:opacity-50">
            {submitting ? "Validation…" : "Valider la commande"}
          </button>
        </form>
      </div>
    </div>
  );
}
