import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatNumber, formatRelativeDate } from "@/lib/utils";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ArrowUp, Clock, Flame, TrendingUp, Users, DollarSign, Target, Edit, Save, X, Download } from "lucide-react";
import type { Metrics, Update, Stakeholder, Milestone, Ask } from "@shared/schema";

export default function Dashboard() {
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState<Partial<Metrics>>({});
  const { isAdmin } = useAuth();
  const { toast } = useToast();

  const { data: metrics, isLoading } = useQuery<Metrics>({
    queryKey: ["/api/metrics"],
  });

  // Fetch all data needed for export
  const { data: updates } = useQuery<Update[]>({
    queryKey: ["/api/updates"],
  });

  const { data: stakeholders } = useQuery<Stakeholder[]>({
    queryKey: ["/api/stakeholders"],
  });

  const { data: milestones } = useQuery<Milestone[]>({
    queryKey: ["/api/milestones"],
  });

  const { data: asks } = useQuery<Ask[]>({
    queryKey: ["/api/asks"],
  });

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<Metrics>) => {
      return await apiRequest("PUT", "/api/metrics", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/metrics"] });
      setEditMode(false);
      setEditData({});
    },
  });

  const handleEdit = () => {
    setEditData({
      mrr: metrics?.mrr,
      runway: metrics?.runway,
      burnRate: metrics?.burnRate,
      activeUsers: metrics?.activeUsers,
      cac: metrics?.cac,
      ltv: metrics?.ltv,
      churn: metrics?.churn,
      teamSize: metrics?.teamSize,
      openPositions: metrics?.openPositions,
      cashBalance: metrics?.cashBalance,
    });
    setEditMode(true);
  };

  const handleSave = () => {
    updateMutation.mutate(editData);
  };

  const handleCancel = () => {
    setEditMode(false);
    setEditData({});
  };

  const generateInvestorReport = () => {
    if (!metrics || !stakeholders || !milestones || !updates || !asks) {
      toast({ title: "Data not ready for export", variant: "destructive" });
      return;
    }

    const reportDate = new Date().toLocaleDateString();
    const reportTime = new Date().toLocaleTimeString();

    // Create comprehensive CSV report
    let csvContent = "Cynco Investor Report\n";
    csvContent += `Generated on: ${reportDate} at ${reportTime}\n\n`;

    // Key Metrics Section
    csvContent += "=== KEY METRICS ===\n";
    csvContent += "Metric,Value\n";
    csvContent += `Monthly Recurring Revenue,${formatCurrency(metrics.mrr)}\n`;
    csvContent += `Runway (months),${metrics.runway}\n`;
    csvContent += `Monthly Burn Rate,${formatCurrency(metrics.burnRate)}\n`;
    csvContent += `Active Users,${formatNumber(metrics.activeUsers)}\n`;
    csvContent += `Customer Acquisition Cost,${formatCurrency(metrics.cac)}\n`;
    csvContent += `Lifetime Value,${formatCurrency(metrics.ltv)}\n`;
    csvContent += `Churn Rate,${metrics.churn}%\n`;
    csvContent += `Team Size,${metrics.teamSize}\n`;
    csvContent += `Open Positions,${metrics.openPositions}\n`;
    csvContent += `Cash Balance,${formatCurrency(metrics.cashBalance)}\n`;
    csvContent += `Last Fundraise,${metrics.lastFundraise}\n`;
    csvContent += `Last Updated,${formatRelativeDate(metrics.updatedAt)}\n\n`;

    // Cap Table Section
    csvContent += "=== CAP TABLE ===\n";
    csvContent += "Name,Title,Type,Shares,Percentage,Security Type\n";
    stakeholders?.forEach(stakeholder => {
      csvContent += `"${stakeholder.name}","${stakeholder.title}","${stakeholder.type}",${stakeholder.shares},${stakeholder.percentage}%,"${stakeholder.securityType}"\n`;
    });
    csvContent += "\n";

    // Timeline/Milestones Section
    csvContent += "=== FUNDRAISING TIMELINE ===\n";
    csvContent += "Date,Title,Status,Description,Amount\n";
    milestones?.forEach(milestone => {
      const amount = milestone.amount ? formatCurrency(milestone.amount) : "N/A";
      csvContent += `"${milestone.date}","${milestone.title}","${milestone.status}","${milestone.description}","${amount}"\n`;
    });
    csvContent += "\n";

    // Recent Updates Section
    csvContent += "=== RECENT UPDATES ===\n";
    csvContent += "Date,Title,Content\n";
    updates?.slice(0, 5).forEach(update => {
      csvContent += `"${new Date(update.createdAt).toLocaleDateString()}","${update.title}","${update.content.replace(/"/g, '""')}"\n`;
    });
    csvContent += "\n";

    // Active Asks Section
    csvContent += "=== ACTIVE ASKS ===\n";
    csvContent += "Title,Category,Urgency,Description,Views,Responses\n";
    asks?.forEach(ask => {
      csvContent += `"${ask.title}","${ask.category}","${ask.urgency}","${ask.description.replace(/"/g, '""')}",${ask.views},${ask.responses}\n`;
    });

    // Download the report
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `Cynco_Investor_Report_${reportDate.replace(/\//g, '-')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({ title: "Investor report exported successfully!" });
  };

  if (isLoading) {
    return (
      <div className="px-8 py-8">
        <div className="mb-8">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="px-8 py-8">
        <div className="text-center py-12">
          <p className="text-gray-500">No metrics data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-8 py-8">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-black mb-2">Dashboard</h2>
          <div className="space-y-1">
            <p className="text-gray-600">Key metrics and company overview</p>
            {metrics.updatedAt && (
              <p className="text-sm text-gray-500 flex items-center">
                <Clock className="mr-1 h-3 w-3" />
                Last updated {formatRelativeDate(metrics.updatedAt)}
              </p>
            )}
          </div>
        </div>
        {isAdmin && !editMode && (
          <div className="flex space-x-2">
            <Button 
              onClick={generateInvestorReport}
              variant="outline"
              className="flex items-center"
            >
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
            <Button 
              onClick={handleEdit}
              variant="outline"
              className="flex items-center"
            >
              <Edit className="mr-2 h-4 w-4" />
              Update Metrics
            </Button>
          </div>
        )}
        {isAdmin && editMode && (
          <div className="flex space-x-2">
            <Button 
              onClick={handleSave}
              disabled={updateMutation.isPending}
              className="flex items-center"
            >
              <Save className="mr-2 h-4 w-4" />
              {updateMutation.isPending ? "Saving..." : "Save"}
            </Button>
            <Button 
              onClick={handleCancel}
              variant="outline"
              className="flex items-center"
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          </div>
        )}
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="hover-card border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Monthly Recurring Revenue</h3>
              <ArrowUp className="h-4 w-4 text-green-500" />
            </div>
            {editMode ? (
              <div className="space-y-2">
                <Label htmlFor="mrr">MRR Amount</Label>
                <Input
                  id="mrr"
                  type="number"
                  value={editData.mrr || ''}
                  onChange={(e) => setEditData({ ...editData, mrr: Number(e.target.value) })}
                  className="text-lg font-semibold"
                />
              </div>
            ) : (
              <>
                <div className="text-3xl font-bold text-black mb-2">
                  {formatCurrency(metrics.mrr)}
                </div>
                <p className="text-sm text-green-600">+12% from last month</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="hover-card border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Runway</h3>
              <Clock className="h-4 w-4 text-blue-500" />
            </div>
            {editMode ? (
              <div className="space-y-2">
                <Label htmlFor="runway">Runway (months)</Label>
                <Input
                  id="runway"
                  type="number"
                  value={editData.runway || ''}
                  onChange={(e) => setEditData({ ...editData, runway: Number(e.target.value) })}
                  className="text-lg font-semibold"
                />
              </div>
            ) : (
              <>
                <div className="text-3xl font-bold text-black mb-2">
                  {metrics.runway} months
                </div>
                <p className="text-sm text-gray-600">Based on current burn rate</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="hover-card border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Monthly Burn Rate</h3>
              <Flame className="h-4 w-4 text-red-500" />
            </div>
            {editMode ? (
              <div className="space-y-2">
                <Label htmlFor="burnRate">Monthly Burn Rate</Label>
                <Input
                  id="burnRate"
                  type="number"
                  value={editData.burnRate || ''}
                  onChange={(e) => setEditData({ ...editData, burnRate: Number(e.target.value) })}
                  className="text-lg font-semibold"
                />
              </div>
            ) : (
              <>
                <div className="text-3xl font-bold text-black mb-2">
                  {formatCurrency(metrics.burnRate)}
                </div>
                <p className="text-sm text-red-600">-5% from last month</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-black">Growth Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {editMode ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="activeUsers">Active Users</Label>
                  <Input
                    id="activeUsers"
                    type="number"
                    value={editData.activeUsers || ''}
                    onChange={(e) => setEditData({ ...editData, activeUsers: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cac">Customer Acquisition Cost</Label>
                  <Input
                    id="cac"
                    type="number"
                    value={editData.cac || ''}
                    onChange={(e) => setEditData({ ...editData, cac: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ltv">Lifetime Value</Label>
                  <Input
                    id="ltv"
                    type="number"
                    value={editData.ltv || ''}
                    onChange={(e) => setEditData({ ...editData, ltv: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="churn">Churn Rate (%)</Label>
                  <Input
                    id="churn"
                    type="number"
                    step="0.1"
                    value={editData.churn || ''}
                    onChange={(e) => setEditData({ ...editData, churn: Number(e.target.value) })}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Active Users</span>
                  <span className="font-semibold">{formatNumber(metrics.activeUsers)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Customer Acquisition Cost</span>
                  <span className="font-semibold">{formatCurrency(metrics.cac)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Lifetime Value</span>
                  <span className="font-semibold">{formatCurrency(metrics.ltv)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Churn Rate</span>
                  <span className="font-semibold text-green-600">{metrics.churn}%</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-black">Team & Operations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {editMode ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="teamSize">Team Size</Label>
                  <Input
                    id="teamSize"
                    type="number"
                    value={editData.teamSize || ''}
                    onChange={(e) => setEditData({ ...editData, teamSize: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="openPositions">Open Positions</Label>
                  <Input
                    id="openPositions"
                    type="number"
                    value={editData.openPositions || ''}
                    onChange={(e) => setEditData({ ...editData, openPositions: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cashBalance">Cash Balance</Label>
                  <Input
                    id="cashBalance"
                    type="number"
                    value={editData.cashBalance || ''}
                    onChange={(e) => setEditData({ ...editData, cashBalance: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastFundraise">Last Fundraise</Label>
                  <Input
                    id="lastFundraise"
                    type="text"
                    value={editData.lastFundraise || ''}
                    onChange={(e) => setEditData({ ...editData, lastFundraise: e.target.value })}
                    placeholder="e.g., Pre-seed, Seed, Series A"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Team Size</span>
                  <span className="font-semibold">{metrics.teamSize}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Open Positions</span>
                  <span className="font-semibold">{metrics.openPositions}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Cash Balance</span>
                  <span className="font-semibold">{formatCurrency(metrics.cashBalance)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Last Fundraise</span>
                  <span className="font-semibold">{metrics.lastFundraise}</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
