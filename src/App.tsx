import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { I18nProvider } from './context/I18nContext';
import { AutoTranslateLayer } from './components/common/AutoTranslateLayer';
import { AppErrorBoundary } from './components/common/AppErrorBoundary';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { SoilAnalysisPage } from './pages/SoilAnalysisPage';
import { CropRecommendationPage } from './pages/CropRecommendationPage';
import { FertilizerRecommendationPage } from './pages/FertilizerRecommendationPage';
import { PesticideRecommendationPage } from './pages/PesticideRecommendationPage';
import { YieldPredictionPage } from './pages/YieldPredictionPage';
import { MarketAnalysisPage } from './pages/MarketAnalysisPage';
import { ProfitCalculatorPage } from './pages/ProfitCalculatorPage';
import { ScenarioSimulatorPage } from './pages/ScenarioSimulatorPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';

export default function App() {
  return (
    <I18nProvider>
      <AutoTranslateLayer>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
          {/* Public Routes */}
          <Route path="/" element={<AppErrorBoundary><LandingPage /></AppErrorBoundary>} />
          <Route path="/login" element={<AppErrorBoundary><LoginPage /></AppErrorBoundary>} />
          <Route path="/register" element={<AppErrorBoundary><RegisterPage /></AppErrorBoundary>} />
          <Route path="/forgot-password" element={<AppErrorBoundary><ForgotPasswordPage /></AppErrorBoundary>} />
          <Route path="/reset-password" element={<AppErrorBoundary><ResetPasswordPage /></AppErrorBoundary>} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AppErrorBoundary><DashboardPage /></AppErrorBoundary>
              </ProtectedRoute>
            }
          />
          <Route
            path="/soil-analysis"
            element={
              <ProtectedRoute>
                <AppErrorBoundary><SoilAnalysisPage /></AppErrorBoundary>
              </ProtectedRoute>
            }
          />
          <Route
            path="/crop-recommendation"
            element={
              <ProtectedRoute>
                <AppErrorBoundary><CropRecommendationPage /></AppErrorBoundary>
              </ProtectedRoute>
            }
          />
          <Route
            path="/fertilizer-recommendation"
            element={
              <ProtectedRoute>
                <AppErrorBoundary><FertilizerRecommendationPage /></AppErrorBoundary>
              </ProtectedRoute>
            }
          />
          <Route
            path="/pesticide-recommendation"
            element={
              <ProtectedRoute>
                <AppErrorBoundary><PesticideRecommendationPage /></AppErrorBoundary>
              </ProtectedRoute>
            }
          />
          <Route
            path="/yield-prediction"
            element={
              <ProtectedRoute>
                <AppErrorBoundary><YieldPredictionPage /></AppErrorBoundary>
              </ProtectedRoute>
            }
          />
          <Route
            path="/market-analysis"
            element={
              <ProtectedRoute>
                <AppErrorBoundary><MarketAnalysisPage /></AppErrorBoundary>
              </ProtectedRoute>
            }
          />
          <Route
            path="/market"
            element={
              <ProtectedRoute>
                <AppErrorBoundary><MarketAnalysisPage /></AppErrorBoundary>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profit-calculator"
            element={
              <ProtectedRoute>
                <AppErrorBoundary><ProfitCalculatorPage /></AppErrorBoundary>
              </ProtectedRoute>
            }
          />
          <Route
            path="/scenario-simulator"
            element={
              <ProtectedRoute>
                <AppErrorBoundary><ScenarioSimulatorPage /></AppErrorBoundary>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <AppErrorBoundary><ProfilePage /></AppErrorBoundary>
              </ProtectedRoute>
            }
          />
          {/* Keep old bookmarks working while consolidating Settings into Profile. */}
          <Route path="/settings" element={<Navigate to="/profile" replace />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
      </AutoTranslateLayer>
    </I18nProvider>
  );
}
