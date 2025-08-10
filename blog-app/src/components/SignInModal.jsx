export default function SignInModal({ isOpen, onClose, formData, onChange, onSubmit, switchToSignUp }) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-96 relative">
        <h2 className="text-2xl font-bold mb-4 text-center">Sign In</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <input type="text" name="username" placeholder="Username" value={formData.username} onChange={onChange} className="w-full px-4 py-2 border rounded-lg" required />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={onChange} className="w-full px-4 py-2 border rounded-lg" required />
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg">Sign In</button>
        </form>
        <p className="text-center text-sm mt-4">
          Don't have an account?{" "}
          <button className="text-blue-500 hover:underline" onClick={switchToSignUp}>Sign Up</button>
        </p>
        <button onClick={onClose} className="absolute top-3 right-3">✕</button>
      </div>
    </div>
  );
}
