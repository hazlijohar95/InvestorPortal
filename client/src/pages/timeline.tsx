import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Plus, Edit, Save, X, TrendingUp, Trash2, AlertTriangle } from "lucide-react";
import { getMilestoneStatusColor } from "@/lib/utils";
import type { Milestone, InsertMilestone } from "@shared/schema";

export default function Timeline() {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // State for adding new milestones
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMilestone, setNewMilestone] = useState({
    title: "",
    description: "",
    date: "",
    status: "Planned" as const,
    amount: "",
  });

  // State for editing existing milestones
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<InsertMilestone>>({});
  
  // State for delete confirmation
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Query for fetching milestones
  const { data: milestones, isLoading } = useQuery<Milestone[]>({
    queryKey: ["/api/milestones"],
  });

  // Mutation for adding milestones
  const addMilestoneMutation = useMutation({
    mutationFn: async (data: InsertMilestone) => {
      return await apiRequest("POST", "/api/milestones", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/milestones"] });
      setShowAddForm(false);
      setNewMilestone({ title: "", description: "", date: "", status: "Planned", amount: "" });
      toast({ title: "Milestone added successfully" });
    },
    onError: () => {
      toast({ title: "Failed to add milestone", variant: "destructive" });
    },
  });

  // Mutation for updating milestones
  const updateMilestoneMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertMilestone> }) => {
      return await apiRequest("PUT", `/api/milestones/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/milestones"] });
      setEditingId(null);
      setEditData({});
      toast({ title: "Milestone updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update milestone", variant: "destructive" });
    },
  });

  // Mutation for deleting milestones
  const deleteMilestoneMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/milestones/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/milestones"] });
      setDeletingId(null);
      toast({ title: "Milestone deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete milestone", variant: "destructive" });
    },
  });

  const isAdmin = (user as any)?.userType === "admin";

  // Handle adding new milestone
  const handleAddMilestone = () => {
    if (!newMilestone.title || !newMilestone.description || !newMilestone.date) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    const milestoneData: InsertMilestone = {
      title: newMilestone.title,
      description: newMilestone.description,
      date: newMilestone.date,
      status: newMilestone.status,
      amount: newMilestone.amount ? Number(newMilestone.amount) : null,
      investors: null,
      icon: "fas fa-rocket",
    };

    addMilestoneMutation.mutate(milestoneData);
  };

  // Handle editing milestone
  const handleEditMilestone = (milestone: Milestone) => {
    setEditingId(milestone.id);
    setEditData({
      title: milestone.title,
      description: milestone.description,
      date: milestone.date,
      status: milestone.status,
      amount: milestone.amount,
    });
  };

  // Handle saving edit
  const handleSaveEdit = () => {
    if (!editingId) return;

    const currentMilestone = milestones?.find(m => m.id === editingId);
    if (!currentMilestone) return;

    const updateData: Partial<InsertMilestone> = {
      title: editData.title || currentMilestone.title,
      description: editData.description || currentMilestone.description,
      date: editData.date || currentMilestone.date,
      status: editData.status || currentMilestone.status,
      amount: editData.amount !== undefined ? Number(editData.amount) : currentMilestone.amount,
    };

    updateMilestoneMutation.mutate({ id: editingId, data: updateData });
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  if (authLoading || isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Fundraising Timeline</h1>
          <p className="text-gray-600">Key milestones and fundraising progress</p>
        </div>
        {isAdmin && (
          <Button onClick={() => setShowAddForm(true)} className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add Milestone</span>
          </Button>
        )}
      </div>

      {/* Add Milestone Form */}
      {showAddForm && isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Milestone</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={newMilestone.title}
                  onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
                  placeholder="e.g., Series A Round Completed"
                />
              </div>
              <div>
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={newMilestone.date}
                  onChange={(e) => setNewMilestone({ ...newMilestone, date: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={newMilestone.description}
                onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
                placeholder="Describe the milestone..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={newMilestone.status} onValueChange={(value) => setNewMilestone({ ...newMilestone, status: value as any })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Planned">Planned</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="amount">Amount (optional)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={newMilestone.amount}
                  onChange={(e) => setNewMilestone({ ...newMilestone, amount: e.target.value })}
                  placeholder="500000"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <Button 
                onClick={handleAddMilestone}
                disabled={addMilestoneMutation.isPending}
              >
                {addMilestoneMutation.isPending ? "Adding..." : "Add Milestone"}
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timeline */}
      <div className="space-y-6">
        {milestones && milestones.length > 0 ? (
          milestones.map((milestone, index) => (
            <div key={milestone.id} className="relative">
              {/* Timeline connector line */}
              {index < milestones.length - 1 && (
                <div className="absolute left-6 top-16 w-0.5 h-16 bg-gray-200" />
              )}
              
              <div className="flex items-start space-x-4">
                {/* Timeline dot */}
                <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-gray-600" />
                </div>

                {/* Milestone content */}
                <div className="flex-1">
                  <Card>
                    <CardContent className="p-6">
                      {editingId === milestone.id ? (
                        // Edit mode
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label>Title</Label>
                              <Input
                                value={editData.title || ""}
                                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label>Date</Label>
                              <Input
                                type="date"
                                value={editData.date || ""}
                                onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                              />
                            </div>
                          </div>
                          <div>
                            <Label>Description</Label>
                            <Textarea
                              value={editData.description || ""}
                              onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                              rows={3}
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label>Status</Label>
                              <Select 
                                value={editData.status || milestone.status} 
                                onValueChange={(value) => setEditData({ ...editData, status: value as any })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Planned">Planned</SelectItem>
                                  <SelectItem value="In Progress">In Progress</SelectItem>
                                  <SelectItem value="Completed">Completed</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label>Amount (optional)</Label>
                              <Input
                                type="number"
                                value={editData.amount || ""}
                                onChange={(e) => setEditData({ ...editData, amount: Number(e.target.value) })}
                              />
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              onClick={handleSaveEdit}
                              disabled={updateMilestoneMutation.isPending}
                              size="sm"
                            >
                              <Save className="h-4 w-4 mr-2" />
                              {updateMilestoneMutation.isPending ? "Saving..." : "Save"}
                            </Button>
                            <Button variant="outline" onClick={handleCancelEdit} size="sm">
                              <X className="h-4 w-4 mr-2" />
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        // View mode
                        <div>
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="text-lg font-semibold text-gray-900">{milestone.title}</h3>
                            <div className="flex items-center space-x-2">
                              <Badge className={getMilestoneStatusColor(milestone.status)}>
                                {milestone.status}
                              </Badge>
                              {isAdmin && (
                                <div className="flex space-x-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEditMilestone(milestone)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setDeletingId(milestone.id)}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-gray-500 mb-3">{milestone.date}</p>
                          <p className="text-gray-700 mb-4">{milestone.description}</p>
                          {milestone.amount && (
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span>💰 Amount: ${milestone.amount.toLocaleString()}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          ))
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No milestones yet</h3>
              <p className="text-gray-600 mb-4">
                {isAdmin 
                  ? "Add your first milestone to start building your fundraising timeline."
                  : "No milestones have been added yet."
                }
              </p>
              {isAdmin && (
                <Button onClick={() => setShowAddForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Milestone
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}