import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useProjectStore } from '@/stores/projectStore';

export default function Dashboard() {
  const { projects, loading, error, fetchProjects } = useProjectStore();

  React.useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <p className="text-center">読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <p className="text-center text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold mb-8 text-center">ねこねこテクノロジー ダッシュボード</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{project.name}</CardTitle>
                <CardDescription>
                  {project.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium">ステータス</p>
                    <p className="text-sm text-muted-foreground">{project.status}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">進捗</p>
                    <div className="w-full bg-secondary rounded-full h-2.5">
                      <div
                        className="bg-primary h-2.5 rounded-full"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{project.progress}%</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">期間</p>
                    <p className="text-sm text-muted-foreground">
                      {project.startDate} 〜 {project.endDate}
                    </p>
                  </div>
                  <Button className="w-full">詳細を見る</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
