interface User {
  email: string;
  password: string;
  name: string;
}

// Test için örnek kullanıcılar
export const DEMO_USERS: User[] = [
  {
    email: "demo@example.com",
    password: "demo123",
    name: "Demo Kullanıcı"
  },
  {
    email: "test@example.com",
    password: "test123",
    name: "Test Kullanıcı"
  }
];

export function validateCredentials(email: string, password: string): boolean {
  return DEMO_USERS.some(user => 
    user.email === email && user.password === password
  );
}