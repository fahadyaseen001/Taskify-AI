'use client'

import * as React from "react";
import { ToDoItem } from "@/components/dashboard/dashboard-components/columns";
import { MdAddCircleOutline } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { useFetchToDoItems } from "@/hooks/use-read-task";
import { UserNav } from "@/components/dashboard/dashboard-components/user-nav";
import { useRouter } from 'next/navigation';
import Loader from "@/components/pages/loader";
import AICommandInput from '@/components/ui/ai-command-input';
import { DashboardSkeleton } from "@/components/dashboard/dashboard-utils/loading-skeletons/dashboard-skeleton";
import EnhancedDataTable from "@/components/dashboard/enhanced-data-table";
import AuthProvider from "@/components/providers/auth-provider";
import { TextLoop } from "@/components/ui/text-loop";

interface AICommandResponse {
  success: boolean;
  tasks?: ToDoItem[];
  filters?: Record<string, string>;
  message?: string;
}

export default function TodoPage() {
  const { data: tasks, isLoading, isFetching  } = useFetchToDoItems();
  const router = useRouter();
  const [isNavigating, setIsNavigating] = React.useState(false);
  const [cachedTaskCount, setCachedTaskCount] = React.useState(0);
  const [aiCommandResult, setAICommandResult] = React.useState<AICommandResponse | null>(null);


    // Show skeleton during initial load OR background refetch
    React.useEffect(() => {
        if (tasks) {
            setCachedTaskCount(tasks.length); 
        }
    }, [tasks]);

    // eslint-disable-next-line prefer-const
    let skeletonTaskCount = cachedTaskCount || 0; 

    if (isLoading || isFetching) {
        return <DashboardSkeleton taskCount={skeletonTaskCount} />; 
    }

    const handleAICommandProcessed = (result: AICommandResponse) => {
      if (result?.success && result?.tasks) {
        setAICommandResult(result);
      }
    };
  
    const handleResetFilters = () => {
      setAICommandResult(null);
    };

  const handleNavigation = () => {
    setIsNavigating(true);
    router.push('/task');
  };

  return (
    <AuthProvider>
    <div className="flex h-full flex-1 flex-col space-y-8 p-4 md:p-8">
      <UserNav isLoading={false}/>

        
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">Welcome back!</h2>
          <div className="text-sm md:text-base text-muted-foreground">
            Here&rsquo;s a list of your tasks for this{' '}
            <TextLoop 
              className="overflow-y-clip"
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 40,
                mass: 1,
              }}
              variants={{
                initial: {
                  y: 20,
                  rotateX: 90,
                  opacity: 0,
                  filter: 'blur(4px)',
                },
                animate: {
                  y: 0,
                  rotateX: 0,
                  opacity: 1,
                  filter: 'blur(0px)',
                },
                exit: {
                  y: -20,
                  rotateX: -90,
                  opacity: 0,
                  filter: 'blur(4px)',
                },
              }}
            >
              <span>day 👾</span>
              <span>week 👽</span>
              <span>month 🤖</span>
            </TextLoop>
          </div>
        </div>
        <Button
          variant="default"
          size="default"
          className="w-full md:w-auto flex items-center justify-center"
          onClick={handleNavigation}
          disabled={isNavigating}
        >
          {isNavigating ? <Loader /> : <MdAddCircleOutline className="mr-2" />}
          {isNavigating ? 'Add New Task...' : 'Add New Task'}
        </Button>
      </div>
      <EnhancedDataTable 
        initialData={tasks || []} 
        aiCommandResult={aiCommandResult}
        onResetFilters={handleResetFilters}
      />
      <AICommandInput onCommandProcessed={handleAICommandProcessed} />

    </div>
    </AuthProvider>

  );
}