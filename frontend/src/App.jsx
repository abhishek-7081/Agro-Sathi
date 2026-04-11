import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import PageLoader from './components/ui/PageLoader';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { ErrorBoundary } from './ErrorBoundary';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const AIChat = lazy(() => import('./pages/AIChat'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const Alerts = lazy(() => import('./pages/Alerts'));
const CommunityForum = lazy(() => import('./pages/CommunityForum'));
const CropCalendar = lazy(() => import('./pages/CropCalendar'));
const CropMarket = lazy(() => import('./pages/CropMarket'));
const Login = lazy(() => import('./pages/Login'));
const MarketTrends = lazy(() => import('./pages/MarketTrends'));
const Markets = lazy(() => import('./pages/Markets'));
const Prediction = lazy(() => import('./pages/Prediction'));
const Profile = lazy(() => import('./pages/Profile'));
const ProfitCalculator = lazy(() => import('./pages/ProfitCalculator'));
const Register = lazy(() => import('./pages/Register'));
const Schemes = lazy(() => import('./pages/Schemes'));
const SearchResults = lazy(() => import('./pages/SearchResults'));
const ShipmentDashboard = lazy(() => import('./pages/ShipmentDashboard'));
const WeatherForecast = lazy(() => import('./pages/WeatherForecast'));

function AppContent() {
  
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="chat" element={<AIChat />} />
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="alerts" element={<Alerts />} />
            <Route path="forum" element={<CommunityForum />} />
            <Route path="calendar" element={<CropCalendar />} />
            <Route path="crop-market" element={<CropMarket />} />
            <Route path="trends" element={<MarketTrends />} />
            <Route path="markets" element={<Markets />} />
            <Route path="prediction" element={<Prediction />} />
            <Route path="profile" element={<Profile />} />
            <Route path="calculator" element={<ProfitCalculator />} />
            <Route path="schemes" element={<Schemes />} />
            <Route path="search" element={<SearchResults />} />
            <Route path="shipments" element={<ShipmentDashboard />} />
            <Route path="weather" element={<WeatherForecast />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <ThemeProvider>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </ThemeProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;
