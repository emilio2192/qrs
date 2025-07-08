"use client";
import SidebarFilters, { Filters } from "./SidebarFilters";
import { useRouter, useSearchParams } from "next/navigation";

function getFiltersFromSearchParams(searchParams: Record<string, string>): Filters {
  return {
    category: typeof searchParams.category === "string" ? searchParams.category : undefined,
    maxPrice: typeof searchParams.maxPrice === "string" ? Number(searchParams.maxPrice) : undefined,
    size: typeof searchParams.size === "string" ? searchParams.size : undefined,
  };
}

export default function FilterSidebarWrapper() {
  const router = useRouter();
  const sp = useSearchParams();
  const currentFilters = getFiltersFromSearchParams(Object.fromEntries(sp.entries()));
  const handleChange = (newFilters: Filters) => {
    const params = new URLSearchParams();
    if (newFilters.category) params.set("category", newFilters.category);
    if (newFilters.maxPrice) params.set("maxPrice", String(newFilters.maxPrice));
    if (newFilters.size) params.set("size", newFilters.size);
    router.replace(`?${params.toString()}`, { scroll: false });
  };
  return <SidebarFilters filters={currentFilters} onChange={handleChange} />;
} 