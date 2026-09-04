import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAllProducts } from "~/apis/product";

export const fetchNewProduct = createAsyncThunk(
  "product/getNew",
  async (d, { rejectWithValue }) => {
    try {
      const response = await getAllProducts({
        params: { sort: "-createdAt", limit: 8 },
      });
      if (response?.success && Array.isArray(response.data)) {
        return response.data;
      }
      return rejectWithValue(response?.message || "Không thể tải sản phẩm mới");
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);