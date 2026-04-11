import { useEffect, useState } from 'react';
import { getAnalytics } from '../services/admin.service';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    getAnalytics().then(setAnalytics).catch(err => console.error('Failed to load analytics', err));
  }, []);

  if (!analytics) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  );

  return (
    <div className="container mx-auto p-4 animate-fade-in">
      <h1 className="text-3xl font-bold mb-8 text-primary-900">Admin Analytics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {[
          { label: 'Total Users', value: analytics.totalUsers, color: 'text-blue-600' },
          { label: 'Active Schemes', value: analytics.activeSchemes, color: 'text-emerald-600' },
          { label: 'Active Alerts', value: analytics.activeAlerts, color: 'text-orange-600' },
          { label: 'Applications', value: analytics.totalApplications, color: 'text-purple-600' }
        ].map((stat, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wider">{stat.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>User Registrations (Last 30 days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.registrations}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="date" tick={{fontSize: 12}} />
                  <YAxis tick={{fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="count" fill="#0D7377" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Top Commodities Searched</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topCommodities.map((c, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="font-medium text-slate-700">{c.commodity}</span>
                  <span className="px-3 py-1 rounded-full bg-primary-100 text-primary-700 font-bold text-sm">
                    {c.count} searches
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}