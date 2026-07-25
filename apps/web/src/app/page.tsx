"use client";

import React, { useEffect } from "react";
import { useForgeStore } from "@/stores/useStore";
import LandingPage from "@/components/LandingPage";
import OnboardingFlow from "@/components/OnboardingFlow";
import AuthModal from "@/components/AuthModal";
import Sidebar from "@/components/Sidebar";
import AIAssistant from "@/components/AIAssistant";
import { Loader2 } from "lucide-react";

// Import all Module views
import DashboardModule from "@/components/DashboardModule";
import IdeaExchangeModule from "@/components/IdeaExchangeModule";
import FounderMatchingModule from "@/components/FounderMatchingModule";
import StartupCreationModule from "@/components/StartupCreationModule";
import BuilderMarketplaceModule from "@/components/BuilderMarketplaceModule";
import CapitalMarketplaceModule from "@/components/CapitalMarketplaceModule";
import DataIntelligenceModule from "@/components/DataIntelligenceModule";
import ServicesMarketplaceModule from "@/components/ServicesMarketplaceModule";
import WorkspaceModule from "@/components/WorkspaceModule";
import SyndicatesModule from "@/components/SyndicatesModule";
import ValidationOSModule from "@/components/ValidationOSModule";
import AcquisitionMarketplaceModule from "@/components/AcquisitionMarketplaceModule";
import MentorModule from "@/components/MentorModule";
import AdminModule from "@/components/AdminModule";

export default function Home() {
  const { 
    activeModule, 
    viewMode, 
    isLoggedIn, 
    isAuthInitializing, 
    initializeAuth,
    setShowAuthModal
  } = useForgeStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const renderModule = () => {
    switch (activeModule) {
      case "dashboard":
        return <DashboardModule />;
      case "idea-exchange":
        return <IdeaExchangeModule />;
      case "founder-matching":
        return <FounderMatchingModule />;
      case "startup-creation":
        return <StartupCreationModule />;
      case "validation-os":
        return <ValidationOSModule />;
      case "builder-marketplace":
        return <BuilderMarketplaceModule />;
      case "capital-marketplace":
        return <CapitalMarketplaceModule />;
      case "data-intelligence":
        return <DataIntelligenceModule />;
      case "services-marketplace":
        return <ServicesMarketplaceModule />;
      case "founder-os":
        return <WorkspaceModule />;
      case "syndicates":
        return <SyndicatesModule />;
      case "acquisition-marketplace":
        return <AcquisitionMarketplaceModule />;
      case "mentor-hub":
        return <MentorModule />;
      case "admin-os":
        return <AdminModule />;
      default:
        return <DashboardModule />;
    }
  };

  // 1. Loading State while checking authentication
  if (isAuthInitializing) {
    return (
      <div className="h-screen w-screen bg-white flex flex-col items-center justify-center space-y-3">
        <div className="h-10 w-10 rounded-xl bg-purple-600 flex items-center justify-center font-bold text-white text-xl shadow-md">
          F
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-neutral-600">
          <Loader2 className="animate-spin text-purple-600" size={16} />
          <span>Restoring Forge OS Session...</span>
        </div>
      </div>
    );
  }

  // 2. Protected Route Guard: If in app view but not logged in, show Landing Page with Auth Modal
  if (viewMode === "app" && !isLoggedIn) {
    return (
      <>
        <AuthModal />
        <OnboardingFlow />
        <LandingPage />
      </>
    );
  }

  // 3. Render SaaS Landing Page view
  if (viewMode === "landing" && !isLoggedIn) {
    return (
      <>
        <AuthModal />
        <OnboardingFlow />
        <LandingPage />
      </>
    );
  }

  // 4. Render Authenticated App Workspace view
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-neutral-50/50">
      {/* Auth & Onboarding Overlays */}
      <AuthModal />
      <OnboardingFlow />

      {/* Persistent Left Sidebar */}
      <Sidebar />

      {/* Main Viewport */}
      <main className="flex-1 overflow-y-auto px-8 py-6 h-screen">
        {renderModule()}
      </main>

      {/* Persistent Context-Aware Right AI Copilot */}
      <AIAssistant />
    </div>
  );
}
