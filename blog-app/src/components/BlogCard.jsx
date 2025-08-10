import { Link } from "react-router-dom";

export default function BlogCard({ blog }) {
  console.log(blog);
  return (
    <Link
      to={`/post/${blog.id}`}
      className="relative flex flex-col text-gray-700 bg-white shadow-md bg-clip-border rounded-xl w-96 hover:scale-105 transition-transform"
    >
   
      <div className="relative mx-4 mt-4 overflow-hidden text-gray-700 bg-white bg-clip-border rounded-xl h-96">
        <img
          src={blog.image || "https://via.placeholder.com/300"} 
          alt={blog.title}
          className="object-cover w-full h-full"
        />
      </div>


      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="block font-sans text-base font-medium leading-relaxed text-blue-gray-900">
            {blog.title}
          </h2>
          <p className="block font-sans text-sm text-gray-600">
            {new Date(blog.created_at).toLocaleString()}
          </p>
        </div>
        
      </div>


      <div className="p-6 pt-0">
        <button
          className="align-middle select-none font-sans font-bold text-center uppercase transition-all text-xs py-3 px-6 rounded-lg block w-full bg-blue-gray-900/10 text-blue-gray-900 hover:scale-105 focus:scale-105 active:scale-100"
          type="button"
        >
          Read More
        </button>
      </div>
    </Link>
  );
}
