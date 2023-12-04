// blogSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from './api'; // Import the centralized Axios instance

// Async thunk for fetching blog posts
export const fetchBlogPosts = createAsyncThunk('blog/fetchBlogPosts', async () => {
  try {
    const response = await api.get('/blog');
    return response.data;
  } catch (error) {
    // Error handling
    throw error;
  }
});

// Async thunk for updating a blog post
export const updateBlogPost = createAsyncThunk('blog/updateBlogPost', async (postData) => {
  try {
    const response = await api.put(`/blog/${postData.id}`, postData);
    return response.data;
  } catch (error) {
    // Error handling
    throw error;
  }
});

// Async thunk for deleting a blog post
export const deleteBlogPost = createAsyncThunk('blog/deleteBlogPost', async (postId) => {
  try {
    await api.delete(`/blog/${postId}`);
    return postId;
  } catch (error) {
    // Error handling
    throw error;
  }
});

const blogSlice = createSlice({
  name: 'blog',
  initialState: {
    posts: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogPosts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBlogPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.posts = action.payload;
      })
      .addCase(fetchBlogPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateBlogPost.fulfilled, (state, action) => {
        const updatedPost = action.payload;
        state.posts = state.posts.map((post) =>
          post.id === updatedPost.id ? updatedPost : post
        );
      })
      .addCase(deleteBlogPost.fulfilled, (state, action) => {
        const postId = action.payload;
        state.posts = state.posts.filter((post) => post.id !== postId);
      });
  },
});

export default blogSlice.reducer;
