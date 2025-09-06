'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Settings, 
  Save,
  ArrowLeft,
  Globe,
  Shield,
  Mail,
  Bell,
  Database,
  Palette,
  Users,
  Package,
  MessageSquare,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { useUser } from '../../../contexts/UserContext';
import { useToast } from '../../../contexts/ToastContext';

interface AdminSettings {
  general: {
    siteName: string;
    siteDescription: string;
    maintenanceMode: boolean;
    allowRegistration: boolean;
    requireEmailVerification: boolean;
  };
  security: {
    maxLoginAttempts: number;
    sessionTimeout: number;
    requireStrongPasswords: boolean;
    enableTwoFactor: boolean;
  };
  email: {
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    enableEmailNotifications: boolean;
  };
  notifications: {
    enablePushNotifications: boolean;
    enableEmailDigests: boolean;
    notifyAdminsOnNewUser: boolean;
    notifyAdminsOnReports: boolean;
  };
  marketplace: {
    allowAnonymousItems: boolean;
    requireItemApproval: boolean;
    maxImagesPerItem: number;
    maxItemPrice: number;
    autoMarkSoldAfterDays: number;
  };
  moderation: {
    autoModerateContent: boolean;
    flaggedWordThreshold: number;
    autoHideReportedItems: boolean;
    requireApprovalForNewUsers: boolean;
  };
}

export default function AdminSettingsPage() {
  const { user, loading } = useUser();
  const { addToast } = useToast();
  const router = useRouter();
  const [settings, setSettings] = useState<AdminSettings>({
    general: {
      siteName: 'XMarket',
      siteDescription: 'University Marketplace Platform',
      maintenanceMode: false,
      allowRegistration: true,
      requireEmailVerification: true,
    },
    security: {
      maxLoginAttempts: 5,
      sessionTimeout: 24,
      requireStrongPasswords: true,
      enableTwoFactor: false,
    },
    email: {
      smtpHost: 'smtp.gmail.com',
      smtpPort: 587,
      smtpUser: '',
      enableEmailNotifications: true,
    },
    notifications: {
      enablePushNotifications: true,
      enableEmailDigests: true,
      notifyAdminsOnNewUser: true,
      notifyAdminsOnReports: true,
    },
    marketplace: {
      allowAnonymousItems: false,
      requireItemApproval: false,
      maxImagesPerItem: 5,
      maxItemPrice: 10000,
      autoMarkSoldAfterDays: 30,
    },
    moderation: {
      autoModerateContent: true,
      flaggedWordThreshold: 3,
      autoHideReportedItems: true,
      requireApprovalForNewUsers: false,
    }
  });
  const [activeTab, setActiveTab] = useState('general');
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !isAdmin(user))) {
      router.push('/admin');
      return;
    }

    if (user && isAdmin(user)) {
      loadSettings();
    }
  }, [user, loading, router]);

  const isAdmin = (user: any) => {
    return user?.email === 'admin@example.com' || user?.role === 'admin' || user?.isAdmin === true;
  };

  const loadSettings = async () => {
    // In a real app, load settings from backend
    // For now, we use the initial state
  };

  const handleSettingChange = (section: keyof AdminSettings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
    setHasChanges(true);
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      // In a real app, save settings to backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      addToast('Settings saved successfully', 'success');
      setHasChanges(false);
    } catch (error) {
      console.error('Failed to save settings:', error);
      addToast('Failed to save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'general', name: 'General', icon: Globe },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'email', name: 'Email', icon: Mail },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'marketplace', name: 'Marketplace', icon: Package },
    { id: 'moderation', name: 'Moderation', icon: AlertTriangle },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Site Name
              </label>
              <input
                type="text"
                value={settings.general.siteName}
                onChange={(e) => handleSettingChange('general', 'siteName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Site Description
              </label>
              <textarea
                value={settings.general.siteDescription}
                onChange={(e) => handleSettingChange('general', 'siteDescription', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Maintenance Mode</label>
                  <p className="text-sm text-gray-500">Temporarily disable public access</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.general.maintenanceMode}
                  onChange={(e) => handleSettingChange('general', 'maintenanceMode', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Allow Registration</label>
                  <p className="text-sm text-gray-500">Allow new users to create accounts</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.general.allowRegistration}
                  onChange={(e) => handleSettingChange('general', 'allowRegistration', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Require Email Verification</label>
                  <p className="text-sm text-gray-500">Users must verify their email to complete registration</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.general.requireEmailVerification}
                  onChange={(e) => handleSettingChange('general', 'requireEmailVerification', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Login Attempts
              </label>
              <input
                type="number"
                value={settings.security.maxLoginAttempts}
                onChange={(e) => handleSettingChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
                min={1}
                max={10}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Timeout (hours)
              </label>
              <input
                type="number"
                value={settings.security.sessionTimeout}
                onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                min={1}
                max={168}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Require Strong Passwords</label>
                  <p className="text-sm text-gray-500">Enforce password complexity requirements</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.security.requireStrongPasswords}
                  onChange={(e) => handleSettingChange('security', 'requireStrongPasswords', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Enable Two-Factor Authentication</label>
                  <p className="text-sm text-gray-500">Require 2FA for admin accounts</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.security.enableTwoFactor}
                  onChange={(e) => handleSettingChange('security', 'enableTwoFactor', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
            </div>
          </div>
        );

      case 'marketplace':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Images per Item
              </label>
              <input
                type="number"
                value={settings.marketplace.maxImagesPerItem}
                onChange={(e) => handleSettingChange('marketplace', 'maxImagesPerItem', parseInt(e.target.value))}
                min={1}
                max={10}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Item Price ($)
              </label>
              <input
                type="number"
                value={settings.marketplace.maxItemPrice}
                onChange={(e) => handleSettingChange('marketplace', 'maxItemPrice', parseInt(e.target.value))}
                min={1}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Auto-mark as Sold After (days)
              </label>
              <input
                type="number"
                value={settings.marketplace.autoMarkSoldAfterDays}
                onChange={(e) => handleSettingChange('marketplace', 'autoMarkSoldAfterDays', parseInt(e.target.value))}
                min={1}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Allow Anonymous Items</label>
                  <p className="text-sm text-gray-500">Let users post items without showing their identity</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.marketplace.allowAnonymousItems}
                  onChange={(e) => handleSettingChange('marketplace', 'allowAnonymousItems', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Require Item Approval</label>
                  <p className="text-sm text-gray-500">All new items must be approved by admin</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.marketplace.requireItemApproval}
                  onChange={(e) => handleSettingChange('marketplace', 'requireItemApproval', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
            </div>
          </div>
        );

      case 'moderation':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Flagged Word Threshold
              </label>
              <input
                type="number"
                value={settings.moderation.flaggedWordThreshold}
                onChange={(e) => handleSettingChange('moderation', 'flaggedWordThreshold', parseInt(e.target.value))}
                min={1}
                max={10}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">Number of flagged words before auto-moderation</p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Auto-Moderate Content</label>
                  <p className="text-sm text-gray-500">Automatically flag inappropriate content</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.moderation.autoModerateContent}
                  onChange={(e) => handleSettingChange('moderation', 'autoModerateContent', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Auto-Hide Reported Items</label>
                  <p className="text-sm text-gray-500">Hide items after multiple reports</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.moderation.autoHideReportedItems}
                  onChange={(e) => handleSettingChange('moderation', 'autoHideReportedItems', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Require Approval for New Users</label>
                  <p className="text-sm text-gray-500">Admin must approve new user registrations</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.moderation.requireApprovalForNewUsers}
                  onChange={(e) => handleSettingChange('moderation', 'requireApprovalForNewUsers', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
            </div>
          </div>
        );

      default:
        return <div>Tab content not implemented yet.</div>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/admin')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
                <p className="text-gray-600">Configure platform settings and preferences</p>
              </div>
            </div>
            <button
              onClick={saveSettings}
              disabled={!hasChanges || saving}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                hasChanges && !saving
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {saving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="flex">
            {/* Sidebar */}
            <div className="w-64 bg-gray-50 border-r border-gray-200">
              <nav className="p-4 space-y-1">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <IconComponent className="h-5 w-5" />
                      <span>{tab.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Content */}
            <div className="flex-1 p-6">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 capitalize">
                  {activeTab} Settings
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Configure {activeTab} related options and preferences.
                </p>
              </div>

              {renderTabContent()}
            </div>
          </div>
        </div>

        {/* Status Notice */}
        {hasChanges && (
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-800">
                You have unsaved changes. Don't forget to save your settings.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
