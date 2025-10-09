// Signup Page Type Definitions

export type SignupMode = 'signup' | 'request-access';

export type UserType = 'um6p' | '1337' | 'external';

export type SignupStepType = 'user-type' | 'email' | 'otp' | 'details' | 'complete' | 'request-access' | 'request-success' | '1337-student';

export interface DiscordData {
  discordUsername: string;
  discordUserId: string;
  avatarUrl?: string;
  isGuildMember: boolean;
  guildName?: string;
}

export interface SignupFormData {
  step: SignupStepType;
  userType?: UserType;
  email: string;
  otp: string;
  firstName: string;
  lastName: string;
  department: string;
  role: 'student' | 'staff';
  address: string;
  whatsappNumber: string;
  password: string;
  confirmPassword: string;
  loginName?: string; // For 1337 students
  studentType?: 'um6p' | '1337'; // Track which student verification was used
  discordData?: DiscordData; // Discord verification data for 1337 students
  // Legacy field for backward compatibility
  fullName?: string;
}

export interface RequestAccessData {
  firstName: string;
  lastName: string;
  department: string;
  role: 'student' | 'staff';
  address: string;
  email: string;
  whatsappNumber: string;
  reason: string;
  // Legacy field for backward compatibility
  fullName?: string;
}

export interface SignupState {
  signupMode: SignupMode;
  formData: SignupFormData;
  requestAccessData: RequestAccessData;
  isLoading: boolean;
  message: string;
  messageType: 'success' | 'error';
  resendTimer: number;
  canResend: boolean;
  otpSent: boolean;
  focusedField: string;
  showPassword: boolean;
  showConfirmPassword: boolean;
  requestSubmitted: boolean;
}

export interface FloatingElement {
  id: number;
  x: number;
  y: number;
  delay: number;
  size: number;
}

export interface BrandFeature {
  icon: string;
  title: string;
  description: string;
}

export interface StepConfiguration {
  title: string;
  subtitle: string;
  buttonText: string;
  loadingText: string;
}

export interface SignupHandlers {
  handleSendOtp: (e: React.FormEvent) => Promise<void>;
  handleResendOtp: () => Promise<void>;
  handleVerifyOtp: (e: React.FormEvent) => Promise<void>;
  handleCompleteSignup: (e: React.FormEvent) => Promise<void>;
  handleRequestAccess: (e: React.FormEvent) => Promise<void>;
  handleUserTypeSelection: (userType: UserType) => void;
  handleBackToUserType: () => void;
  handleDiscordOAuth: () => void;
  handle1337Registration: (e: React.FormEvent) => Promise<void>;
  handleFieldFocus: (field: string) => void;
  handleFieldBlur: () => void;
  handleTogglePassword: (field: 'password' | 'confirmPassword') => void;
  switchToSignup: () => void;
  switchToRequestAccess: () => void;
  updateFormData: (updates: Partial<SignupFormData>) => void;
  updateRequestData: (updates: Partial<RequestAccessData>) => void;
}

// Component Props Interfaces
export interface AnimatedBackgroundProps {
  floatingElements: FloatingElement[];
}

export interface BrandingPanelProps {
  currentStep: SignupStepType;
  signupMode: SignupMode;
}

export interface StepHeaderProps {
  step: SignupStepType;
  signupMode: SignupMode;
}

export interface EmailStepProps {
  formData: SignupFormData;
  isLoading: boolean;
  message: string;
  messageType: 'success' | 'error';
  focusedField: string;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onFieldFocus: (field: string) => void;
  onFieldBlur: () => void;
  onUpdateFormData: (updates: Partial<SignupFormData>) => void;
  onSwitchToRequestAccess: () => void;
}

export interface OtpStepProps {
  formData: SignupFormData;
  isLoading: boolean;
  message: string;
  messageType: 'success' | 'error';
  resendTimer: number;
  canResend: boolean;
  focusedField: string;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onResend: () => Promise<void>;
  onFieldFocus: (field: string) => void;
  onFieldBlur: () => void;
  onUpdateFormData: (updates: Partial<SignupFormData>) => void;
}

export interface DetailsStepProps {
  formData: SignupFormData;
  isLoading: boolean;
  message: string;
  messageType: 'success' | 'error';
  focusedField: string;
  showPassword: boolean;
  showConfirmPassword: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onFieldFocus: (field: string) => void;
  onFieldBlur: () => void;
  onTogglePassword: (field: 'password' | 'confirmPassword') => void;
  onUpdateFormData: (updates: Partial<SignupFormData>) => void;
}

export interface CompleteStepProps {
  formData: SignupFormData;
}

export interface RequestAccessStepProps {
  requestData: RequestAccessData;
  isLoading: boolean;
  message: string;
  messageType: 'success' | 'error';
  focusedField: string;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onFieldFocus: (field: string) => void;
  onFieldBlur: () => void;
  onUpdateRequestData: (updates: Partial<RequestAccessData>) => void;
  onSwitchToSignup: () => void;
}

export interface MessageDisplayProps {
  message: string;
  type: 'success' | 'error';
}

export interface InputFieldProps {
  type: string;
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  placeholder: string;
  label: string;
  required?: boolean;
  focused?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
  icon?: React.ReactNode;
  maxLength?: number;
  error?: string;
  isValid?: boolean;
  disabled?: boolean;
}

export interface SubmitButtonProps {
  isLoading: boolean;
  text: string;
  loadingText: string;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  icon?: React.ReactNode;
}

export interface NavigationFooterProps {
  currentStep: SignupStepType;
  signupMode: SignupMode;
  onSwitchToSignup?: () => void;
  onSwitchToRequestAccess?: () => void;
}
