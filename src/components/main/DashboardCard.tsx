'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Users, Package, BarChart3, Activity } from 'lucide-react';

const dashboardData = [
  {
    title: 'Total Users',
    value: '12,345',
    description: 'Active users in the last 30 days',
    trend: '+12.5%',
    trendUp: true,
    icon: Users,
  },
  {
    title: 'Total Products',
    value: '1,234',
    description: 'Products in your catalog',
    trend: '-2.1%',
    trendUp: false,
    icon: Package,
  },
  {
    title: 'Monthly Revenue',
    value: '$45,678',
    description: 'Revenue for this month',
    trend: '+8.3%',
    trendUp: true,
    icon: BarChart3,
  },
  {
    title: 'Active Sessions',
    value: '2,456',
    description: 'Current active user sessions',
    trend: '+4.5%',
    trendUp: true,
    icon: Activity,
  },
];

export function DashboardCards() {
  return (
    <div className="space-y-6">
      <div className="px-4 lg:px-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's an overview of your platform's performance.</p>
        </div>
      </div>

      <div className="grid gap-4 px-4 lg:px-6 md:grid-cols-2 lg:grid-cols-4">
        {dashboardData.map((item, index) => {
          const Icon = item.icon;
          return (
            <Card key={index} className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{item.value}</div>
                <div className="flex items-center space-x-2 text-xs">
                  <Badge variant={item.trendUp ? 'default' : 'secondary'} className={`flex items-center gap-1 ${item.trendUp ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {item.trendUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {item.trend}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-2">{item.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 px-4 lg:px-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Overview of recent platform activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New user registration</p>
                  <p className="text-xs text-muted-foreground">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Product catalog updated</p>
                  <p className="text-xs text-muted-foreground">15 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">System maintenance completed</p>
                  <p className="text-xs text-muted-foreground">1 hour ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <button className="flex items-center justify-start space-x-2 rounded-md border p-2 hover:bg-accent transition-colors">
              <Users className="h-4 w-4" />
              <span className="text-sm">Manage Users</span>
            </button>
            <button className="flex items-center justify-start space-x-2 rounded-md border p-2 hover:bg-accent transition-colors">
              <Package className="h-4 w-4" />
              <span className="text-sm">Add Product</span>
            </button>
            <button className="flex items-center justify-start space-x-2 rounded-md border p-2 hover:bg-accent transition-colors">
              <BarChart3 className="h-4 w-4" />
              <span className="text-sm">View Analytics</span>
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
