import { AppLayout } from '@/components/AppLayout';
import { DashboardKPICards } from '@/components/DashboardKPICards';
import { DashboardCharts } from '@/components/DashboardCharts';
import { DataContext } from "../contexts/DataContext";

const Dashboard = () => {
  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of your project management data</p>
        </div>
        <DashboardKPICards />
        <DashboardCharts />
      </div>
    </AppLayout>
  );
};




export default Dashboard;
