import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { useProjectData } from "@/contexts/ProjectContext";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Employees = () => {
  const { projects, setProjects } = useProjectData();

  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);

  const [openAdd, setOpenAdd] = useState(false);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedEmpForAssign, setSelectedEmpForAssign] = useState("");

  // 🔥 CREATE EMPLOYEE LIST FROM EXCEL
  const employeesMap: Record<string, any> = {};

  projects.forEach((p: any) => {
    const owner = p.project_owner || "Unassigned";

    if (!employeesMap[owner]) {
      employeesMap[owner] = {
        name: owner,
        email: `${owner.replace(/\s/g, "").toLowerCase()}@company.com`,
        total: 0,
        active: 0,
      };
    }

    employeesMap[owner].total += 1;

    if (p.status?.toLowerCase().includes("ongoing")) {
      employeesMap[owner].active += 1;
    }
  });

  const employees = Object.values(employeesMap);

  // 🔥 HANDLE ASSIGN
  const handleAssign = () => {
    if (!selectedProject || !selectedEmpForAssign) return;

    const updated = projects.map((p: any) =>
      String(p.id) === selectedProject
        ? { ...p, project_owner: selectedEmpForAssign }
        : p
    );

    setProjects(updated);
    localStorage.setItem("projects", JSON.stringify(updated));

    setOpenAdd(false);
    setSelectedProject("");
    setSelectedEmpForAssign("");
  };

  // 🔥 GET PROJECTS OF SELECTED EMPLOYEE
  const employeeProjects = projects.filter(
    (p: any) => p.project_owner === selectedEmployee
  );

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-heading font-bold text-foreground">
              Employees
            </h1>
            <p className="text-muted-foreground mt-1">
              Auto-generated from Excel project owners
            </p>
          </div>

          <Button onClick={() => setOpenAdd(true)}>
            Add Employee to Project
          </Button>
        </div>

        {/* EMPLOYEE TABLE */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Assigned Projects</TableHead>
                  <TableHead>Active</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {employees.map((e: any, i: number) => (
                  <TableRow
                    key={i}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => setSelectedEmployee(e.name)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {e.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        {e.name}
                      </div>
                    </TableCell>

                    <TableCell>{e.email}</TableCell>

                    <TableCell>{e.total}</TableCell>

                    <TableCell>
                      <Badge>{e.active}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* 🔥 EMPLOYEE PROJECTS VIEW */}
        {selectedEmployee && (
          <Card>
            <CardContent>
              <h2 className="font-bold mb-4">
                Projects of {selectedEmployee}
              </h2>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Category</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {employeeProjects.map((p: any) => (
                    <TableRow key={p.id}>
                      <TableCell>{p.project_name}</TableCell>
                      <TableCell>{p.status}</TableCell>
                      <TableCell>{p.category}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* 🔥 ADD EMPLOYEE MODAL */}
        <Dialog open={openAdd} onOpenChange={setOpenAdd}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Employee to Project</DialogTitle>
            </DialogHeader>

            {/* SELECT EMPLOYEE */}
            <Select onValueChange={setSelectedEmpForAssign}>
              <SelectTrigger>
                <SelectValue placeholder="Select Employee" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((e: any, i: number) => (
                  <SelectItem key={i} value={e.name}>
                    {e.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* SELECT PROJECT */}
            <Select onValueChange={setSelectedProject}>
              <SelectTrigger>
                <SelectValue placeholder="Select Project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((p: any) => (
                  <SelectItem key={p.id} value={String(p.id)}>
                    {p.project_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button className="mt-4 w-full" onClick={handleAssign}>
              Assign
            </Button>
          </DialogContent>
        </Dialog>

      </div>
    </AppLayout>
  );
};

export default Employees;