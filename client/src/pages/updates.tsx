import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateUpdateModal } from "@/components/modals/create-update-modal";
import { formatDate, formatRelativeDate } from "@/lib/utils";
import { Plus, Edit, Share2, Paperclip, MessageCircle, Eye } from "lucide-react";
import type { Update } from "@shared/schema";

export default function Updates() {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const { isAdmin } = useAuth();

  const { data: updates, isLoading } = useQuery<Update[]>({
    queryKey: ["/api/updates"],
  });

  if (isLoading) {
    return (
      <div className="px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <Skeleton className="h-8 w-56 mb-2" />
            <Skeleton className="h-4 w-80" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-8 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-black mb-2">Company Updates</h2>
          <p className="text-gray-600">
            {isAdmin ? "Share company progress with investors" : "Latest updates from the team"}
          </p>
        </div>
        {isAdmin && (
          <Button 
            onClick={() => setCreateModalOpen(true)}
            className="bg-black text-white hover:bg-gray-800"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Update
          </Button>
        )}
      </div>

      {/* Updates List */}
      <div className="space-y-6">
        {updates && updates.length > 0 ? (
          updates.map((update) => (
            <Card key={update.id} className="hover-card border border-gray-200">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-black mb-2">
                      {update.title}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <span>{formatDate(update.createdAt)}</span>
                      <span className="mx-2">•</span>
                      <span>{update.author}</span>
                      <span className="mx-2">•</span>
                      <Badge 
                        variant={update.type === "Quarterly" ? "default" : "secondary"}
                        className={
                          update.type === "Quarterly" 
                            ? "bg-blue-100 text-blue-800 hover:bg-blue-100" 
                            : "bg-green-100 text-green-800 hover:bg-green-100"
                        }
                      >
                        {update.type}
                      </Badge>
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
                
                <div className="prose prose-sm max-w-none mb-4 text-gray-700">
                  <p>{update.content}</p>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Paperclip className="mr-1 h-4 w-4" />
                    {update.attachments} attachments
                  </span>
                  <span className="flex items-center">
                    <MessageCircle className="mr-1 h-4 w-4" />
                    {update.comments} comments
                  </span>
                  <span className="flex items-center">
                    <Eye className="mr-1 h-4 w-4" />
                    {update.views} views
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="border border-gray-200">
            <CardContent className="p-12 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No updates yet</h3>
              <p className="text-gray-600 mb-4">
                {isAdmin 
                  ? "Start sharing updates with your investors by creating your first post."
                  : "Updates from the Cynco team will appear here."
                }
              </p>
              {isAdmin && (
                <Button 
                  onClick={() => setCreateModalOpen(true)}
                  className="bg-black text-white hover:bg-gray-800"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Update
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {isAdmin && (
        <CreateUpdateModal 
          open={createModalOpen}
          onOpenChange={setCreateModalOpen}
        />
      )}
    </div>
  );
}
