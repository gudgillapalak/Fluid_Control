import { useState, useMemo } from "react";
import { AppLayout } from "@/components/AppLayout";
import { useProjectData } from "@/contexts/ProjectContext";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Eye } from "lucide-react";
import { groupStatus } from "@/types/project";

// 🎨 STATUS COLORS
const statusBadgeColor = (status: string) => {
  const group = groupStatus(status);
  const colors: Record<string, string> = {
    Completed: "bg-success/10 text-success border-success/20",
    Ongoing: "bg-info/10 text-info border-info/20",
    "On Hold": "bg-warning/10 text-warning border-warning/20",
    "On Demand": "bg-accent text-accent-foreground",
    "Feasibility/Quotation": "bg-primary/10 text-primary border-primary/20",
    Other: "bg-muted text-muted-foreground",
  };
  return colors[group] || "";
};

const Projects = () => {
  const { projects } = useProjectData(); // ✅ EXCEL DATA

  const [search, setSearch] = useState("");
  const [detailProject, setDetailProject] = useState<any>(null);

  // 🔍 FILTER
  const filtered = useMemo(() => {
    return projects.filter((p: any) =>
      `${p.project_name} ${p.status} ${p.project_owner} ${p.category}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [projects, search]);

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">

        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">
            Projects
          </h1>
          <p className="text-muted-foreground mt-1">
            All projects from Excel
          </p>
        </div>

        {/* SEARCH */}
        <Input
          placeholder="Search projects, owner, status..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* TABLE */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Start</TableHead>
                  <TableHead>End</TableHead>
                  <TableHead>View</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10">
                      No projects found
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((p: any) => (
                    <TableRow
                      key={p.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => setDetailProject(p)}
                    >
                      <TableCell className="font-medium">
                        {p.project_name}
                      </TableCell>

                      <TableCell>{p.category || "—"}</TableCell>

                      <TableCell>{p.project_owner || "—"}</TableCell>

                      <TableCell>
                        <Badge className={statusBadgeColor(p.status)}>
                          {p.status}
                        </Badge>
                      </TableCell>

                      <TableCell>{p.start_date || "—"}</TableCell>

                      <TableCell>{p.end_date || "—"}</TableCell>

                      <TableCell>
                        <Eye className="h-4 w-4" />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>

            </Table>
          </CardContent>
        </Card>

        {/* 🔥 DETAIL POPUP */}
        <Dialog open={!!detailProject} onOpenChange={() => setDetailProject(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{detailProject?.project_name}</DialogTitle>
            </DialogHeader>

            {detailProject && (
              <div className="space-y-3 text-sm">

                <p><b>Owner:</b> {detailProject.project_owner}</p>
                <p><b>Status:</b> {detailProject.status}</p>
                <p><b>Category:</b> {detailProject.category}</p>
                <p><b>Start:</b> {detailProject.start_date || "—"}</p>
                <p><b>End:</b> {detailProject.end_date || "—"}</p>

              </div>
            )}

          </DialogContent>
        </Dialog>

      </div>
    </AppLayout>
  );
};

export default Projects;