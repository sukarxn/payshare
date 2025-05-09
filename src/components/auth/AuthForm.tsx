
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { AuthFormMode } from "@/types";

const AuthForm = () => {
  const [mode, setMode] = useState<AuthFormMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  
  const { signIn, signUp, loading } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === "signin") {
      await signIn(email, password);
    } else {
      await signUp(email, password, username);
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-payment-primary">
          {mode === "signin" ? "Welcome Back" : "Create Account"}
        </CardTitle>
        <CardDescription className="text-center">
          {mode === "signin" 
            ? "Sign in to your account to continue" 
            : "Sign up to start sending and receiving payments"}
        </CardDescription>
      </CardHeader>
      <Tabs value={mode} onValueChange={(value) => setMode(value as AuthFormMode)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signin">Sign In</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
      </Tabs>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {mode === "signup" && (
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-payment-primary hover:bg-payment-primary/90"
            disabled={loading}
          >
            {loading ? "Processing..." : mode === "signin" ? "Sign In" : "Sign Up"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center text-sm">
        {mode === "signin" ? (
          <p>Don't have an account? <Button variant="link" className="p-0" onClick={() => setMode("signup")}>Sign up</Button></p>
        ) : (
          <p>Already have an account? <Button variant="link" className="p-0" onClick={() => setMode("signin")}>Sign in</Button></p>
        )}
      </CardFooter>
    </Card>
  );
};

export default AuthForm;
