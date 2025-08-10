import api from "./api";

export const fetchAllBlogs = (page = 1, pageSize = 3) =>
  api.get(`/blogs?page=${page}&page_size=${pageSize}`);

export const fetchMyBlogs = (page = 1, pageSize = 3) =>
  api.get(`/blogs/me?page=${page}&page_size=${pageSize}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
  });

export const createBlog = (blog) =>
  api.post("/blogs/", blog, {
    headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
  });

export const deleteBlog = (blogId) =>
  api.delete(`/blogs/${blogId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
  });
