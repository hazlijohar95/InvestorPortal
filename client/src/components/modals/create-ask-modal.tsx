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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const createAskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.enum(["Intros", "Hiring", "Advice"]),
  urgency: z.enum(["High", "Medium", "Low"]),
  icon: z.string(),
});

type CreateAskForm = z.infer<typeof createAskSchema>;

interface CreateAskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const categoryIcons = {
  Intros: "fas fa-users",
  Hiring: "fas fa-user-tie",
  Advice: "fas fa-lightbulb",
};

export function CreateAskModal({ open, onOpenChange }: CreateAskModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<CreateAskForm>({
    resolver: zodResolver(createAskSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "Intros",
      urgency: "Medium",
      icon: categoryIcons.Intros,
    },
  });

  const createAskMutation = useMutation({
    mutationFn: async (data: CreateAskForm) => {
      return await apiRequest("POST", "/api/asks", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/asks"] });
      toast({
        title: "Ask created",
        description: "Your ask has been posted successfully.",
      });
      form.reset();
      onOpenChange(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create ask. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CreateAskForm) => {
    createAskMutation.mutate(data);
  };

  const handleCategoryChange = (category: "Intros" | "Hiring" | "Advice") => {
    form.setValue("category", category);
    form.setValue("icon", categoryIcons[category]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Create New Ask</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="What are you looking for?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={handleCategoryChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Intros">Introductions</SelectItem>
                      <SelectItem value="Hiring">Hiring</SelectItem>
                      <SelectItem value="Advice">Advice</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="urgency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="High">High Priority</SelectItem>
                      <SelectItem value="Medium">Medium Priority</SelectItem>
                      <SelectItem value="Low">Low Priority</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide details about what you're looking for..."
                      className="min-h-[150px]"
                      {...field}
                    />
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
              <Button type="submit" disabled={createAskMutation.isPending}>
                {createAskMutation.isPending ? "Creating..." : "Create Ask"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
