import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/data/mockData";

interface AddProductDialogProps {
  onAddProduct: (product: Omit<Product, "id" | "status">) => Promise<void>;
}

export function AddProductDialog({ onAddProduct }: AddProductDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    sku: "",
    price: "",
    cost: "",
    stock: "",
    minStock: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.name || !formData.sku) {
        throw new Error("Name and SKU are required.");
      }

      await onAddProduct({
        name: formData.name,
        category: formData.category,
        sku: formData.sku,
        price: parseFloat(formData.price) || 0,
        cost: parseFloat(formData.cost) || 0,
        stock: parseInt(formData.stock, 10) || 0,
        minStock: parseInt(formData.minStock, 10) || 0,
      });

      toast({
        title: "Product added!",
        description: `${formData.name} has been added to the inventory.`,
      });

      setOpen(false);
      setFormData({
        name: "",
        category: "",
        sku: "",
        price: "",
        cost: "",
        stock: "",
        minStock: "",
      });
    } catch (error: any) {
      toast({
        title: "Error adding product",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Wireless Earbuds"
                required
              />
            </div>
            <div className="space-y-2 col-span-1">
              <Label htmlFor="sku">SKU *</Label>
              <Input
                id="sku"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                placeholder="PROD-001"
                required
              />
            </div>
            <div className="space-y-2 col-span-1">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Electronics"
              />
            </div>
            <div className="space-y-2 col-span-1">
              <Label htmlFor="price">Price (₹)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2 col-span-1">
              <Label htmlFor="cost">Cost (₹)</Label>
              <Input
                id="cost"
                name="cost"
                type="number"
                step="0.01"
                min="0"
                value={formData.cost}
                onChange={handleChange}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2 col-span-1">
              <Label htmlFor="stock">Initial Stock</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={handleChange}
                placeholder="0"
              />
            </div>
            <div className="space-y-2 col-span-1">
              <Label htmlFor="minStock">Min Stock Alert</Label>
              <Input
                id="minStock"
                name="minStock"
                type="number"
                min="0"
                value={formData.minStock}
                onChange={handleChange}
                placeholder="10"
              />
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Save Product"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
