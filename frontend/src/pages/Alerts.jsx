import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import AlertCard from '../components/alerts/AlertCard';
import CreateAlert from '../components/alerts/CreateAlert';
import { getUserAlerts, deleteAlert } from '../services/alert.service';
import Loader from '../components/ui/loader';
import { Bell, Plus, AlertCircle } from 'lucide-react';

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      const data = await getUserAlerts();
      const alertsData = Array.isArray(data) ? data : (data.alerts || []);
      setAlerts(alertsData);
    } catch (error) {
      console.error('Error loading alerts:', error);
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteAlert(id);
      loadAlerts();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 py-8">
      <div className="container mx-auto p-4">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8 animate-fade-in-up">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 bg-clip-text text-transparent">
              🚨 Price Alerts
            </h1>
            <p className="text-gray-600 text-lg">Manage and monitor your price change alerts</p>
          </div>
          
          <Button 
            onClick={() => setShowCreate(true)} 
            className="bg-gradient-to-r from-red-500 to-orange-600 text-white px-8 py-3 rounded-lg font-bold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2 w-fit shadow-md"
          >
            <Plus size={20} />
            Create Alert
          </Button>
        </div>

        {/* Create Alert Modal */}
        {showCreate && (
          <div className="mb-8 animate-fade-in">
            <CreateAlert onClose={() => setShowCreate(false)} onSuccess={loadAlerts} />
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader />
          </div>
        ) : (
          <>
            {/* Empty State */}
            {alerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 rounded-2xl bg-white border-2 border-dashed border-red-200 shadow-sm animate-fade-in">
                <Bell size={64} className="text-red-300 mb-4 opacity-50" />
                <p className="text-2xl font-bold text-gray-700 mb-2">No Price Alerts Yet</p>
                <p className="text-gray-600 mb-6 text-center max-w-md">Create your first price alert to monitor commodity prices and get notified instantly about trends.</p>
                <Button 
                  onClick={() => setShowCreate(true)} 
                  className="bg-gradient-to-r from-red-500 to-orange-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                >
                  <Plus size={18} />
                  Create First Alert
                </Button>
              </div>
            ) : (
              <>
                {/* Stats Bar */}
                <div className="mb-8 p-6 rounded-xl bg-white shadow-sm border border-red-100 flex items-center gap-8 animate-fade-in">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-50 rounded-lg">
                        <AlertCircle size={24} className="text-red-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Active</p>
                        <p className="text-xl font-bold text-red-600">{alerts.length}</p>
                      </div>
                    </div>
                    <div className="w-px h-10 bg-gray-100"></div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-50 rounded-lg">
                        <Bell size={24} className="text-orange-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Triggered</p>
                        <p className="text-xl font-bold text-orange-600">{alerts.filter(a => a.triggered).length}</p>
                      </div>
                    </div>
                </div>

                {/* Alerts Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {alerts.map((alert, index) => (
                    <div key={alert.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                      <AlertCard alert={alert} onDelete={handleDelete} />
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
