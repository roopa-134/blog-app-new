
import { useEffect, useState } from "react";
import BlogModal from "../components/BlogModal";
import { Button } from "@/components/ui/button";
import BlogCard from "../components/BlogCard";
import axios from "axios";

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [myBlogs, setMyBlogs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("browse");

  const [showSignUp, setShowSignUp] = useState(false);
  const [signUpData, setSignUpData] = useState({ username: "", email: "", password: "" });

  const [showSignIn, setShowSignIn] = useState(false);
  const [signInData, setSignInData] = useState({ username: "", password: "" });

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Pagination states
  const [browsePage, setBrowsePage] = useState(1);
  const [browseTotalPages, setBrowseTotalPages] = useState(1);

  const [myPage, setMyPage] = useState(1);
  const [myTotalPages, setMyTotalPages] = useState(1);

  // ✅ Fetch all blogs for Browse tab
  const fetchAllBlogs = async (page = 1) => {
    try {
      const { data } = await axios.get(`http://localhost:8000/blogs?page=${page}&page_size=3`);
      setBlogs(data.items);
      setBrowseTotalPages(data.total_pages);
      setBrowsePage(data.current_page);
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  // ✅ Fetch user's blogs for My Blogs tab
  const fetchMyBlogs = async (page = 1) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      const { data } = await axios.get(`http://localhost:8000/blogs/me?page=${page}&page_size=3`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyBlogs(data.items);
      setMyTotalPages(data.total_pages);
      setMyPage(data.current_page);
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  // ✅ Delete blog
  const handleDeleteBlog = async (blogId) => {
    try {
      const token = localStorage.getItem("access_token");
      await axios.delete(`http://localhost:8000/blogs/${blogId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchMyBlogs(myPage); // reload same page after delete
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchAllBlogs();
    const token = localStorage.getItem("access_token");
    if (token) setIsLoggedIn(true);
  }, []);

  // ✅ Create Blog handler
  const handleCreateBlog = async (blog) => {
    try {
      const token = localStorage.getItem("access_token");
      await axios.post("http://localhost:8000/blogs/", blog, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchMyBlogs(1); // refresh my blogs list
      setIsModalOpen(false);
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  // ✅ Sign Up Handlers
  const handleSignUpChange = (e) => setSignUpData({ ...signUpData, [e.target.name]: e.target.value });

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/auth/signup", signUpData);
      setShowSignUp(false);
      alert("Sign up successful! Please sign in.");
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  // ✅ Sign In Handlers
  const handleSignInChange = (e) => setSignInData({ ...signInData, [e.target.name]: e.target.value });

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData();
      form.append("username", signInData.username);
      form.append("password", signInData.password);

      const { data } = await axios.post("http://localhost:8000/auth/token", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      localStorage.setItem("access_token", data.access_token);
      setIsLoggedIn(true);
      setShowSignIn(false);
      fetchMyBlogs();
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  // Pagination Button Component
  const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    return (
      <div className="flex justify-center gap-2 mt-6">
        <Button variant="outline" disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>Prev</Button>
        {[...Array(totalPages)].map((_, i) => (
          <Button
            key={i}
            variant={currentPage === i + 1 ? "default" : "outline"}
            onClick={() => onPageChange(i + 1)}
          >
            {i + 1}
          </Button>
        ))}
        <Button variant="outline" disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)}>Next</Button>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Header */}
      <header className="flex items-center justify-between mb-4 border-b pb-4">
        <div></div>
        <h1 className="text-3xl font-bold text-center flex-1">B L O G S P H E R E</h1>
        <div className="flex gap-2">
          {isLoggedIn ? (
            <Button variant="outline" onClick={() => { localStorage.removeItem("access_token"); setIsLoggedIn(false); setMyBlogs([]); }}>Logout</Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => setShowSignIn(true)}>Sign In</Button>
              <Button variant="default" onClick={() => setShowSignUp(true)}>Sign Up</Button>
            </>
          )}
        </div>
      </header>

      {/* Navigation */}
      <nav className="flex justify-center gap-6 border-b pb-2 mb-6">
        <button
          className={`pb-2 ${activeTab === "browse" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500 hover:text-blue-500"}`}
          onClick={() => { setActiveTab("browse"); fetchAllBlogs(browsePage); }}
        >
          Browse
        </button>
        <button
          className={`pb-2 ${activeTab === "myBlogs" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500 hover:text-blue-500"}`}
          onClick={() => {
            setActiveTab("myBlogs");
            if (isLoggedIn) fetchMyBlogs(myPage);
          }}
        >
          My Blogs
        </button>
      </nav>

      {/* Browse Tab */}
      {activeTab === "browse" && (
        <>
          <p className="text-sm text-gray-400 text-center mb-4">Showing {blogs.length} blogs</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogs.map((blog) => <BlogCard key={blog.id} blog={blog} />)}
          </div>
          <Pagination currentPage={browsePage} totalPages={browseTotalPages} onPageChange={fetchAllBlogs} />
        </>
      )}

      {/* My Blogs Tab */}
      {activeTab === "myBlogs" && (
        isLoggedIn ? (
          <>
            <div className="text-center mb-6">
              <Button variant="ghost" onClick={() => setIsModalOpen(true)}>+ Create a blog</Button>
            </div>

            {myBlogs.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {myBlogs.map((blog) => (
                    <div key={blog.id} className="relative">
                      <BlogCard blog={blog} />
                      <button
                        onClick={() => handleDeleteBlog(blog.id)}
                        className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs rounded"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
                <Pagination currentPage={myPage} totalPages={myTotalPages} onPageChange={fetchMyBlogs} />
              </>
            ) : (
              <p className="text-center text-gray-500 mt-10">You have no blogs yet.</p>
            )}
          </>
        ) : (
          <p className="text-center text-gray-500 mt-10">Please sign in to view your blogs.</p>
        )
      )}

      {/* Blog Modal */}
      <BlogModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleCreateBlog}
      />

      {/* Sign Up Modal */}
      {showSignUp && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96 relative">
            <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
            <form onSubmit={handleSignUpSubmit} className="space-y-4">
              <input type="text" name="username" placeholder="Username" value={signUpData.username} onChange={handleSignUpChange} className="w-full px-4 py-2 border rounded-lg" required />
              <input type="email" name="email" placeholder="Email" value={signUpData.email} onChange={handleSignUpChange} className="w-full px-4 py-2 border rounded-lg" required />
              <input type="password" name="password" placeholder="Password" value={signUpData.password} onChange={handleSignUpChange} className="w-full px-4 py-2 border rounded-lg" required />
              <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg">Sign Up</button>
            </form>
            <p className="text-center text-sm mt-4">
              Already have an account?{" "}
              <button className="text-blue-500 hover:underline" onClick={() => { setShowSignUp(false); setShowSignIn(true); }}>Sign In</button>
            </p>
            <button onClick={() => setShowSignUp(false)} className="absolute top-3 right-3">✕</button>
          </div>
        </div>
      )}

      {/* Sign In Modal */}
      {showSignIn && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96 relative">
            <h2 className="text-2xl font-bold mb-4 text-center">Sign In</h2>
            <form onSubmit={handleSignInSubmit} className="space-y-4">
              <input type="text" name="username" placeholder="Username" value={signInData.username} onChange={handleSignInChange} className="w-full px-4 py-2 border rounded-lg" required />
              <input type="password" name="password" placeholder="Password" value={signInData.password} onChange={handleSignInChange} className="w-full px-4 py-2 border rounded-lg" required />
              <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg">Sign In</button>
            </form>
            <p className="text-center text-sm mt-4">
              Don't have an account?{" "}
              <button className="text-blue-500 hover:underline" onClick={() => { setShowSignIn(false); setShowSignUp(true); }}>Sign Up</button>
            </p>
            <button onClick={() => setShowSignIn(false)} className="absolute top-3 right-3">✕</button>
          </div>
        </div>
      )}
    </div>
  );
}
