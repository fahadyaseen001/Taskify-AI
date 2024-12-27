'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Lottie from "lottie-react";
import Todo from "./Todo.json";
import { UserProvider } from '@/components/tanstack-query/user-provider';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/auth');
    }, 4700); // 30 seconds

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <UserProvider>
      <Lottie 
        animationData={Todo} 
        loop={true} 
        style={{width:'30%', height:'40%'}} 
      /></UserProvider>
    </div>
  );
}