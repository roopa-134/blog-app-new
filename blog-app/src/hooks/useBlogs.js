import { useState, useEffect } from "react";
import axios from "axios";

export default function useBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [myBlogs, setMyBlogs] = useState([]);

  const [browsePage, setBrowsePage] = useState(1);
  const [browseTotalPages, setBrowseTotalPages] = useState(1);

  const [myPage, setMyPage] = useState(1);
  const [myTotalPages, setMyTotalPages] = useState(1);

  const token = localStorage.getItem("access_token");

  const fetchAllBlogs = async (page = 1) => {
    const { data } = await axios.get(`http://localhost:8000/blogs?page=${page}&page_size=3`);
    setBlogs(data.items);
    setBrowseTotalPages(data.total_pages);
    setBrowsePage(data.current_page);
  };

  const fetchMyBlogs = async (page = 1) => {
    if (!token) return;
    const { data } = await axios.get(`http://localhost:8000/blogs/me?page=${page}&page_size=3`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setMyBlogs(data.items);
    setMyTotalPages(data.total_pages);
    setMyPage(data.current_page);
  };

  const deleteBlog = async (id) => {
    await axios.delete(`http://localhost:8000/blogs/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchMyBlogs(myPage);
  };

  useEffect(() => {
    fetchAllBlogs();
  }, []);

  return {
    blogs, myBlogs,
    browsePage, browseTotalPages, fetchAllBlogs,
    myPage, myTotalPages, fetchMyBlogs,
    deleteBlog
  };
}
