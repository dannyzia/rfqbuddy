// Catalogue hooks — categories, items, cart, checkout, orders

import { useApiQuery, useApiMutation } from '../lib/use-api';
import { catalogueApi } from '../lib/api/catalogue.api';
import { toast } from 'sonner';
import type {
  CatalogueCategory, CatalogueItem, CartItem,
  CatalogueOrder, CatalogueOrderItem,
} from '../lib/api-types';

// ── Categories ────────────────────────────────────────────────

export function useCatalogueCategories() {
  return useApiQuery<CatalogueCategory[]>(() => catalogueApi.getCategories(), []);
}

// ── Items ─────────────────────────────────────────────────────

export function useCatalogueItems(params?: {
  category_id?: string; vendor_org_id?: string; search?: string; page?: number;
}) {
  return useApiQuery<CatalogueItem[]>(
    () => catalogueApi.listItems(params),
    [params?.category_id, params?.vendor_org_id, params?.search, params?.page],
  );
}

export function useCreateCatalogueItem() {
  return useApiMutation<CatalogueItem, Partial<CatalogueItem>>(
    async (data) => {
      const result = await catalogueApi.createItem(data);
      toast.success(`Item "${result.name}" added to catalogue`);
      return result;
    },
  );
}

export function useUpdateCatalogueItem() {
  return useApiMutation<CatalogueItem, { id: string; data: Partial<CatalogueItem> }>(
    async ({ id, data }) => {
      const result = await catalogueApi.updateItem(id, data);
      toast.success('Catalogue item updated');
      return result;
    },
  );
}

export function useDeleteCatalogueItem() {
  return useApiMutation<{ success: true }, string>(
    async (id) => {
      const result = await catalogueApi.deleteItem(id);
      toast.success('Catalogue item removed');
      return result;
    },
  );
}

// ── Cart ──────────────────────────────────────────────────────

export function useCart() {
  return useApiQuery<CartItem[]>(() => catalogueApi.getCart(), []);
}

export function useAddToCart() {
  return useApiMutation<CartItem, { item_id: string; quantity?: number }>(
    async ({ item_id, quantity }) => {
      const result = await catalogueApi.addToCart(item_id, quantity) as CartItem;
      toast.success('Added to cart');
      return result;
    },
  );
}

export function useUpdateCartItem() {
  return useApiMutation<CartItem | { removed: true }, { item_id: string; quantity: number }>(
    async ({ item_id, quantity }) => {
      const result = await catalogueApi.updateCartItem(item_id, quantity);
      if ('removed' in result) {
        toast.success('Item removed from cart');
      } else {
        toast.success('Cart updated');
      }
      return result;
    },
  );
}

export function useClearCart() {
  return useApiMutation<{ success: true }, void>(
    async () => {
      const result = await catalogueApi.clearCart();
      toast.success('Cart cleared');
      return result;
    },
  );
}

// ── Checkout ──────────────────────────────────────────────────

export function useCheckout() {
  return useApiMutation<CatalogueOrder, { delivery_address?: string; notes?: string } | void>(
    async (data) => {
      const result = await catalogueApi.checkout(data ?? undefined);
      toast.success(`Order ${result.order_number} submitted successfully`);
      return result;
    },
  );
}

// ── Orders ────────────────────────────────────────────────────

export function useCatalogueOrders() {
  return useApiQuery<CatalogueOrder[]>(() => catalogueApi.listOrders(), []);
}

export function useCatalogueOrderDetail(id: string | undefined) {
  return useApiQuery<{ order: CatalogueOrder; items: CatalogueOrderItem[] } | null>(
    () => id ? catalogueApi.getOrderById(id) : Promise.resolve(null),
    [id],
  );
}
