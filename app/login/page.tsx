"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simple password check
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Vale parool");
      }

      toast.success("Tere tulemast! 😺");
      router.push("/calendar");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Vale parool");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center pt-8 pb-6">
          <div className="mb-6 flex justify-center">
            <img 
              src="/roosakitten.png" 
              alt="Kitten Help Logo" 
              className="w-24 h-24 object-contain logo-spin"
            />
          </div>
          <CardTitle className="text-2xl mb-2 font-bold">
            Kitten Help<br/>turunduskalender
          </CardTitle>
          <CardDescription className="text-base mt-4">
            Sisesta turundustiimi parool:
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-8">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Input
                id="password"
                type="password"
                placeholder="Parool"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
                className="h-12 text-center"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-12 text-white font-medium" 
              style={{ backgroundColor: '#ffb3d1' }}
              disabled={loading}
            >
              {loading ? "Sisenen..." : "Logi sisse"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
