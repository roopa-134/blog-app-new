import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function BlogModal({ isOpen, onClose, onAdd }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (!isOpen) {
      setTitle("");
      setContent("");
      setImage(null);
    }
  }, [isOpen]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // Base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!title.trim()  || !content.trim()) return;

    const newBlog = {
      id: uuidv4(),
      title,
      content,
      image,
      createdAt: new Date().toISOString(),
    };

    onAdd(newBlog);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md space-y-4">
        <h2 className="text-lg font-semibold mb-4">Create a Blog</h2>

        {/* Title */}
        <Input
          type="text"
          placeholder="Blog title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Description */}
        {/* <Input
          type="text"
          placeholder="Short description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        /> */}

        {/* Content */}
        <Textarea
          placeholder="Shoot your thoughts!"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload Cover Image
          </label>
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
          />
          {image && (
            <img
              src={image}
              alt="Preview"
              className="mt-2 w-full h-40 object-cover rounded"
            />
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="destructive" onClick={onClose}>
            Discard
          </Button>
          <Button variant="secondary" onClick={handleSubmit}>
            Post
          </Button>
        </div>
      </div>
    </div>
  );
}
