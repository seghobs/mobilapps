"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Lock, Mail, Info } from "lucide-react";
import { validateCredentials } from "@/lib/auth";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showCredentials, setShowCredentials] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Hata",
        description: "Lütfen tüm alanları doldurun.",
        variant: "destructive",
      });
      return;
    }

    if (validateCredentials(email, password)) {
      router.push("/contacts");
    } else {
      toast({
        title: "Hata",
        description: "E-posta veya şifre hatalı.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
      <div className="space-y-2">
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="email"
            placeholder="E-posta"
            className="pl-10"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-2">
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="password"
            placeholder="Şifre"
            className="pl-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>
      <Button type="submit" className="w-full">
        Giriş Yap
      </Button>

      <div className="mt-4">
        <Button
          type="button"
          variant="ghost"
          className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 flex items-center gap-2"
          onClick={() => setShowCredentials(!showCredentials)}
        >
          <Info className="w-4 h-4" />
          Test hesap bilgilerini göster
        </Button>
        
        {showCredentials && (
          <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm">
            <p className="font-medium mb-2">Test Hesapları:</p>
            <div className="space-y-2">
              <div>
                <p>E-posta: demo@example.com</p>
                <p>Şifre: demo123</p>
              </div>
              <div>
                <p>E-posta: test@example.com</p>
                <p>Şifre: test123</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}