import React, { useState, useEffect } from 'react';
import { DataTable } from './data-table';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { columns, ToDoItem } from './dashboard-components/columns';

interface AICommandResponse {
  success: boolean;
  tasks?: ToDoItem[];
  filters?: AIFilters;
  message?: string;
}

interface AIFilters {
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  assigneeName?: string;
  dueDate?: string;
  dueTime?: string;
  taskId?: string;
}

interface AIFilterState {
  isActive: boolean;
  filters: AIFilters;
}

interface EnhancedDataTableProps {
  initialData: ToDoItem[];
  aiCommandResult: AICommandResponse | null;
  onResetFilters: () => void;
}

const EnhancedDataTable: React.FC<EnhancedDataTableProps> = ({ 
  initialData,
  aiCommandResult,
  onResetFilters
}) => {
  const [filteredData, setFilteredData] = useState<ToDoItem[]>(initialData);
  const [aiFilter, setAIFilter] = useState<AIFilterState>({
    isActive: false,
    filters: {}
  });

  // Update filtered data when AI command result changes
  useEffect(() => {
    if (aiCommandResult?.tasks) {
      setFilteredData(aiCommandResult.tasks);
      setAIFilter({
        isActive: true,
        filters: aiCommandResult.filters || {}
      });
    } else {
      setFilteredData(initialData);
    }
  }, [aiCommandResult, initialData]);

  // Reset handler
  const handleReset = () => {
    setFilteredData(initialData);
    setAIFilter({
      isActive: false,
      filters: {}
    });
    onResetFilters();
  };

  return (
    <div className="w-full">
      {aiFilter.isActive && filteredData !== initialData && (
        <div className="mb-4 flex items-center justify-between bg-muted p-2 rounded-lg">
          <span className="text-sm text-muted-foreground">
            {`Showing ${filteredData.length} filtered results`}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-8 px-2 lg:px-3"
          >
            Reset AI Filter
            <X className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
      <DataTable 
        data={filteredData} 
        columns={columns}
      />
    </div>
  );
};

export default EnhancedDataTable;