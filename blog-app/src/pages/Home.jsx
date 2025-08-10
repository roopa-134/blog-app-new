import { useEffect, useState } from "react";
import Header from "@/components/Header";
import BlogModal from "../components/BlogModal";
import BlogCard from "../components/BlogCard";
import Pagination from "../components/Pagination";
import SignInModal from "../components/SignInModal";
import SignUpModal from "../components/SignUpModal";
import { Button } from "@/components/ui/button";
import { fetchAllBlogs, fetchMyBlogs, createBlog, deleteBlog } from "../services/blogService";
import { signUp, signIn } from "../services/authService";

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

  const [browsePage, setBrowsePage] = useState(1);
  const [browseTotalPages, setBrowseTotalPages] = useState(1);

  const [myPage, setMyPage] = useState(1);
  const [myTotalPages, setMyTotalPages] = useState(1);

  const loadAllBlogs = async (page = 1) => {
    const { data } = await fetchAllBlogs(page);
    setBlogs(data.items);
    setBrowseTotalPages(data.total_pages);
    setBrowsePage(data.current_page);
  };

  const loadMyBlogs = async (page = 1) => {
    const { data } = await fetchMyBlogs(page);
    setMyBlogs(data.items);
    setMyTotalPages(data.total_pages);
    setMyPage(data.current_page);
  };

  const handleCreateBlog = async (blog) => {
    await createBlog(blog);
    loadMyBlogs(1);
    setIsModalOpen(false);
  };

  const handleDeleteBlog = async (id) => {
    await deleteBlog(id);
    loadMyBlogs(myPage);
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    await signUp(signUpData);
    setShowSignUp(false);
    alert("Sign up successful! Please sign in.");
  };

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    const { data } = await signIn(signInData.username, signInData.password);
    localStorage.setItem("access_token", data.access_token);
    setIsLoggedIn(true);
    setShowSignIn(false);
    loadMyBlogs();
  };

  useEffect(() => {
    loadAllBlogs();
    if (localStorage.getItem("access_token")) setIsLoggedIn(true);
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-4">
    
       <Header
        isLoggedIn={isLoggedIn}
        onLogout={() => { localStorage.removeItem("access_token"); setIsLoggedIn(false); }}
        onSignIn={() => setShowSignIn(true)}
        onSignUp={() => setShowSignUp(true)}
      />

     <nav className="flex justify-center gap-6 border-b pb-2 mb-6">
          <button
            className={`pb-2 ${
              activeTab === "browse"
                ? "border-b-2 border-black text-black"
                : "text-gray-500 hover:text-black"
            }`}
            onClick={() => {
              setActiveTab("browse");
              loadAllBlogs(browsePage);
            }}
          >
            Browse
          </button>

          <button
            className={`pb-2 ${
              activeTab === "myBlogs"
                ? "border-b-2 border-black text-black"
                : "text-gray-500 hover:text-black"
            }`}
            onClick={() => {
              setActiveTab("myBlogs");
              if (isLoggedIn) loadMyBlogs(myPage);
            }}
          >
            My Blogs
          </button>
        </nav>
    
      {activeTab === "browse" && (
        <>
          <p className="text-sm text-gray-400 text-center mb-4">Showing {blogs.length} blogs</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{blogs.map((blog) => <BlogCard key={blog.id} blog={blog} />)}</div>
          <Pagination currentPage={browsePage} totalPages={browseTotalPages} onPageChange={loadAllBlogs} />
        </>
      )}

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
  className="-ml-px rounded-r-sm border border-red-300 px-3 py-2 text-red-600 transition-colors hover:bg-red-50 hover:text-red-800 focus:z-10 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-white focus:outline-none disabled:pointer-events-auto disabled:opacity-50"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className="size-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
    />
  </svg>
</button>






                    </div>
                  ))}
                </div>
                <Pagination currentPage={myPage} totalPages={myTotalPages} onPageChange={loadMyBlogs} />
              </>
            ) : <p className="text-center text-gray-500 mt-10">You have no blogs yet.</p>}
          </>
        ) : <p className="text-center text-gray-500 mt-10">Please sign in to view your blogs.</p>
      )}

      <BlogModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={handleCreateBlog} />

      <SignInModal isOpen={showSignIn} onClose={() => setShowSignIn(false)} formData={signInData} onChange={(e) => setSignInData({ ...signInData, [e.target.name]: e.target.value })} onSubmit={handleSignInSubmit} switchToSignUp={() => { setShowSignIn(false); setShowSignUp(true); }} />

      <SignUpModal isOpen={showSignUp} onClose={() => setShowSignUp(false)} formData={signUpData} onChange={(e) => setSignUpData({ ...signUpData, [e.target.name]: e.target.value })} onSubmit={handleSignUpSubmit} switchToSignIn={() => { setShowSignUp(false); setShowSignIn(true); }} />
    </div>
  );
}
