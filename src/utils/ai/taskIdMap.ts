
import ToDo from "@/models/todoList";


export const formatTaskId = (id: string): string => {
  return `TASK-${id.slice(-4)}`;
};

export const createTaskIdMap = async (): Promise<Record<string, string>> => {
  const tasks = await ToDo.find({});
  const taskIdMap: Record<string, string> = tasks.reduce((map, task) => {
    const formattedId = formatTaskId(task._id.toString());
    map[formattedId] = task._id.toString();
    return map;
  }, {});
  return taskIdMap;
};
