import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit2, Save, X } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Stakeholder, InsertStakeholder } from "@shared/schema";

export default function CapTable() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [editMode, setEditMode] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<InsertStakeholder>>({});
  const [newStakeholder, setNewStakeholder] = useState<Partial<InsertStakeholder>>({
    name: "",
    title: "",
    shares: 0,
    percentage: 0,
  });

  const { data: stakeholders, isLoading } = useQuery<Stakeholder[]>({
    queryKey: ["/api/stakeholders"],
  });

  const createStakeholderMutation = useMutation({
    mutationFn: async (data: InsertStakeholder) => {
      const response = await apiRequest("POST", "/api/stakeholders", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stakeholders"] });
      setShowAddForm(false);
      setNewStakeholder({ name: "", title: "", shares: 0, percentage: 0 });
      toast({ title: "Stakeholder added successfully" });
    },
    onError: () => {
      toast({ title: "Failed to add stakeholder", variant: "destructive" });
    },
  });

  const updateStakeholderMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertStakeholder> }) => {
      return await apiRequest("PUT", `/api/stakeholders/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stakeholders"] });
      setEditingId(null);
      setEditData({});
      toast({ title: "Stakeholder updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update stakeholder", variant: "destructive" });
    },
  });

  const isAdmin = (user as any)?.userType === "admin";

  const capTableSummary = {
    totalShares: 10000000,
    outstandingShares: 8500000,
    optionPool: 1200000,
    available: 300000,
  };

  if (isLoading) {
    return (
      <div className="px-8 py-8">
        <div className="mb-8">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-80" />
        </div>
        <Skeleton className="h-32 mb-6" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Founder":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "Investor":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "Options":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const handleAddStakeholder = () => {
    if (!newStakeholder.name || !newStakeholder.title || !newStakeholder.shares || !newStakeholder.percentage) {
      toast({ title: "Please fill in all fields", variant: "destructive" });
      return;
    }
    createStakeholderMutation.mutate(newStakeholder as InsertStakeholder);
  };

  const handleEditStakeholder = (stakeholder: Stakeholder) => {
    setEditingId(stakeholder.id);
    setEditData({
      name: stakeholder.name,
      title: stakeholder.title,
      shares: stakeholder.shares,
      percentage: stakeholder.percentage,
    });
  };

  const handleSaveEdit = () => {
    if (!editingId) {
      toast({ title: "No item selected for editing", variant: "destructive" });
      return;
    }
    
    // Find the current stakeholder to preserve existing data
    const currentStakeholder = stakeholders?.find(s => s.id === editingId);
    if (!currentStakeholder) {
      toast({ title: "Stakeholder not found", variant: "destructive" });
      return;
    }
    
    // Use edited values or fall back to current values
    const updateData = {
      name: editData.name || currentStakeholder.name,
      title: editData.title || currentStakeholder.title,
      shares: editData.shares !== undefined ? Number(editData.shares) : currentStakeholder.shares,
      percentage: editData.percentage !== undefined ? Number(editData.percentage) : currentStakeholder.percentage,
    };
    
    console.log("Saving data:", updateData); // Debug log
    updateStakeholderMutation.mutate({ id: editingId, data: updateData as InsertStakeholder });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  return (
    <div className="px-8 py-8">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-black mb-2">Cap Table</h2>
          <p className="text-gray-600">Current ownership structure and equity distribution</p>
        </div>
        {isAdmin && (
          <Button
            onClick={() => setShowAddForm(true)}
            className="bg-black hover:bg-gray-800 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Stakeholder
          </Button>
        )}
      </div>

      {/* Add Stakeholder Form */}
      {showAddForm && isAdmin && (
        <Card className="border border-gray-200 mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-semibold text-black">Add New Stakeholder</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAddForm(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newStakeholder.name || ''}
                  onChange={(e) => setNewStakeholder({ ...newStakeholder, name: e.target.value })}
                  placeholder="Stakeholder name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Title/Type</Label>
                <Select onValueChange={(value) => setNewStakeholder({ ...newStakeholder, title: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Founder">Founder</SelectItem>
                    <SelectItem value="Investor">Investor</SelectItem>
                    <SelectItem value="Options">Options</SelectItem>
                    <SelectItem value="Employee">Employee</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="shares">Shares</Label>
                <Input
                  id="shares"
                  type="number"
                  value={newStakeholder.shares || ''}
                  onChange={(e) => setNewStakeholder({ ...newStakeholder, shares: Number(e.target.value) })}
                  placeholder="Number of shares"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="percentage">Percentage</Label>
                <Input
                  id="percentage"
                  type="number"
                  step="0.01"
                  value={newStakeholder.percentage || ''}
                  onChange={(e) => setNewStakeholder({ ...newStakeholder, percentage: Number(e.target.value) })}
                  placeholder="Ownership percentage"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddStakeholder}
                disabled={createStakeholderMutation.isPending}
                className="bg-black hover:bg-gray-800 text-white"
              >
                {createStakeholderMutation.isPending ? "Adding..." : "Add Stakeholder"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cap Table Summary */}
      <Card className="border border-gray-200 mb-6">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-black">Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-black">
                {formatNumber(capTableSummary.totalShares)}
              </div>
              <div className="text-sm text-gray-600">Total Shares</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-black">
                {formatNumber(capTableSummary.outstandingShares)}
              </div>
              <div className="text-sm text-gray-600">Outstanding</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-black">
                {formatNumber(capTableSummary.optionPool)}
              </div>
              <div className="text-sm text-gray-600">Option Pool</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-black">
                {formatNumber(capTableSummary.available)}
              </div>
              <div className="text-sm text-gray-600">Available</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stakeholders Table */}
      <Card className="border border-gray-200 overflow-hidden">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="text-lg font-semibold text-black">Stakeholders</CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Shares
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Percentage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Security Type
                </th>
                {isAdmin && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stakeholders?.map((stakeholder) => (
                <tr key={stakeholder.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === stakeholder.id ? (
                      <div className="space-y-2">
                        <Input
                          value={editData.name || ''}
                          onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                          placeholder="Name"
                          className="text-sm"
                        />
                        <Input
                          value={editData.title || ''}
                          onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                          placeholder="Title"
                          className="text-sm"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium">
                          {stakeholder.initials}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {stakeholder.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {stakeholder.title}
                          </div>
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className={getTypeColor(stakeholder.type)}>
                      {stakeholder.type}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {editingId === stakeholder.id ? (
                      <Input
                        type="number"
                        value={editData.shares || ''}
                        onChange={(e) => setEditData({ ...editData, shares: Number(e.target.value) })}
                        className="text-sm w-24"
                      />
                    ) : (
                      formatNumber(stakeholder.shares)
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {editingId === stakeholder.id ? (
                      <Input
                        type="number"
                        step="0.01"
                        value={editData.percentage || ''}
                        onChange={(e) => setEditData({ ...editData, percentage: Number(e.target.value) })}
                        className="text-sm w-20"
                      />
                    ) : (
                      `${stakeholder.percentage}%`
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {stakeholder.securityType}
                  </td>
                  {isAdmin && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {editingId === stakeholder.id ? (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={handleSaveEdit}
                            disabled={updateStakeholderMutation.isPending}
                            className="bg-black hover:bg-gray-800 text-white"
                          >
                            <Save className="w-3 h-3 mr-1" />
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleCancelEdit}
                          >
                            <X className="w-3 h-3 mr-1" />
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditStakeholder(stakeholder)}
                          className="text-gray-600 hover:text-black"
                        >
                          <Edit2 className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
