import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

type Product = {
  _id: string;
  name: string;
  price: number;
  stock: number;
};

type CartProduct = {
  product: Product;
  quantity: number;
  totalPrice: number | string;
};

interface CartState {
  products: CartProduct[];
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  products: [],
  loading: false,
  error: null,
};

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, thunkAPI) => {
    const response = await fetch(
      process.env.NEXT_PUBLIC_BACKEND_URL + "/cart",
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    if (response.ok) {
      return (await response.json()) as CartProduct[];
    } else {
      return thunkAPI.rejectWithValue("Failed to fetch cart");
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (
    { productId, quantity }: { productId: string; quantity: string },
    thunkAPI
  ) => {
    const response = await fetch(
      process.env.NEXT_PUBLIC_BACKEND_URL + "/cart",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({ productId, quantity }),
      }
    );
    if (response.ok) {
      return (await response.json()) as CartProduct[];
    } else {
      return thunkAPI.rejectWithValue("Failed to add to cart");
    }
  }
);

export const updateQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async (
    { productId, quantity }: { productId: string; quantity: number },
    thunkAPI
  ) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/cart`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({ productId, quantity }),
      }
    );
    if (response.ok) {
      return (await response.json()) as CartProduct[];
    } else {
      return thunkAPI.rejectWithValue("Failed to update quantity");
    }
  }
);

export const removeProduct = createAsyncThunk(
  "cart/removeProduct",
  async (productId: string, thunkAPI) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/cart/${productId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    if (response.ok) {
      return (await response.json()) as CartProduct[];
    } else {
      return thunkAPI.rejectWithValue("Failed to remove product");
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCart.fulfilled,
        (state, action: PayloadAction<CartProduct[]>) => {
          state.loading = false;
          state.products = action.payload;
        }
      )
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch cart";
      })
      .addCase(
        addToCart.fulfilled,
        (state, action: PayloadAction<CartProduct[]>) => {
          state.products = action.payload;
        }
      )
      .addCase(
        updateQuantity.fulfilled,
        (state, action: PayloadAction<CartProduct[]>) => {
          state.products = action.payload;
        }
      )
      .addCase(
        removeProduct.fulfilled,
        (state, action: PayloadAction<CartProduct[]>) => {
          state.products = action.payload;
        }
      );
  },
});

export const selectCartProducts = (state: RootState | any) =>
  state.cart.products;

export default cartSlice.reducer;
