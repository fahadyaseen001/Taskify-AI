'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { UserProvider } from '@/components/providers/user-provider';

// Dynamically import Lottie with SSR disabled
const Lottie = dynamic(() => import('lottie-react'), {
  ssr: false,
  loading: () => <div></div>
});

// Import animation data
import Todo from "./Todo.json";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/auth');
    }, 500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <UserProvider>
        <Lottie 
          animationData={Todo} 
          loop={true} 
          style={{width:'30%', height:'40%'}} 
        />
      </UserProvider>
    </div>
  );
}