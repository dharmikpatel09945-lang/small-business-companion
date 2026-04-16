import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface SaleItem {
  product: string;
  quantity: number;
  price: number;
}
export interface Sale {
  id: string;
  date: string;
  customerName: string; // The Prisma model has customerName instead of customer
  items: SaleItem[];
  total: number;
  paymentMethod: string;
  customer?: string; // fallback
}

export const useSales = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const { toast } = useToast();

  const fetchSales = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/sales", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        // The API returns customerName, but old mock data components might use 'customer'.
        const mapped = data.map((s: any) => ({...s, customer: s.customerName}));
        setSales(mapped);
      }
    } catch (e) {
      console.error("Failed to fetch sales from API", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, [token]);

  const addSale = async (
    newSaleData: Omit<Sale, "id" | "date">
  ): Promise<void> => {
    if (!token) return;
    try {
      const payload = {
        ...newSaleData,
        customerName: newSaleData.customer || newSaleData.customerName, // handle old component calls
        date: new Date().toISOString().split("T")[0]
      };
      
      const res = await fetch("/api/sales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const newSale = await res.json();
        newSale.customer = newSale.customerName; // Map it back
        setSales((prev) => [newSale, ...prev]);
        toast({ title: "Sale recorded successfully" });
      }
    } catch (e) {
      console.error("Failed to add sale", e);
      toast({ title: "Failed to record sale", variant: "destructive" });
    }
  };

  return { sales, loading, addSale, refresh: fetchSales };
};
