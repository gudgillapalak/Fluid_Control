import { useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import { useProjectData } from "@/contexts/ProjectContext";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { groupStatus, STATUS_GROUP_COLORS } from "@/types/project";

export const DashboardCharts = () => {
  const { projects } = useProjectData();

  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // FILTER
  const filtered = useMemo(() => {
    if (!projects || projects.length === 0) return [];

    let result = [...projects];

    if (statusFilter !== "all") {
      result = result.filter(
        (p) => groupStatus(p.status) === statusFilter
      );
    }

    if (dateFrom) {
      result = result.filter(
        (p) => p.start_date && p.start_date >= dateFrom
      );
    }

    if (dateTo) {
      result = result.filter(
        (p) => p.end_date && p.end_date <= dateTo
      );
    }

    return result;
  }, [projects, statusFilter, dateFrom, dateTo]);

  // STATUS DATA
  const statusData = useMemo(() => {
    const counts = {};

    filtered.forEach((p) => {
      const group = groupStatus(p.status);
      counts[group] = (counts[group] || 0) + 1;
    });

    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
      fill: STATUS_GROUP_COLORS[name] || "#8884d8",
    }));
  }, [filtered]);

  // OWNER DATA
  const ownerData = useMemo(() => {
  const counts: Record<string, number> = {};

  filtered.forEach((p: any) => {
    const owner = p.project_owner || "Unassigned";
    counts[owner] = (counts[owner] || 0) + 1;
  });

  return Object.entries(counts)
    .map(([name, count]) => ({
      name: name.length > 18 ? name.slice(0, 18) + "…" : name,
      count,
    }))
    .sort((a: any, b: any) => b.count - a.count)
    .slice(0, 10);
}, [filtered]);

  // DURATION DATA
  const timelineData = useMemo(() => {
    return filtered
      .filter((p) => p.start_date && p.end_date)
      .map((p) => ({
        name:
          p.project_name.length > 25
            ? p.project_name.slice(0, 25) + "…"
            : p.project_name,
        duration: Math.ceil(
          (new Date(p.end_date).getTime() -
            new Date(p.start_date).getTime()) /
            (1000 * 60 * 60 * 24)
        ),
        status: groupStatus(p.status),
      }))
      .filter((p) => p.duration > 0)
      .slice(0, 10);
  }, [filtered]);

  // CATEGORY DATA
  const categoryData = useMemo(() => {
  const counts: Record<string, number> = {};

  filtered.forEach((p: any) => {
    const cat = p.category || "Unknown";
    counts[cat] = (counts[cat] || 0) + 1;
  });

  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a: any, b: any) => b.count - a.count);
}, [filtered]);

  const statusGroups = [
    "Completed",
    "Ongoing",
    "On Hold",
    "On Demand",
    "Feasibility/Quotation",
    "Other",
  ];

  return (
    <div className="space-y-6">

      <div className="chart-container">
        <h3 className="font-heading font-semibold mb-4">Filters</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          <div className="space-y-2">
            <Label>Status Group</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {statusGroups.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>From Date</Label>
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>To Date</Label>
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>

        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="chart-container">
          <h3 className="font-heading font-semibold mb-4">Status Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={statusData} dataKey="value" innerRadius={60} outerRadius={100}>
                {statusData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3 className="font-heading font-semibold mb-4">Projects per Owner</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={ownerData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={120} />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3 className="font-heading font-semibold mb-4">Project Duration (Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={timelineData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={150} />
              <Tooltip />
              <Bar dataKey="duration">
  {timelineData.map((entry, index) => (
    <Cell
      key={index}
      fill={
        entry.status === "Completed"
          ? "#22c55e"
          : entry.status === "Ongoing"
          ? "#3b82f6"
          : entry.status === "On Hold"
          ? "#f59e0b"
          : "#6b7280"
      }
    />
  ))}
</Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3 className="font-heading font-semibold mb-4">Projects by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-30} textAnchor="end" height={60} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
};