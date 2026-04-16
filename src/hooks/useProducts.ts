import { useState, useEffect } from "react";
import { Product } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  const fetchProducts = async () => {
    if (!token) {
       setLoading(false);
       return;
    }
    try {
      const res = await fetch("/api/inventory", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (e) {
      console.error("Failed to fetch products from API", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [token]);

  const addProduct = async (
    newProductData: Omit<Product, "id" | "status">
  ): Promise<void> => {
    if (!token) return;
    try {
      const payload = {
        ...newProductData,
        status:
          newProductData.stock <= 0
            ? "out_of_stock"
            : newProductData.stock <= newProductData.minStock
            ? "low_stock"
            : "in_stock",
      };
      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const newProduct = await res.json();
        setProducts((prev) => [...prev, newProduct]);
      }
    } catch (e) {
      console.error("Failed to add product", e);
    }
  };

  const updateProductStock = async (productId: string, quantityToReduce: number): Promise<void> => {
    // For now, statically update the client state. To be robust, this should hit a PUT /api/inventory/:id
    const currentProducts = products.map((p) => {
      if (p.id === productId) {
        const newStock = Math.max(0, p.stock - quantityToReduce);
        return {
          ...p,
          stock: newStock,
          status: newStock <= 0 ? "out_of_stock" : newStock <= p.minStock ? "low_stock" : "in_stock"
        } as Product;
      }
      return p;
    });

    setProducts(currentProducts);
  };

  return { products, loading, addProduct, updateProductStock, refresh: fetchProducts };
};
