import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Bar } from "react-chartjs-2";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { BarChart3, Shield, UserCog, User } from "lucide-react";

const quickLogins = [
  {
    label: "Super User",
    email: "admin@company.com",
    password: "Admin@123",
    role: "super_admin",
    icon: Shield,
    color: "bg-destructive/10 text-destructive border-destructive/20",
  },
  {
    label: "Manager",
    email: "manager@company.com",
    password: "Manager@123",
    role: "manager",
    icon: UserCog,
    color: "bg-warning/10 text-warning border-warning/20",
  },
  {
    label: "Employee",
    email: "employee@company.com",
    password: "Employee@123",
    role: "employee",
    icon: User,
    color: "bg-success/10 text-success border-success/20",
  },
];

const Auth = () => {
  const { toast } = useToast();
  const { user, setUser } = useAuth(); // ✅ FIXED HERE
  const navigate = useNavigate();

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  // 🔐 LOGIN (API)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast({
          title: "Login failed",
          description: data.error,
          variant: "destructive",
        });
        return;
      }

      console.log("LOGIN RESPONSE:", data);

      // ✅ Store role
      localStorage.setItem("role", data.role);

      // ✅ SET USER (FIXED)
      setUser({
        id: data.user?.id || "custom-id",
        email: data.user?.email || loginEmail,
      } as any);

      toast({ title: "Welcome back!" });

      const role = data.role?.toLowerCase();

      if (role === "super_admin") {
        navigate("/dashboard");
      } else if (role === "manager") {
        navigate("/projects");
      } else if (role === "employee") {
        navigate("/employees");
      } else {
        console.log("Unknown role:", role);
      }

    } catch (err) {
      toast({
        title: "Server error",
        description: "Backend not running",
        variant: "destructive",
      });
    }
  };

  // ⚡ QUICK LOGIN (auto-fill)
  const handleQuickLogin = (email: string, password: string) => {
    setLoginEmail(email);
    setLoginPassword(password);
  };

  // 📝 SIGNUP (API)
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: signupName,
          email: signupEmail,
          password: signupPassword,
          role: "employee",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      toast({
        title: "Account created!",
      });

    } catch (err: any) {
      toast({
        title: "Signup failed",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
            <BarChart3 className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">ProjectHub</h1>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle>Welcome</CardTitle>
            <CardDescription>
              Sign in to your dashboard
            </CardDescription>
          </CardHeader>

          <CardContent>

            {/* Quick Login */}
            <div className="mb-6">
              <p className="text-xs text-center mb-3 uppercase text-muted-foreground">
                Quick Login
              </p>

              <div className="grid grid-cols-3 gap-2">
                {quickLogins.map((q) => (
                  <button
                    key={q.email}
                    onClick={() => handleQuickLogin(q.email, q.password)}
                    className={`flex flex-col items-center gap-1 p-3 rounded-lg border hover:scale-105 transition ${q.color}`}
                  >
                    <q.icon className="h-5 w-5" />
                    <span className="text-xs">{q.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <Tabs defaultValue="login">

              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              {/* 🔐 LOGIN */}
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4 mt-4">

                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label>Password</Label>
                    <Input
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Sign In
                  </Button>

                </form>
              </TabsContent>

              {/* 📝 SIGNUP */}
              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4 mt-4">

                  <div>
                    <Label>Full Name</Label>
                    <Input
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label>Password</Label>
                    <Input
                      type="password"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Sign Up
                  </Button>

                </form>
              </TabsContent>

            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;