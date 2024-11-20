import { redirect } from "next/navigation";
import { LoginForm } from "@/components/login-form";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Telefon Rehberi</h1>
          <p className="text-gray-600 dark:text-gray-300">Kişilerinizi güvenle yönetin</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}