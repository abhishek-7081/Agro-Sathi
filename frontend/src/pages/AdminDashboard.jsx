import { useEffect, useState } from 'react';
import { getAnalytics } from '../services/admin.service';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    getAnalytics().then(setAnalytics);
  }, []);

  if (!analytics) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Admin Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader><CardTitle>Total Users</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{analytics.totalUsers}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Active Schemes</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{analytics.activeSchemes}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Active Alerts</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{analytics.activeAlerts}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Applications</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{analytics.totalApplications}</p></CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>User Registrations (Last 30 days)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.registrations}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Top Commodities Searched</CardTitle></CardHeader>
          <CardContent>
            <ul>
              {analytics.topCommodities.map((c, i) => (
                <li key={i} className="flex justify-between py-1">
                  <span>{c.commodity}</span>
                  <span className="font-semibold">{c.count}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}