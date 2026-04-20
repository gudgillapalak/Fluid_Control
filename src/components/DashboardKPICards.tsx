import { TrendingUp, FolderKanban, CheckCircle2, Clock, Pause } from 'lucide-react';
import { useProjectData } from "@/contexts/ProjectContext";
import { groupStatus } from '@/types/project';

const KPICard = ({
  title, value, icon: Icon, color,
}: {
  title: string; value: string | number; icon: React.ElementType; color: string;
}) => (
  <div className="kpi-card">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
      </div>
      <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="h-6 w-6" />
      </div>
    </div>
  </div>
);

export const DashboardKPICards = () => {
  const { projects } = useProjectData();

  const totalProjects = projects.length || 0;
  const completed = projects.filter((p: any) => groupStatus(p.status) === 'Completed').length;
  const ongoing = projects.filter((p: any) => groupStatus(p.status) === 'Ongoing').length;
  const onHold = projects.filter((p: any) => groupStatus(p.status) === 'On Hold').length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <KPICard title="Total Projects" value={totalProjects} icon={FolderKanban} color="bg-primary/10 text-primary" />
      <KPICard title="Completed" value={completed} icon={CheckCircle2} color="bg-success/10 text-success" />
      <KPICard title="Ongoing" value={ongoing} icon={Clock} color="bg-info/10 text-info" />
      <KPICard title="On Hold" value={onHold} icon={Pause} color="bg-warning/10 text-warning" />
    </div>
  );
};