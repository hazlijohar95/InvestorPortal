import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
    staleTime: 1000 * 60 * 10, // 10 minutes - auth rarely changes
    gcTime: 1000 * 60 * 30, // 30 minutes cache
    refetchOnMount: false, // Use cached auth state
    refetchOnWindowFocus: false, // Don't refetch on focus
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user && !error,
    isAdmin: user?.userType === "admin",
    isInvestor: user?.userType === "investor",
  };
}