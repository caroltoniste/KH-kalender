"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      toast.success("Oled välja logitud");
      router.push("/login");
      router.refresh();
    } catch (error) {
      toast.error("Viga väljalogimisel");
      console.error("Logout error:", error);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLogout}
      className="gap-2"
    >
      <LogOut className="h-4 w-4" />
      Logi välja
    </Button>
  );
}
