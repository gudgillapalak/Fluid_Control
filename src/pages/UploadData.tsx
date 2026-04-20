import { useState, useCallback, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileSpreadsheet, CheckCircle2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// ✅ CONTEXT
import { useProjectData } from "@/contexts/ProjectContext";

interface ParsedRow {
  msn: string;
  dev_number: string;
  category: string;
  project_name: string;
  scope: string;
  customer_name: string;
  project_owner: string;
  start_date: string;
  end_date: string;
  risk_classification: string;
  status: string;
  remarks: string;
}

const parseExcelDate = (val: any): string | null => {
  if (!val) return null;
  if (val instanceof Date) return val.toISOString().split('T')[0];
  const s = String(val).trim();
  if (s === '-' || s.toLowerCase() === 'when needed' || s === '') return null;
  const d = new Date(s);
  if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
  return null;
};

const UploadData = () => {
  const { toast } = useToast();

  // ✅ FIXED CONTEXT (INSIDE COMPONENT)
  const { projects, setProjects } = useProjectData();

  const [parsedData, setParsedData] = useState<ParsedRow[]>([]);
  const [uploaded, setUploaded] = useState(false);

  // ✅ LOAD DATA AGAIN WHEN PAGE OPENS
  useEffect(() => {
  if (projects && projects.length > 0) {
    const preview = projects.map((p: any, index: number) => ({
      msn: String(index + 1),
      dev_number: '',
      category: p.category,
      project_name: p.project_name,
      scope: '',
      customer_name: '',
      project_owner: p.project_owner,
      start_date: p.start_date || '',
      end_date: p.end_date || '',
      risk_classification: '',
      status: p.status,
      remarks: '',
    }));

    setParsedData(preview);
    setUploaded(true);
  }
}, [projects]);

  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (evt) => {
      try {
        const wb = XLSX.read(evt.target?.result, { type: 'binary' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json<any>(ws);

        const rows: ParsedRow[] = json.map((row: any) => ({
          msn: String(row['M.S.N'] || row['Sr.No.'] || ''),
          dev_number: row['DEVELOPMENT NUMBER'] || row['Project Number (Earlier Development Number)'] || '',
          category: row['Product Catogory'] || row['Product Category'] || row['Project Category'] || '',
          project_name: row[' Title of Project'] || row['Title of Project'] || row['Project Name'] || row['project_name'] || '',
          scope: row['Scope Of Development'] || row['High Level Scope Of Project'] || row['Scope of Development'] || '',
          customer_name: row['Customer Name'] || row['Lead Customer Name'] || '',
          project_owner: row['PROJECT OWNER'] || row['Project Leader'] || row['Engineering Leader (Old Project Owner)'] || row['Manager Name'] || '',
          start_date: String(row['DATE OF START'] || row['Planned Start Date'] || row['Start Date'] || ''),
          end_date: String(row['TARGET DATE'] || row['Target Completion Date'] || row['End Date'] || ''),
          risk_classification: row['Major/ Customer Specific'] || row['Project Risk Classification'] || '',
          status: String(row['Status'] || row['Overall Status'] || '').trim(),
          remarks: row['Remarks'] || row['Description'] || '',
        }));

        const filtered = rows.filter(r => r.project_name);

        // ✅ PREVIEW
        setParsedData(filtered);
        setUploaded(true);

        // 🔥 FORMAT FOR DASHBOARD
        const formatted = filtered.map((row, index) => ({
          id: index + 1,
          project_name: row.project_name,
          status: row.status || "Ongoing",
          start_date: parseExcelDate(row.start_date),
          end_date: parseExcelDate(row.end_date),
          project_owner: row.project_owner || "Unknown",
          category: row.category || "General",
        }));

        console.log("SAVING PROJECTS:", formatted); // 🔥 DEBUG

        // 🔥 SAVE DATA (CONTEXT + LOCALSTORAGE)
        setProjects(formatted);

        toast({
          title: `Loaded ${formatted.length} projects successfully`,
        });

      } catch (err) {
        toast({
          title: 'Failed to parse file',
          variant: 'destructive',
        });
      }
    };

    reader.readAsBinaryString(file);
  }, [toast, setProjects]);

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">

        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Upload Data</h1>
          <p className="text-muted-foreground mt-1">Import projects from Excel or CSV files</p>
        </div>

        {/* Upload Box */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-primary" />
              Import Projects
            </CardTitle>
            <CardDescription>Upload your Excel file</CardDescription>
          </CardHeader>

          <CardContent>
            <div className="border-2 border-dashed rounded-xl p-8 text-center">
              <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />

              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFile}
                className="hidden"
                id="file-upload"
              />

              <Button onClick={() => document.getElementById('file-upload')?.click()}>
                Choose File
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Preview */}
        {parsedData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>
                Preview ({parsedData.length} projects)
              </CardTitle>
            </CardHeader>

            <CardContent className="p-0">
              <div className="overflow-auto max-h-[500px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>Project Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {parsedData.map((row, i) => (
                      <TableRow key={i}>
                        <TableCell>{row.msn}</TableCell>
                        <TableCell>{row.project_name}</TableCell>
                        <TableCell>{row.category}</TableCell>
                        <TableCell>{row.project_owner}</TableCell>
                        <TableCell>{row.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>

                </Table>
              </div>
            </CardContent>
          </Card>
        )}

      </div>
    </AppLayout>
  );
};

export default UploadData;