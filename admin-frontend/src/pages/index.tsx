import { useState } from 'react';
import { Button, FormControl, FormLabel, Input } from '@chakra-ui/react';
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const [adminData, setAdminData] = useState({
    userName: '',
    password: '',
  });
  const [error, setError] = useState("") //intial state is empty. also making it false since it has no value in it
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const success = await login(adminData);
    if (success) {
      router.push(`/adminDashboard/${adminData.userName}`);
    } else {
      setError("Invalid username or password");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-8 rounded-lg shadow-md w-100 h-130">
        {error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        ) : null}
        <form onSubmit={handleSubmit}>
          <h1 className="!text-4xl">Admin Sign in</h1>
          <FormControl isRequired className="mt-4">
            <FormLabel>Username</FormLabel>
            <Input
              type='text'
              placeholder='Username'
              onChange={(e) => setAdminData({ ...adminData, userName: e.target.value })}
            />
          </FormControl>

          <FormControl isRequired className="mt-4">
            <FormLabel>Password</FormLabel>
            <Input
              type='password'
              placeholder='Password'
              onChange={(e) => setAdminData({ ...adminData, password: e.target.value })}
            />
          </FormControl>

          <Button mt={4} colorScheme='teal' type='submit'>
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
}
