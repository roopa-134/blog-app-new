import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch blog from backend
  const fetchBlog = async () => {
    try {
      const { data } = await axios.get(`http://localhost:8000/blogs/${id}`);
      setBlog(data);
    } catch (err) {
      console.error(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, [id]);

  if (loading) {
    return <p className="text-center mt-10 text-gray-600">Loading blog...</p>;
  }

  if (!blog) {
    return (
      <p className="text-center mt-10 text-gray-600">
        Blog not found
      </p>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Back Button */}
      <Link
        to="/"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-6"
      >
        ← Back to posts
      </Link>

      {/* Card */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Cover Image */}
        {blog.image && (
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-80 object-cover"
          />
        )}

        {/* Card Body */}
        <div className="p-6">
          {/* Title */}
          <h1 className="text-3xl font-bold mb-2">{blog.title}</h1>

          {/* Description */}
          {blog.description && (
            <p className="text-lg text-gray-600 italic mb-4">
              {blog.description}
            </p>
          )}

          {/* Meta Info */}
          <p className="text-sm text-gray-500 mb-6">
            {new Date(blog.created_at).toLocaleString()}
          </p>

          {/* Content */}
          <div className="prose max-w-none">
            <p className="text-gray-800 leading-relaxed whitespace-pre-line">
              {blog.content}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
