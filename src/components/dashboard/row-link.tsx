import Link from 'next/link';
import { ToDoItem } from './columns';

interface RowLinkProps {
  taskId: string;
  taskData: ToDoItem;
  children: React.ReactNode;
}

const RowLink: React.FC<RowLinkProps> = ({ taskId, taskData, children }) => {
  const query = new URLSearchParams(taskData as unknown as Record<string, string>).toString();

  return (
    <Link href={`/dashboard/${taskId}?${query}`} passHref>
      <div className="cursor-pointer hover:bg-gray-100">
        {children}
      </div>
    </Link>
  );
};

export default RowLink;
