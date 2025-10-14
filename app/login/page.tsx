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
    <div className="min-h-screen flex items-center justify-center bg-paper p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="w-24 h-24 rounded-full bg-accent2 flex items-center justify-center text-5xl logo-spin">
              😺
            </div>
          </div>
          <CardTitle className="text-3xl">Kitten Help Kalender</CardTitle>
          <CardDescription>
            Linnuke kirja. Nurruke koju 😺
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Tiimi parool</Label>
              <Input
                id="password"
                type="password"
                placeholder="Sisesta parool"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoFocus
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Sisenen..." : "Logi sisse"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
