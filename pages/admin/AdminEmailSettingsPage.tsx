import React, { useState, useEffect } from 'react';
import { Mail, Settings, Save, TestTube, CheckCircle, XCircle, Eye, EyeOff, Bell } from 'lucide-react';
import { emailService, EmailConfig } from '../../services/emailService';
import { notificationService } from '../../services/notificationService';
import { useAuth } from '../../hooks/useAuth';

const AdminEmailSettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [config, setConfig] = useState<EmailConfig>({
    apiUrl: '',
    apiKey: '',
    fromEmail: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isTestingNotification, setIsTestingNotification] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [testMessage, setTestMessage] = useState<string | null>(null);
  const [notificationMessage, setNotificationMessage] = useState<string | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);
  const [testEmail, setTestEmail] = useState('admin@reviewfighters.com');

  useEffect(() => {
    // Load current configuration
    const currentConfig = emailService.getConfig();
    setConfig(currentConfig);
  }, []);

  const handleInputChange = (field: keyof EmailConfig, value: string) => {
    setConfig(prev => ({ ...prev, [field]: value }));
    setSaveMessage(null);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);
    
    try {
      // Update email service configuration
      emailService.updateConfig(config);
      
      // In a real app, you would save this to your backend/database
      // For now, we'll just save to localStorage
      localStorage.setItem('emailConfig', JSON.stringify(config));
      
      setSaveMessage('Email settings saved successfully!');
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      console.error('Error saving email settings:', error);
      setSaveMessage('Failed to save email settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestEmail = async () => {
    if (!testEmail.trim()) {
      setTestMessage('Please enter a test email address');
      return;
    }

    setIsTesting(true);
    setTestMessage(null);

    try {
      // Update configuration before testing
      emailService.updateConfig(config);

      const success = await emailService.sendEmail({
        customer_name: 'Email System Test',
        message: 'This is a test email from the Review Fighters email system. If you receive this, your email configuration is working correctly!',
        to: testEmail,
        from: config.fromEmail
      });

      if (success) {
        setTestMessage('Test email sent successfully! Check your inbox.');
      } else {
        setTestMessage('Failed to send test email. Please check your configuration.');
      }
      
      setTimeout(() => setTestMessage(null), 5000);
    } catch (error) {
      console.error('Error sending test email:', error);
      setTestMessage('Error sending test email. Please check your configuration.');
    } finally {
      setIsTesting(false);
    }
  };

  const handleTestNotification = async () => {
    setIsTestingNotification(true);
    setNotificationMessage(null);

    try {
      // Request permission if not granted
      const permissionGranted = await notificationService.requestPermission();
      
      if (!permissionGranted) {
        setNotificationMessage('Browser notifications permission denied. Please enable notifications in your browser settings.');
        return;
      }

      // Test browser notification
      await notificationService.notify({
        title: 'Test Notification',
        message: 'This is a test notification from Review Fighters! The notification system is working correctly.',
        type: 'success',
        userId: user?.id,
        showBrowser: true,
        requireInteraction: false
      });

      setNotificationMessage('Test notification sent! Check your browser and notification panel.');
      setTimeout(() => setNotificationMessage(null), 5000);
    } catch (error) {
      console.error('Error sending test notification:', error);
      setNotificationMessage('Error sending test notification. Please try again.');
    } finally {
      setIsTestingNotification(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Mail className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Email & Notification Settings</h1>
          <p className="text-gray-600">Configure system-wide email service and notification settings</p>
        </div>
      </div>

      {/* Email Configuration Form */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Email Service Configuration</h2>
        </div>

        <div className="space-y-6">
          {/* API URL */}
          <div>
            <label htmlFor="apiUrl" className="block text-sm font-medium text-gray-700 mb-2">
              API URL
            </label>
            <input
              type="url"
              id="apiUrl"
              value={config.apiUrl}
              onChange={(e) => handleInputChange('apiUrl', e.target.value)}
              placeholder="https://webhook-processor-production-68cd.up.railway.app/webhook/sendMail"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <p className="text-sm text-gray-500 mt-1">
              The n8n webhook URL for sending emails
            </p>
          </div>

          {/* API Key */}
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
              API Key (Optional)
            </label>
            <div className="relative">
              <input
                type={showApiKey ? "text" : "password"}
                id="apiKey"
                value={config.apiKey}
                onChange={(e) => handleInputChange('apiKey', e.target.value)}
                placeholder="Enter API key if required"
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showApiKey ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Optional API key for authentication (if required by your webhook)
            </p>
          </div>

          {/* From Email */}
          <div>
            <label htmlFor="fromEmail" className="block text-sm font-medium text-gray-700 mb-2">
              From Email Address
            </label>
            <input
              type="email"
              id="fromEmail"
              value={config.fromEmail}
              onChange={(e) => handleInputChange('fromEmail', e.target.value)}
              placeholder="noreply@reviewfighters.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <p className="text-sm text-gray-500 mt-1">
              The email address that will appear as the sender
            </p>
          </div>

          {/* Save Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors duration-200 disabled:opacity-50"
            >
              <Save size={16} />
              {isSaving ? 'Saving...' : 'Save Settings'}
            </button>

            {saveMessage && (
              <div className={`flex items-center gap-2 text-sm ${
                saveMessage.includes('successfully') ? 'text-green-600' : 'text-red-600'
              }`}>
                {saveMessage.includes('successfully') ? (
                  <CheckCircle size={16} />
                ) : (
                  <XCircle size={16} />
                )}
                {saveMessage}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Test Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Test Email Section */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center gap-2 mb-4">
            <TestTube className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Test Email</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="testEmail" className="block text-sm font-medium text-gray-700 mb-2">
                Test Email Address
              </label>
              <input
                type="email"
                id="testEmail"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="admin@reviewfighters.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleTestEmail}
                disabled={isTesting || !config.apiUrl}
                className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50"
              >
                <TestTube size={16} />
                {isTesting ? 'Sending...' : 'Send Test Email'}
              </button>

              {testMessage && (
                <div className={`flex items-center gap-2 text-sm ${
                  testMessage.includes('successfully') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {testMessage.includes('successfully') ? (
                    <CheckCircle size={16} />
                  ) : (
                    <XCircle size={16} />
                  )}
                  {testMessage}
                </div>
              )}
            </div>

            {!config.apiUrl && (
              <p className="text-sm text-orange-600">
                Please configure the API URL before testing
              </p>
            )}
          </div>
        </div>

        {/* Test Notification Section */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Test Browser Notification</h2>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Test the browser notification system to ensure users receive real-time alerts.
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={handleTestNotification}
                disabled={isTestingNotification}
                className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200 disabled:opacity-50"
              >
                <Bell size={16} />
                {isTestingNotification ? 'Sending...' : 'Send Test Notification'}
              </button>

              {notificationMessage && (
                <div className={`flex items-center gap-2 text-sm ${
                  notificationMessage.includes('sent') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {notificationMessage.includes('sent') ? (
                    <CheckCircle size={16} />
                  ) : (
                    <XCircle size={16} />
                  )}
                  {notificationMessage}
                </div>
              )}
            </div>

            <div className="text-xs text-gray-500 space-y-1">
              <p>• Browser notifications require user permission</p>
              <p>• Check the notification bell icon in the top navigation</p>
              <p>• Notifications are automatically sent with emails</p>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Information */}
      <div className="bg-blue-50 rounded-xl p-6 mt-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Email & Notification System Usage</h3>
        <div className="text-sm text-blue-800 space-y-2">
          <p>• <strong>Review Alerts:</strong> Notifies staff via email and browser when new reviews are submitted</p>
          <p>• <strong>User Registration:</strong> Sends email and system notifications when new users register</p>
          <p>• <strong>Staff Tasks:</strong> Notifies staff members via email and browser when they are assigned new tasks</p>
          <p>• <strong>Password Reset:</strong> Sends password reset links to users via email</p>
          <p>• <strong>Contact Form:</strong> Forwards contact form submissions to admin via email and notifications</p>
          <p>• <strong>Real-time Notifications:</strong> Users receive browser notifications when the page is not visible</p>
        </div>
      </div>
    </div>
  );
};

export default AdminEmailSettingsPage; 