import { AppLayout } from '@/components/AppLayout';
import { useActivityLog, useProfiles } from '@/hooks/useProjects';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

const ActivityLog = () => {
  const { data: logs } = useActivityLog();
  const { data: profiles } = useProfiles();

  const getUserName = (id: string | null) => {
    if (!id || !profiles) return 'System';
    return profiles.find((p) => p.id === id)?.full_name || 'Unknown';
  };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Activity Log</h1>
          <p className="text-muted-foreground mt-1">Track all changes and actions</p>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Entity</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!logs || logs.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No activity recorded yet</TableCell></TableRow>
                ) : (
                  logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{getUserName(log.user_id)}</TableCell>
                      <TableCell><Badge variant="outline">{log.action}</Badge></TableCell>
                      <TableCell className="text-muted-foreground capitalize">{log.entity_type}</TableCell>
                      <TableCell className="text-muted-foreground">{format(new Date(log.created_at), 'MMM d, yyyy HH:mm')}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default ActivityLog;
