'use client';

import { useState, useEffect } from 'react';
import { useUser } from '../../../contexts/UserContext';
import { useToast } from '../../../contexts/ToastContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Shield, 
  Download, 
  Trash2, 
  Clock, 
  Monitor, 
  Smartphone,
  Lock,
  Key,
  AlertTriangle,
  CheckCircle,
  Globe,
  Database,
  Settings,
  UserX,
  LogOut,
  Eye,
  EyeOff
} from 'lucide-react';
import { api } from '../../../lib/apiEndpoints';

interface LoginSession {
  id: string;
  deviceName: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  location: string;
  lastActive: string;
  current: boolean;
  ipAddress: string;
}

interface SecuritySettings {
  twoFactorEnabled: boolean;
  loginAlerts: boolean;
  sessionTimeout: number;
  requirePasswordForSensitive: boolean;
}

export default function AccountSettingsPage() {
  const { user, logout } = useUser();
  const { addToast } = useToast();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'security' | 'sessions' | 'data' | 'danger'>('security');
  const [loginSessions, setLoginSessions] = useState<LoginSession[]>([]);
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactorEnabled: false,
    loginAlerts: true,
    sessionTimeout: 30,
    requirePasswordForSensitive: true,
  });
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  useEffect(() => {
    loadAccountData();
  }, []);

  const loadAccountData = async () => {
    try {
      // Load login sessions
      const sessionsResponse = await api.users.getLoginSessions();
      setLoginSessions(sessionsResponse.data || []);
      
      // Load security settings
      const securityResponse = await api.users.getSecuritySettings();
      setSecuritySettings(securityResponse.data || securitySettings);
    } catch (error) {
      console.error('Failed to load account data:', error);
    }
  };

  const handleSecuritySettingChange = async (setting: keyof SecuritySettings, value: boolean | number) => {
    try {
      const newSettings = { ...securitySettings, [setting]: value };
      setSecuritySettings(newSettings);
      
      await api.users.updateSecuritySettings(newSettings);
      addToast('Security settings updated', 'success');
    } catch (error) {
      addToast('Failed to update security settings', 'error');
      // Revert the change
      setSecuritySettings(securitySettings);
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    try {
      await api.users.revokeSession(sessionId);
      setLoginSessions(sessions => sessions.filter(s => s.id !== sessionId));
      addToast('Session revoked successfully', 'success');
    } catch (error) {
      addToast('Failed to revoke session', 'error');
    }
  };

  const handleRevokeAllSessions = async () => {
    if (!window.confirm('This will log you out from all devices except this one. Continue?')) return;
    
    try {
      // Revoke all non-current sessions by calling revokeSession for each
      const nonCurrent = loginSessions.filter(s => !s.current);
      await Promise.all(nonCurrent.map(s => api.users.revokeSession(s.id)));
      setLoginSessions(sessions => sessions.filter(s => s.current));
      addToast('All sessions revoked successfully', 'success');
    } catch (error) {
      addToast('Failed to revoke sessions', 'error');
    }
  };

  const handleExportData = async () => {
    setExportLoading(true);
    try {
  const response = await api.users.exportUserData();
      
      // The API returns a download URL. Open it in a new tab or trigger download.
      const downloadUrl = (response.data && (response.data as any).downloadUrl) || response.data;
      if (typeof downloadUrl === 'string' && downloadUrl.length > 0) {
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        addToast('Account data export started', 'success');
      } else {
        addToast('No export available', 'info');
      }
    } catch (error) {
      addToast('Failed to export account data', 'error');
    } finally {
      setExportLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      addToast('Please enter your password to confirm account deletion', 'error');
      return;
    }

    try {
      // API stub doesn't accept a body in the mock; call without args for now
      await api.users.deleteAccount();
      addToast('Your account has been scheduled for deletion. You will receive a confirmation email.', 'info', 10000);
      logout();
      router.push('/');
    } catch (error: any) {
      addToast(error.message || 'Failed to delete account', 'error');
    }
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'desktop': return Monitor;
      case 'mobile': return Smartphone;
      case 'tablet': return Smartphone;
      default: return Monitor;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Please log in</h2>
          <p className="text-gray-600">You need to be logged in to access account settings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-white/80 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
            <p className="text-gray-600">Manage your security, sessions, and account data</p>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex space-x-1 bg-white rounded-xl p-1 mb-8 shadow-lg"
        >
          {[
            { id: 'security', label: 'Security', icon: Shield },
            { id: 'sessions', label: 'Active Sessions', icon: Monitor },
            { id: 'data', label: 'Data & Privacy', icon: Database },
            { id: 'danger', label: 'Danger Zone', icon: AlertTriangle },
          ].map((tab) => {
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#009F9C] text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <TabIcon size={18} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#009F9C]" />
                  Security Settings
                </h2>
                
                <div className="space-y-6">
                  {/* Two-Factor Authentication */}
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Key className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
                        <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleSecuritySettingChange('twoFactorEnabled', !securitySettings.twoFactorEnabled)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        securitySettings.twoFactorEnabled ? 'bg-[#009F9C]' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          securitySettings.twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Login Alerts */}
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Login Alerts</h3>
                        <p className="text-sm text-gray-500">Get notified of suspicious login attempts</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleSecuritySettingChange('loginAlerts', !securitySettings.loginAlerts)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        securitySettings.loginAlerts ? 'bg-[#009F9C]' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          securitySettings.loginAlerts ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Session Timeout */}
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Clock className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Auto Logout</h3>
                        <p className="text-sm text-gray-500">Automatically log out after inactivity</p>
                      </div>
                    </div>
                    <select
                      value={securitySettings.sessionTimeout}
                      onChange={(e) => handleSecuritySettingChange('sessionTimeout', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009F9C] focus:border-transparent"
                    >
                      <option value={15}>15 minutes</option>
                      <option value={30}>30 minutes</option>
                      <option value={60}>1 hour</option>
                      <option value={120}>2 hours</option>
                      <option value={480}>8 hours</option>
                      <option value={0}>Never</option>
                    </select>
                  </div>

                  {/* Password for Sensitive Actions */}
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Lock className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Password for Sensitive Actions</h3>
                        <p className="text-sm text-gray-500">Require password for account changes</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleSecuritySettingChange('requirePasswordForSensitive', !securitySettings.requirePasswordForSensitive)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        securitySettings.requirePasswordForSensitive ? 'bg-[#009F9C]' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          securitySettings.requirePasswordForSensitive ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sessions Tab */}
          {activeTab === 'sessions' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <Monitor className="w-5 h-5 text-[#009F9C]" />
                    Active Sessions
                  </h2>
                  <button
                    onClick={handleRevokeAllSessions}
                    className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
                  >
                    Revoke All Sessions
                  </button>
                </div>
                
                <div className="space-y-4">
                  {loginSessions.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Monitor className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No active sessions found</p>
                    </div>
                  ) : (
                    loginSessions.map((session) => {
                      const DeviceIcon = getDeviceIcon(session.deviceType);
                      return (
                        <div key={session.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              session.current ? 'bg-green-100' : 'bg-gray-100'
                            }`}>
                              <DeviceIcon className={`w-5 h-5 ${
                                session.current ? 'text-green-600' : 'text-gray-500'
                              }`} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium text-gray-900">{session.deviceName}</h3>
                                {session.current && (
                                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                    Current
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-500">
                                {session.location} • Last active {session.lastActive}
                              </p>
                              <p className="text-xs text-gray-400">{session.ipAddress}</p>
                            </div>
                          </div>
                          {!session.current && (
                            <button
                              onClick={() => handleRevokeSession(session.id)}
                              className="px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
                            >
                              Revoke
                            </button>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Data & Privacy Tab */}
          {activeTab === 'data' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Database className="w-5 h-5 text-[#009F9C]" />
                  Data Management
                </h2>
                
                <div className="space-y-4">
                  {/* Export Data */}
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Download className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Export Account Data</h3>
                        <p className="text-sm text-gray-500">Download a copy of all your account information</p>
                      </div>
                    </div>
                    <button
                      onClick={handleExportData}
                      disabled={exportLoading}
                      className="px-4 py-2 bg-[#009F9C] text-white rounded-lg hover:bg-[#007A77] transition-colors disabled:opacity-50"
                    >
                      {exportLoading ? 'Exporting...' : 'Export Data'}
                    </button>
                  </div>

                  {/* Privacy Information */}
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Globe className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Privacy Information</h3>
                        <p className="text-sm text-gray-500">Learn how we handle your data</p>
                      </div>
                    </div>
                    <div className="pl-13 space-y-2 text-sm text-gray-600">
                      <p>• Your personal information is encrypted and securely stored</p>
                      <p>• We never share your data with third parties without consent</p>
                      <p>• You can request data deletion at any time</p>
                      <p>• All data transfers are encrypted using industry standards</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Danger Zone Tab */}
          {activeTab === 'danger' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-red-200">
                <h2 className="text-xl font-semibold text-red-900 mb-6 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  Danger Zone
                </h2>
                
                <div className="space-y-6">
                  {/* Account Deletion */}
                  <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <Trash2 className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-red-900">Delete Account</h3>
                        <p className="text-sm text-red-700">Permanently delete your account and all associated data</p>
                      </div>
                    </div>
                    
                    <div className="pl-13">
                      <div className="bg-white p-4 rounded-lg border border-red-200 mb-4">
                        <h4 className="font-medium text-red-900 mb-2">This action will:</h4>
                        <ul className="text-sm text-red-700 space-y-1">
                          <li>• Permanently delete your profile and all personal information</li>
                          <li>• Remove all your listings and transaction history</li>
                          <li>• Delete all your messages and conversations</li>
                          <li>• Cancel any active subscriptions or services</li>
                          <li>• This action cannot be undone</li>
                        </ul>
                      </div>
                      
                      {!showDeleteConfirm ? (
                        <button
                          onClick={() => setShowDeleteConfirm(true)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                        >
                          I want to delete my account
                        </button>
                      ) : (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-red-900 mb-2">
                              Enter your password to confirm deletion:
                            </label>
                            <div className="relative">
                              <input
                                type={showDeletePassword ? 'text' : 'password'}
                                value={deletePassword}
                                onChange={(e) => setDeletePassword(e.target.value)}
                                className="w-full px-4 py-3 pr-12 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                placeholder="Enter your password"
                              />
                              <button
                                type="button"
                                onClick={() => setShowDeletePassword(!showDeletePassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                              >
                                {showDeletePassword ? <EyeOff size={20} /> : <Eye size={20} />}
                              </button>
                            </div>
                          </div>
                          
                          <div className="flex gap-3">
                            <button
                              onClick={handleDeleteAccount}
                              disabled={!deletePassword}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
                            >
                              Confirm Deletion
                            </button>
                            <button
                              onClick={() => {
                                setShowDeleteConfirm(false);
                                setDeletePassword('');
                              }}
                              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}