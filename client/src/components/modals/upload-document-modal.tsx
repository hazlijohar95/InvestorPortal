import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";

const uploadDocumentSchema = z.object({
  category: z.enum(["Legal", "Financial", "Pitch"]),
  file: z.instanceof(File).refine((file) => file.size <= 10 * 1024 * 1024, {
    message: "File size must be less than 10MB",
  }),
});

type UploadDocumentForm = z.infer<typeof uploadDocumentSchema>;

interface UploadDocumentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UploadDocumentModal({ open, onOpenChange }: UploadDocumentModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [dragActive, setDragActive] = useState(false);

  const form = useForm<UploadDocumentForm>({
    resolver: zodResolver(uploadDocumentSchema),
    defaultValues: {
      category: "Legal",
    },
  });

  const uploadDocumentMutation = useMutation({
    mutationFn: async (data: UploadDocumentForm) => {
      const formData = new FormData();
      formData.append("file", data.file);
      formData.append("category", data.category);

      const response = await fetch("/api/documents", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      toast({
        title: "Document uploaded",
        description: "Your document has been uploaded successfully.",
      });
      form.reset();
      onOpenChange(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to upload document. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: UploadDocumentForm) => {
    uploadDocumentMutation.mutate(data);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      form.setValue("file", e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      form.setValue("file", e.target.files[0]);
    }
  };

  const selectedFile = form.watch("file");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select document category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Legal">Legal Documents</SelectItem>
                      <SelectItem value="Financial">Financial</SelectItem>
                      <SelectItem value="Pitch">Pitch Materials</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="file"
              render={({ field: { onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>File</FormLabel>
                  <FormControl>
                    <div
                      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                        dragActive
                          ? "border-primary bg-primary/5"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-4">
                        {selectedFile ? (
                          <p className="text-sm font-medium text-gray-900">
                            {selectedFile.name}
                          </p>
                        ) : (
                          <>
                            <p className="text-sm text-gray-600">
                              Drop your file here, or{" "}
                              <label className="text-primary cursor-pointer hover:underline">
                                browse
                                <input
                                  type="file"
                                  className="hidden"
                                  onChange={handleFileChange}
                                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                                />
                              </label>
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Supports PDF, Word, Excel, PowerPoint (max 10MB)
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={uploadDocumentMutation.isPending || !selectedFile}>
                {uploadDocumentMutation.isPending ? "Uploading..." : "Upload"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
