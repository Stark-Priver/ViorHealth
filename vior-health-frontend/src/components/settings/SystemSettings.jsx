import { useState } from 'react';
import { Building2, Save, AlertCircle } from 'lucide-react';

const SystemSettings = () => {
  const [settings, setSettings] = useState({
    companyName: 'VIOR Health',
    address: '123 Healthcare Ave, Medical District',
    phone: '+1 (555) 123-4567',
    email: 'info@viorhealth.com',
    taxId: 'TAX-123456789',
    currency: 'TZS',
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    lowStockThreshold: 10,
    enableNotifications: true,
    enableAutoBackup: true,
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');

    // Simulate API call
    setTimeout(() => {
      setSuccess('System settings saved successfully');
      setLoading(false);
    }, 1000);
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-neutral-900 flex items-center gap-2">
          <Building2 className="w-6 h-6" />
          System Settings
        </h2>
        <p className="text-neutral-600 mt-2">Configure your system preferences and business information</p>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
          {success}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Company Information */}
        <div className="bg-neutral-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Company Information</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Company Name
              </label>
              <input
                type="text"
                value={settings.companyName}
                onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Address
              </label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Tax ID
              </label>
              <input
                type="text"
                value={settings.taxId}
                onChange={(e) => setSettings({ ...settings, taxId: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Regional Settings */}
        <div className="bg-neutral-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Regional Settings</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Currency
              </label>
              <select
                value={settings.currency}
                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="TZS">TZS (TSh)</option>
                <option value="KES">KES (KSh)</option>
                <option value="UGX">UGX (USh)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Timezone
              </label>
              <select
                value={settings.timezone}
                onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/Denver">Mountain Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
                <option value="Africa/Lagos">West Africa Time</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Date Format
              </label>
              <select
                value={settings.dateFormat}
                onChange={(e) => setSettings({ ...settings, dateFormat: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
          </div>
        </div>

        {/* Inventory Settings */}
        <div className="bg-neutral-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Inventory Settings</h3>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Low Stock Alert Threshold
            </label>
            <input
              type="number"
              min="0"
              value={settings.lowStockThreshold}
              onChange={(e) => setSettings({ ...settings, lowStockThreshold: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <p className="text-xs text-neutral-500 mt-1">
              Products below this quantity will be flagged as low stock
            </p>
          </div>
        </div>

        {/* System Preferences */}
        <div className="bg-neutral-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">System Preferences</h3>
          
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableNotifications}
                onChange={(e) => setSettings({ ...settings, enableNotifications: e.target.checked })}
                className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
              />
              <div>
                <span className="text-sm font-medium text-neutral-700 block">Enable Notifications</span>
                <span className="text-xs text-neutral-500">Receive alerts for low stock, expiring products, etc.</span>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableAutoBackup}
                onChange={(e) => setSettings({ ...settings, enableAutoBackup: e.target.checked })}
                className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
              />
              <div>
                <span className="text-sm font-medium text-neutral-700 block">Enable Automatic Backup</span>
                <span className="text-xs text-neutral-500">Daily automatic database backups</span>
              </div>
            </label>
          </div>
        </div>

        {/* Warning Note */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-yellow-900 mb-1">Important Note</h4>
            <p className="text-sm text-yellow-800">
              Changing system settings may affect how the application behaves. Make sure you understand the implications before saving changes.
            </p>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Settings
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SystemSettings;
