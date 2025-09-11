import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Database, Target, Zap, FileText, Brain } from "lucide-react";

// Sample data for demonstrations
const performanceData = [
  { model: 'Random Forest', accuracy: 0.94, precision: 0.92, recall: 0.89 },
  { model: 'XGBoost', accuracy: 0.96, precision: 0.94, recall: 0.91 },
  { model: 'Neural Network', accuracy: 0.91, precision: 0.88, recall: 0.93 },
  { model: 'SVM', accuracy: 0.89, precision: 0.87, recall: 0.85 },
];

const featureImportance = [
  { feature: 'Income', importance: 0.35 },
  { feature: 'Age', importance: 0.28 },
  { feature: 'Education', importance: 0.22 },
  { feature: 'Experience', importance: 0.15 },
];

const trainingProgress = [
  { epoch: 1, loss: 0.8, accuracy: 0.65 },
  { epoch: 5, loss: 0.4, accuracy: 0.78 },
  { epoch: 10, loss: 0.25, accuracy: 0.85 },
  { epoch: 15, loss: 0.15, accuracy: 0.91 },
  { epoch: 20, loss: 0.1, accuracy: 0.94 },
];

const dataDistribution = [
  { category: 'Class A', value: 45, color: '#8B5CF6' },
  { category: 'Class B', value: 30, color: '#06B6D4' },
  { category: 'Class C', value: 25, color: '#10B981' },
];

export const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-primary-gradient bg-clip-text text-transparent">
            Analysis Dashboard
          </h1>
          <p className="text-lg text-muted-foreground">
            Comprehensive insights from your dataset analysis
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-card border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dataset Size</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15,847</div>
              <p className="text-xs text-muted-foreground">rows × 12 columns</p>
            </CardContent>
          </Card>

          <Card className="shadow-card border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Best Model</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">XGBoost</div>
              <p className="text-xs text-muted-foreground">96% accuracy</p>
            </CardContent>
          </Card>

          <Card className="shadow-card border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Training Time</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.3s</div>
              <p className="text-xs text-muted-foreground">automated pipeline</p>
            </CardContent>
          </Card>

          <Card className="shadow-card border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Features</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">4 highly important</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="models">Models</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="data">Data Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-card border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5" />
                    <span>Model Performance Comparison</span>
                  </CardTitle>
                  <CardDescription>Accuracy scores across different algorithms</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="model" stroke="hsl(var(--foreground))" />
                      <YAxis stroke="hsl(var(--foreground))" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }} 
                      />
                      <Legend />
                      <Bar dataKey="accuracy" fill="hsl(var(--primary))" name="Accuracy" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="shadow-card border-border/50">
                <CardHeader>
                  <CardTitle>Training Progress</CardTitle>
                  <CardDescription>Model accuracy improvement over epochs</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={trainingProgress}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="epoch" stroke="hsl(var(--foreground))" />
                      <YAxis stroke="hsl(var(--foreground))" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }} 
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="accuracy" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={3}
                        dot={{ fill: 'hsl(var(--primary))' }}
                        name="Accuracy"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="models" className="space-y-6">
            <Card className="shadow-card border-border/50">
              <CardHeader>
                <CardTitle>Model Comparison</CardTitle>
                <CardDescription>Detailed performance metrics for all trained models</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {performanceData.map((model, index) => (
                    <div key={model.model} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <div>
                          <h4 className="font-medium">{model.model}</h4>
                          {index === 1 && <Badge className="mt-1 bg-primary-gradient">Best Performance</Badge>}
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-right">
                        <div>
                          <p className="text-sm text-muted-foreground">Accuracy</p>
                          <p className="font-medium">{(model.accuracy * 100).toFixed(1)}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Precision</p>
                          <p className="font-medium">{(model.precision * 100).toFixed(1)}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Recall</p>
                          <p className="font-medium">{(model.recall * 100).toFixed(1)}%</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features" className="space-y-6">
            <Card className="shadow-card border-border/50">
              <CardHeader>
                <CardTitle>Feature Importance</CardTitle>
                <CardDescription>Which features contribute most to model predictions</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={featureImportance} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" stroke="hsl(var(--foreground))" />
                    <YAxis dataKey="feature" type="category" stroke="hsl(var(--foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }} 
                    />
                    <Bar dataKey="importance" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-card border-border/50">
                <CardHeader>
                  <CardTitle>Data Distribution</CardTitle>
                  <CardDescription>Class distribution in your dataset</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={dataDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ category, value }) => `${category}: ${value}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {dataDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="shadow-card border-border/50">
                <CardHeader>
                  <CardTitle>Data Quality Report</CardTitle>
                  <CardDescription>Overview of data quality metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Missing Values</span>
                    <Badge variant="outline">0.3%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Duplicate Rows</span>
                    <Badge variant="outline">1.2%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Outliers Detected</span>
                    <Badge variant="outline">2.1%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Data Completeness</span>
                    <Badge className="bg-green-500">98.5%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Feature Correlations</span>
                    <Badge className="bg-blue-500">High</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};