import React from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useGetUsers } from '@/hooks/use-get-users';
import Loader from '../pages/loader';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AssigneeProps {
  value: {
    userId: string;
    name: string;
    email: string;
  };
  onValueChange: (assignee: { userId: string; name: string; email: string }) => void;
  disabled: boolean;
}

const Assignee: React.FC<AssigneeProps> = ({ value, onValueChange, disabled }) => {
  const { data: users, isLoading, isError } = useGetUsers();

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load users. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="assignee" className="text-sm font-medium">
        Assignee
      </Label>
      <Select
        value={value.userId}
        onValueChange={(selectedId) => {
          const selectedUser = users?.find((user: { _id: string; name: string; email: string }) => user._id === selectedId);
          if (selectedUser) {
            onValueChange({
              userId: selectedUser._id,
              name: selectedUser.name,
              email: selectedUser.email
            });
          }
        }}
        disabled={disabled || isLoading}
      >
        <SelectTrigger className="focus:outline-none focus:border-initial">
          <SelectValue placeholder="Select assignee" />
        </SelectTrigger>
        <SelectContent position="item-aligned">
          {isLoading ? (
            <div className="p-2">
              <Loader />
            </div>
          ) : (
            users?.map((user: { _id: string; name: string; email: string }) => (
              <SelectItem key={user._id} value={user._id}>
                {user.name} 
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default Assignee;