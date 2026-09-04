import type { Category, Product } from "@/types/product";

type ApiResponse<T> = {
  success: boolean;
  data: T;
  error?: string;
};

export async function getProducts(params?: {
  category?: string;
  search?: string;
}) {
  const searchParams = new URLSearchParams();
  if (params?.category) {
    searchParams.set("category", params.category);
  }
  if (params?.search) {
    searchParams.set("search", params.search);
  }

  const query = searchParams.toString();

  const response = await fetch(`/api/products${query ? `?${query}` : ""}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  const result: ApiResponse<Product[]> = await response.json();

  return result.data;
}

export async function getCategories() {
  const response = await fetch(`/api/categories`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }

  const result: ApiResponse<Category[]> = await response.json();

  return result.data;
}

export async function getProduct(slug: string) {
  const response = await fetch(`/api/products/${slug}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }

    throw new Error("Failed to fetch product");
  }

  const result: ApiResponse<Product> = await response.json();

  return result.data;
}
