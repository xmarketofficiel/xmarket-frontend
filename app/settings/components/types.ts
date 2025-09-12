import { User } from '../../../types';
import { SETTINGS_CONSTANTS, SettingsSection, NotificationType, PrivacyLevel, Theme, Language, Currency } from './constants';

// Extended user settings
export interface UserSettings extends User {
  settings?: {
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
      inApp: boolean;
      frequency: 'immediate' | 'daily' | 'weekly';
      types: {
        itemInterest: boolean;
        priceDrops: boolean;
        messages: boolean;
        security: boolean;
        marketing: boolean;
      };
    };
    privacy: {
      profileVisibility: PrivacyLevel;
      showSoldItems: boolean;
      showPurchases: boolean;
      showActivity: boolean;
      allowMessages: boolean;
      showOnlineStatus: boolean;
    };
    preferences: {
      language: string;
      currency: string;
      theme: Theme;
      timezone: string;
      defaultLocation: string;
      autoSave: boolean;
      compactMode: boolean;
    };
    security: {
      twoFactorEnabled: boolean;
      loginAlerts: boolean;
      sessionTimeout: number;
      allowedDevices: string[];
    };
  };
}

// Settings form data
export interface SettingsFormData {
  // Personal information
  fullName: string;
  email: string;
  whatsappNumber: string;
  bio?: string;
  location?: string;
  profilePicture?: string;
  coverImage?: string;

  // Notification settings
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    inApp: boolean;
    frequency: 'immediate' | 'daily' | 'weekly';
    types: {
      itemInterest: boolean;
      priceDrops: boolean;
      messages: boolean;
      security: boolean;
      marketing: boolean;
    };
  };

  // Privacy settings
  privacy: {
    profileVisibility: PrivacyLevel;
    showSoldItems: boolean;
    showPurchases: boolean;
    showActivity: boolean;
    allowMessages: boolean;
    showOnlineStatus: boolean;
  };

  // App preferences
  preferences: {
    language: string;
    currency: string;
    theme: Theme;
    timezone: string;
    defaultLocation: string;
    autoSave: boolean;
    compactMode: boolean;
  };

  // Security settings
  security: {
    twoFactorEnabled: boolean;
    loginAlerts: boolean;
    sessionTimeout: number;
    allowedDevices: string[];
  };
}

// Password change form
export interface PasswordChangeForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Notification preferences
export interface NotificationPreferences {
  type: NotificationType;
  enabled: boolean;
  frequency?: 'immediate' | 'daily' | 'weekly';
  categories: {
    itemInterest: boolean;
    priceDrops: boolean;
    messages: boolean;
    security: boolean;
    marketing: boolean;
  };
}

// Privacy settings
export interface PrivacySettings {
  profileVisibility: PrivacyLevel;
  showSoldItems: boolean;
  showPurchases: boolean;
  showActivity: boolean;
  allowMessages: boolean;
  showOnlineStatus: boolean;
  blockedUsers: string[];
}

// Security settings
export interface SecuritySettings {
  twoFactorEnabled: boolean;
  loginAlerts: boolean;
  sessionTimeout: number;
  allowedDevices: Device[];
  loginHistory: LoginSession[];
}

// Device information
export interface Device {
  id: string;
  name: string;
  type: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  os: string;
  lastUsed: string;
  location?: string;
  trusted: boolean;
}

// Login session
export interface LoginSession {
  id: string;
  timestamp: string;
  device: Device;
  ipAddress: string;
  location?: string;
  successful: boolean;
}

// App preferences
export interface AppPreferences {
  language: Language;
  currency: Currency;
  theme: Theme;
  timezone: string;
  defaultLocation: string;
  autoSave: boolean;
  compactMode: boolean;
  dataUsage: 'high' | 'medium' | 'low';
}

// Component props
export interface SettingsHeaderProps {
  user: UserSettings;
  onBack?: () => void;
  title?: string;
}

export interface SettingsNavigationProps {
  activeSection?: SettingsSection;
  onSectionChange: (section: SettingsSection) => void;
}

export interface SettingsOverviewProps {
  user: UserSettings;
  onQuickAction: (actionId: string) => void;
  onSectionClick: (sectionId: SettingsSection) => void;
}

export interface SettingsSectionCardProps {
  section: typeof SETTINGS_CONSTANTS.SETTINGS_SECTIONS[number];
  onClick: (sectionId: SettingsSection) => void;
  loading?: boolean;
}

export interface SettingsFormProps {
  formData: SettingsFormData;
  onSubmit: (data: Partial<SettingsFormData>) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

export interface NotificationSettingsProps {
  preferences: NotificationPreferences[];
  onChange: (preferences: NotificationPreferences[]) => void;
  loading?: boolean;
}

export interface PrivacySettingsProps {
  settings: PrivacySettings;
  onChange: (settings: PrivacySettings) => void;
  loading?: boolean;
}

export interface SecuritySettingsProps {
  settings: SecuritySettings;
  onChange: (settings: SecuritySettings) => void;
  onPasswordChange: (data: PasswordChangeForm) => Promise<void>;
  loading?: boolean;
}

export interface PreferencesSettingsProps {
  preferences: AppPreferences;
  onChange: (preferences: AppPreferences) => void;
  loading?: boolean;
}

// Form components
export interface SettingsInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'tel' | 'password';
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  required?: boolean;
  helperText?: string;
}

export interface SettingsToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export interface SettingsSelectProps {
  label: string;
  value: string;
  options: { value: string; label: string; description?: string }[];
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
  placeholder?: string;
}

// API responses
export interface SettingsResponse {
  success: boolean;
  data: UserSettings;
  message?: string;
}

export interface SettingsUpdateResponse {
  success: boolean;
  data: Partial<UserSettings>;
  message?: string;
}

export interface PasswordChangeResponse {
  success: boolean;
  message: string;
}

export interface DataExportResponse {
  success: boolean;
  downloadUrl: string;
  expiresAt: string;
}

// Hook return types
export interface UseSettingsReturn {
  settings: UserSettings | null;
  loading: boolean;
  error: string | null;
  updateSettings: (data: Partial<SettingsFormData>) => Promise<void>;
  changePassword: (data: PasswordChangeForm) => Promise<void>;
  exportData: () => Promise<string>;
  deleteAccount: (confirmation: string) => Promise<void>;
  refreshSettings: () => Promise<void>;
}

export interface UseNotificationSettingsReturn {
  preferences: NotificationPreferences[];
  loading: boolean;
  error: string | null;
  updatePreferences: (preferences: NotificationPreferences[]) => Promise<void>;
  testNotification: (type: NotificationType) => Promise<void>;
}

export interface UsePrivacySettingsReturn {
  settings: PrivacySettings;
  loading: boolean;
  error: string | null;
  updatePrivacy: (settings: PrivacySettings) => Promise<void>;
  blockUser: (userId: string) => Promise<void>;
  unblockUser: (userId: string) => Promise<void>;
}

export interface UseSecuritySettingsReturn {
  settings: SecuritySettings;
  loading: boolean;
  error: string | null;
  updateSecurity: (settings: SecuritySettings) => Promise<void>;
  enableTwoFactor: () => Promise<string>; // Returns QR code
  disableTwoFactor: (code: string) => Promise<void>;
  revokeDevice: (deviceId: string) => Promise<void>;
  clearLoginHistory: () => Promise<void>;
}

// Analytics events
export interface SettingsAnalyticsEvent {
  event: string;
  userId: string;
  section?: SettingsSection;
  action?: string;
  metadata?: Record<string, any>;
}

// Error types
export interface SettingsError {
  code: string;
  message: string;
  field?: string;
  details?: any;
}

// Loading states
export interface SettingsLoadingState {
  settings: boolean;
  notifications: boolean;
  privacy: boolean;
  security: boolean;
  preferences: boolean;
  actions: {
    [key: string]: boolean;
  };
}

// Validation results
export interface ValidationResult {
  isValid: boolean;
  errors: {
    [field: string]: string;
  };
}

// Account statistics
export interface AccountStats {
  accountAge: number; // days
  totalItems: number;
  totalSales: number;
  totalPurchases: number;
  profileViews: number;
  lastLogin: string;
  dataUsage: number; // MB
  storageUsed: number; // MB
}

// Export data options
export interface DataExportOptions {
  format: 'json' | 'csv' | 'xml';
  includeItems: boolean;
  includeMessages: boolean;
  includeTransactions: boolean;
  includeProfile: boolean;
  dateRange?: {
    from: string;
    to: string;
  };
}
