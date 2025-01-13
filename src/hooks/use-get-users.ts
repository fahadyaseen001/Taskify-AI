import { useQuery } from "@tanstack/react-query";
import AxiosInstance from "@/lib/axios-instance";

interface User {
  _id: string;
  name: string;
  email: string;
}

const fetchUsers = async (): Promise<User[]> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No authentication token found");

  const response = await AxiosInstance.get(`/api/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status !== 200) {
    throw new Error("Failed to fetch users");
  }

  return response.data.users;
};

export const useGetUsers = () => {
  return useQuery<User[], Error>({
    queryKey: ["users"],
    queryFn: fetchUsers,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};