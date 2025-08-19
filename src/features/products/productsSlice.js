import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";

const API_BASE = "https://dummyjson.com/products";
const LOCAL_STORAGE_KEY = "pim_products_state_v1";

function loadPersistedState() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return undefined;
    return JSON.parse(raw);
  } catch (err) {
    console.log(err);
    return undefined;
  }
}

function persistState(state) {
  try {
    const toPersist = {
      items: state.items,
      categories: state.categories,
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(toPersist));
  } catch (err) {
    console.log(err);
    // ignore
  }
}

// Helpers
function normalizeApiProduct(p) {
  return {
    id: p.id,
    title: p.title,
    price: Number(p.price) || 0,
    stock: Number(p.stock) || 0,
    category: p.category || "uncategorized",
    thumbnail: p.thumbnail || (Array.isArray(p.images) && p.images[0]) || "",
  };
}

const persisted = loadPersistedState();

const initialState = {
  items: persisted?.items ?? [],
  categories: persisted?.categories ?? [],
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  filters: {
    query: "",
    category: "all",
    sortBy: "name", // 'name' | 'price'
    sortDir: "asc", // 'asc' | 'desc'
  },
};

export const fetchProducts = createAsyncThunk("products/fetch", async () => {
  const res = await fetch(`${API_BASE}?limit=100`);
  if (!res.ok) throw new Error("Failed to fetch products");
  const data = await res.json();
  const normalized = (data.products || []).map(normalizeApiProduct);
  return normalized;
});

export const addProduct = createAsyncThunk(
  "products/add",
  async (newProduct) => {
    const payload = {
      title: newProduct.title,
      price: Number(newProduct.price) || 0,
      stock: Number(newProduct.stock) || 0,
      category: newProduct.category || "uncategorized",
      thumbnail: newProduct.thumbnail || "",
    };
    const res = await fetch(`${API_BASE}/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to add product");
    const data = await res.json();
    return normalizeApiProduct({ ...payload, id: data.id ?? Date.now() });
  }
);

export const updateProduct = createAsyncThunk(
  "products/update",
  async ({ id, changes }) => {
    const payload = {
      ...(changes.title != null ? { title: changes.title } : {}),
      ...(changes.price != null ? { price: Number(changes.price) } : {}),
      ...(changes.stock != null ? { stock: Number(changes.stock) } : {}),
      ...(changes.category != null ? { category: changes.category } : {}),
      ...(changes.thumbnail != null ? { thumbnail: changes.thumbnail } : {}),
    };
    const res = await fetch(`${API_BASE}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to update product");
    const data = await res.json();
    return { id, changes: normalizeApiProduct({ ...data, id }) };
  }
);

export const deleteProduct = createAsyncThunk("products/delete", async (id) => {
  const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete product");
  return id;
});

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setQuery(state, action) {
      state.filters.query = action.payload;
    },
    setCategory(state, action) {
      state.filters.category = action.payload;
    },
    setSortBy(state, action) {
      state.filters.sortBy = action.payload;
    },
    setSortDir(state, action) {
      state.filters.sortDir = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
        const categories = Array.from(
          new Set(state.items.map((p) => p.category).filter(Boolean))
        ).sort((a, b) => a.localeCompare(b));
        state.categories = categories;
        persistState(state);
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error?.message || "Unknown error";
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        if (!state.categories.includes(action.payload.category)) {
          state.categories = [
            ...state.categories,
            action.payload.category,
          ].sort((a, b) => a.localeCompare(b));
        }
        persistState(state);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const { id, changes } = action.payload;
        const idx = state.items.findIndex((p) => p.id === id);
        if (idx !== -1) state.items[idx] = { ...state.items[idx], ...changes };
        if (!state.categories.includes(changes.category)) {
          state.categories = [...state.categories, changes.category].sort(
            (a, b) => a.localeCompare(b)
          );
        }
        persistState(state);
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p.id !== action.payload);
        persistState(state);
      });
  },
});

export const { setQuery, setCategory, setSortBy, setSortDir } =
  productsSlice.actions;

export default productsSlice.reducer;

// Selectors
export const selectAllProducts = (state) => state.products.items;
export const selectStatus = (state) => state.products.status;
export const selectError = (state) => state.products.error;
export const selectCategories = (state) => state.products.categories;
export const selectFilters = (state) => state.products.filters;

export const selectVisibleProducts = createSelector(
  [selectAllProducts, selectFilters],
  (items, filters) => {
    const { query, category, sortBy, sortDir } = filters;
    let result = items;
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.category && p.category.toLowerCase().includes(q))
      );
    }
    if (category && category !== "all") {
      result = result.filter((p) => p.category === category);
    }
    const dir = sortDir === "asc" ? 1 : -1;
    if (sortBy === "name") {
      result = [...result].sort((a, b) => a.title.localeCompare(b.title) * dir);
    } else if (sortBy === "price") {
      result = [...result].sort((a, b) => (a.price - b.price) * dir);
    }
    return result;
  }
);
