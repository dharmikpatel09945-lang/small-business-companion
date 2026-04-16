import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Product, Sale } from "@/data/mockData";

interface AddSaleDialogProps {
  products: Product[];
  onAddSale: (sale: Omit<Sale, "id" | "date">, productId: string) => Promise<void>;
}

export function AddSaleDialog({ products, onAddSale }: AddSaleDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    customer: "",
    productId: "",
    price: "",
    quantity: "1",
    paymentMethod: "Credit Card",
  });

  const handleProductChange = (productId: string) => {
    const selectedProduct = products.find((p) => p.id === productId);
    setFormData((prev) => ({
      ...prev,
      productId,
      price: selectedProduct ? selectedProduct.price.toString() : "",
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.customer || !formData.productId) {
        throw new Error("Customer name and product are required.");
      }

      const selectedProduct = products.find((p) => p.id === formData.productId);
      if (!selectedProduct) {
        throw new Error("Invalid product selected.");
      }

      const qty = parseInt(formData.quantity, 10) || 1;
      const unitPrice = parseFloat(formData.price) || 0;
      
      if (qty > selectedProduct.stock) {
        throw new Error(`Only ${selectedProduct.stock} items left in stock.`);
      }

      const total = qty * unitPrice;

      await onAddSale(
        {
          customer: formData.customer,
          items: [
            {
              product: selectedProduct.name,
              quantity: qty,
              price: unitPrice,
            },
          ],
          total,
          paymentMethod: formData.paymentMethod,
        },
        formData.productId
      );

      toast({
        title: "Sale recorded!",
        description: `Sale to ${formData.customer} has been added.`,
      });

      setOpen(false);
      setFormData({
        customer: "",
        productId: "",
        price: "",
        quantity: "1",
        paymentMethod: "Credit Card",
      });
    } catch (error: any) {
      toast({
        title: "Error adding sale",
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
          New Sale
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Sale</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="customer">Customer Name *</Label>
            <Input
              id="customer"
              name="customer"
              value={formData.customer}
              onChange={handleChange}
              placeholder="e.g. John Doe"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="product">Product *</Label>
            <Select onValueChange={handleProductChange} value={formData.productId}>
              <SelectTrigger>
                <SelectValue placeholder="Select Product" />
              </SelectTrigger>
              <SelectContent>
                {products.filter(p => p.stock > 0).map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name} ({p.stock} in stock)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Unit Price (₹)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="1"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentMethod">Payment Method</Label>
            <Select onValueChange={(v) => handleSelectChange('paymentMethod', v)} value={formData.paymentMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Select Payment Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Credit Card">Credit Card</SelectItem>
                <SelectItem value="Debit Card">Debit Card</SelectItem>
                <SelectItem value="Cash">Cash</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Complete Sale"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
