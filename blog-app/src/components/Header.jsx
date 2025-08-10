import { Button } from "@/components/ui/button";

export default function Header({ isLoggedIn, onLogout, onSignIn, onSignUp }) {
  return (
    <header className="relative flex items-center justify-between mb-4 border-b pb-4">
      {/* Left placeholder */}
      <div></div>

      {/* Center title */}
      <h1 className="absolute left-1/2 -translate-x-1/2 text-3xl font-bold">
        B L O G S P H E R E
      </h1>

      {/* Right buttons */}
      <div className="flex gap-2">
        {isLoggedIn ? (
          <Button variant="outline" onClick={onLogout}>Logout</Button>
        ) : (
          <>
            <Button variant="outline" onClick={onSignIn}>Sign In</Button>
            <Button variant="default" onClick={onSignUp}>Sign Up</Button>
          </>
        )}
      </div>
    </header>
  );
}
