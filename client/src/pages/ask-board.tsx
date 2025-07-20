import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateAskModal } from "@/components/modals/create-ask-modal";
import { formatRelativeDate, getAskCategoryIcon, getUrgencyColor } from "@/lib/utils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Plus, Edit, Share2, MessageCircle, Eye, Reply, HandHeart } from "lucide-react";
import type { Ask } from "@shared/schema";

export default function AskBoard() {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const { isAdmin, user } = useAuth();

  const { data: asks, isLoading } = useQuery<Ask[]>({
    queryKey: ["/api/asks"],
  });

  // Track views when asks are loaded for investors
  useEffect(() => {
    if (asks && !isAdmin) {
      asks.forEach(ask => {
        fetch(`/api/asks/${ask.id}/view`, { method: "POST" });
      });
    }
  }, [asks, isAdmin]);

  const helpMutation = useMutation({
    mutationFn: async (askId: number) => {
      const response = await fetch(`/api/asks/${askId}/responses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: "I can help with this!",
          respondentName: (user as any)?.email || "Anonymous",
          respondentEmail: (user as any)?.email || "",
        }),
      });
      if (!response.ok) throw new Error("Failed to respond");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/asks"] });
    },
  });

  if (isLoading) {
    return (
      <div className="px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-80" />
          </div>
          <Skeleton className="h-10 w-28" />
        </div>
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Intros":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "Hiring":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "Advice":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const getCategoryBgColor = (category: string) => {
    switch (category) {
      case "Intros":
        return "bg-blue-100";
      case "Hiring":
        return "bg-green-100";
      case "Advice":
        return "bg-purple-100";
      default:
        return "bg-gray-100";
    }
  };

  return (
    <div className="px-8 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-black mb-2">Ask Board</h2>
          <p className="text-gray-600">
            {isAdmin ? "Requests for assistance from investors" : "How you can help Cynco succeed"}
          </p>
        </div>
        {isAdmin && (
          <Button 
            onClick={() => setCreateModalOpen(true)}
            className="bg-black text-white hover:bg-gray-800"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Ask
          </Button>
        )}
      </div>

      {/* Active Asks */}
      <div className="space-y-6">
        {asks && asks.length > 0 ? (
          asks.map((ask) => (
            <Card key={ask.id} className="hover-card border border-gray-200">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 ${getCategoryBgColor(ask.category)}`}>
                      <i className={`${getAskCategoryIcon(ask.category)} text-lg`}></i>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-black">{ask.title}</h3>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Badge className={getCategoryColor(ask.category)}>
                          {ask.category}
                        </Badge>
                        <span className={`mx-2 ${getUrgencyColor(ask.urgency)}`}>
                          {ask.urgency} Priority
                        </span>
                        <span className="mx-2">•</span>
                        <span>{formatRelativeDate(ask.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {isAdmin && (
                      <>
                        <Button size="sm" variant="ghost" className="text-gray-400 hover:text-gray-600">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-gray-400 hover:text-gray-600">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-gray-600">{ask.description}</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <MessageCircle className="mr-1 h-4 w-4" />
                      {ask.responses} responses
                    </span>
                    <span className="flex items-center">
                      <Eye className="mr-1 h-4 w-4" />
                      {ask.views} views
                    </span>
                  </div>
                  {!isAdmin ? (
                    <Button 
                      size="sm"
                      className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-0"
                      onClick={() => helpMutation.mutate(ask.id)}
                      disabled={helpMutation.isPending}
                    >
                      <HandHeart className="mr-1 h-4 w-4" />
                      {helpMutation.isPending ? "Responding..." : "I Can Help"}
                    </Button>
                  ) : (
                    <Button 
                      size="sm"
                      className="bg-gray-50 text-gray-600 hover:bg-gray-100 border-0"
                    >
                      <Eye className="mr-1 h-4 w-4" />
                      View Responses
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="border border-gray-200">
            <CardContent className="p-12 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No asks yet</h3>
              <p className="text-gray-600 mb-4">
                {isAdmin 
                  ? "Create your first ask to let investors know what you're looking for."
                  : "The Cynco team hasn't posted any requests for assistance yet."
                }
              </p>
              {isAdmin && (
                <Button 
                  onClick={() => setCreateModalOpen(true)}
                  className="bg-black text-white hover:bg-gray-800"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Ask
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {isAdmin && (
        <CreateAskModal 
          open={createModalOpen}
          onOpenChange={setCreateModalOpen}
        />
      )}
    </div>
  );
}
