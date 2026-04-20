import { AppLayout } from '@/components/AppLayout';
import { useProfiles, useUserRoles, useProjects } from '@/hooks/useProjects';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { groupStatus } from '@/types/project';

const Managers = () => {
  const { data: profiles } = useProfiles();
  const { data: roles } = useUserRoles();
  const { data: projects } = useProjects();

  const managerIds = roles?.filter((r) => r.role === 'manager' || r.role === 'admin').map((r) => r.user_id) || [];
  const managers = profiles?.filter((p) => managerIds.includes(p.id)) || [];

  // Also show unique project_owner names from imported data
  const ownerNames = [...new Set(projects?.map((p) => (p as any).project_owner).filter(Boolean) || [])];

  const getManagerProjects = (managerId: string) => projects?.filter((p) => p.manager_id === managerId) || [];

  const getOwnerProjects = (ownerName: string) => projects?.filter((p) => (p as any).project_owner === ownerName) || [];

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Managers / Owners</h1>
          <p className="text-muted-foreground mt-1">View all project owners and their projects</p>
        </div>

        {/* Project Owners from Excel */}
        {ownerNames.length > 0 && (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project Owner (from Excel)</TableHead>
                    <TableHead>Total Projects</TableHead>
                    <TableHead>Completed</TableHead>
                    <TableHead>Ongoing</TableHead>
                    <TableHead>On Hold</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ownerNames.map((owner) => {
                    const oProjects = getOwnerProjects(owner);
                    return (
                      <TableRow key={owner}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                {owner.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{owner}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{oProjects.length}</TableCell>
                        <TableCell><Badge variant="outline" className="bg-success/10 text-success border-success/20">{oProjects.filter(p => groupStatus(p.status) === 'Completed').length}</Badge></TableCell>
                        <TableCell><Badge variant="outline" className="bg-info/10 text-info border-info/20">{oProjects.filter(p => groupStatus(p.status) === 'Ongoing').length}</Badge></TableCell>
                        <TableCell><Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">{oProjects.filter(p => groupStatus(p.status) === 'On Hold').length}</Badge></TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* System Users with Manager role */}
        {managers.length > 0 && (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>System User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Assigned Projects</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {managers.map((m) => {
                    const mProjects = getManagerProjects(m.id);
                    return (
                      <TableRow key={m.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                {(m.full_name || '?').slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{m.full_name || 'Unknown'}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{m.email}</TableCell>
                        <TableCell className="font-medium">{mProjects.length}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default Managers;
