import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AddDocumentModal } from "@/components/modals/add-document-modal";
import { formatDate, getFileIcon, getCategoryIcon } from "@/lib/utils";
import { LinkIcon, ExternalLink, Download } from "lucide-react";
import type { Document } from "@shared/schema";

export default function Documents() {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const { isAdmin } = useAuth();

  const { data: documents, isLoading } = useQuery<Document[]>({
    queryKey: ["/api/documents"],
  });

  if (isLoading) {
    return (
      <div className="px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-80" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-80" />
          ))}
        </div>
      </div>
    );
  }

  const categorizeDocuments = (docs: Document[]) => {
    return docs.reduce((acc, doc) => {
      if (!acc[doc.category]) {
        acc[doc.category] = [];
      }
      acc[doc.category].push(doc);
      return acc;
    }, {} as Record<string, Document[]>);
  };

  const categorizedDocs = documents ? categorizeDocuments(documents) : {};

  const defaultCategories: Record<string, Document[]> = {
    Legal: [],
    Financial: [],
    Pitch: [],
  };

  const allCategories = { ...defaultCategories, ...categorizedDocs };

  return (
    <div className="px-8 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-black mb-2">Documents</h2>
          <p className="text-gray-600">
            {isAdmin ? "Manage company documents and resources" : "Access important company documents"}
          </p>
        </div>
        {isAdmin && (
          <Button 
            onClick={() => setAddModalOpen(true)}
            className="bg-black text-white hover:bg-gray-800"
          >
            <LinkIcon className="mr-2 h-4 w-4" />
            Add Document Link
          </Button>
        )}
      </div>

      {/* Document Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(allCategories).map(([category, docs]) => (
          <Card key={category} className="border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center text-lg font-semibold text-black">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                  <i className={`${getCategoryIcon(category)} text-lg`}></i>
                </div>
                {category === "Legal" ? "Legal Documents" : category}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {docs.length > 0 ? (
                <div className="space-y-3">
                  {docs.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center flex-1">
                        <i className={`${getFileIcon(doc.type)} mr-3 text-lg`}></i>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">
                            {doc.name}
                          </div>
                          {doc.description && (
                            <div className="text-xs text-gray-600 mt-1">
                              {doc.description}
                            </div>
                          )}
                          <div className="text-xs text-gray-500 mt-1 flex items-center">
                            <span>{formatDate(doc.date)}</span>
                            <span className="mx-2">•</span>
                            <span>{doc.source}</span>
                          </div>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-gray-400 hover:text-gray-600"
                        onClick={() => window.open(doc.url, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-sm">No documents in this category</p>
                  {isAdmin && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-2"
                      onClick={() => setAddModalOpen(true)}
                    >
                      Add First Document
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {isAdmin && (
        <AddDocumentModal 
          open={addModalOpen}
          onOpenChange={setAddModalOpen}
        />
      )}
    </div>
  );
}
