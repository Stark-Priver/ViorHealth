import { useState, useEffect } from 'react';
import { Save, Building2, Phone, Mail, MapPin, FileText, DollarSign, Clock } from 'lucide-react';
import { toast } from 'react-toastify';
import { getPharmacySettings, updatePharmacySettings } from '../services/pharmacySettings';

const PharmacySettingsPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    pharmacy_name: '',
    business_registration_number: '',
    tax_id: '',
    phone: '',
    email: '',
    website: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state_province: '',
    postal_code: '',
    country: 'United States',
    receipt_header: '',
    receipt_footer: '',
    show_logo_on_receipt: true,
    business_hours: '',
    currency_symbol: '$',
    currency_code: 'USD'
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await getPharmacySettings();
      if (data) {
        setSettings(data);
      }
    } catch (error) {
      console.error('Error fetching pharmacy settings:', error);
      toast.error('Failed to load pharmacy settings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updatePharmacySettings(settings);
      toast.success('Pharmacy settings updated successfully');
    } catch (error) {
      console.error('Error updating pharmacy settings:', error);
      toast.error('Failed to update pharmacy settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Pharmacy Settings</h1>
          <p className="text-neutral-600 mt-1">Configure your pharmacy details for receipts and documents</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="card">
          <div className="flex items-center gap-2 mb-6">
            <Building2 className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-neutral-900">Basic Information</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Pharmacy Name <span className="text-danger-600">*</span>
              </label>
              <input
                type="text"
                name="pharmacy_name"
                value={settings.pharmacy_name}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Business Registration Number
              </label>
              <input
                type="text"
                name="business_registration_number"
                value={settings.business_registration_number || ''}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Tax ID / VAT Number
              </label>
              <input
                type="text"
                name="tax_id"
                value={settings.tax_id || ''}
                onChange={handleChange}
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="card">
          <div className="flex items-center gap-2 mb-6">
            <Phone className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-neutral-900">Contact Information</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Phone <span className="text-danger-600">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={settings.phone}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Email <span className="text-danger-600">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={settings.email}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Website
              </label>
              <input
                type="url"
                name="website"
                value={settings.website || ''}
                onChange={handleChange}
                className="input-field"
                placeholder="https://www.example.com"
              />
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="card">
          <div className="flex items-center gap-2 mb-6">
            <MapPin className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-neutral-900">Address</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Address Line 1 <span className="text-danger-600">*</span>
              </label>
              <input
                type="text"
                name="address_line1"
                value={settings.address_line1}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Address Line 2
              </label>
              <input
                type="text"
                name="address_line2"
                value={settings.address_line2 || ''}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                City <span className="text-danger-600">*</span>
              </label>
              <input
                type="text"
                name="city"
                value={settings.city}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                State / Province <span className="text-danger-600">*</span>
              </label>
              <input
                type="text"
                name="state_province"
                value={settings.state_province}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Postal Code <span className="text-danger-600">*</span>
              </label>
              <input
                type="text"
                name="postal_code"
                value={settings.postal_code}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Country <span className="text-danger-600">*</span>
              </label>
              <input
                type="text"
                name="country"
                value={settings.country}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
          </div>
        </div>

        {/* Receipt Settings */}
        <div className="card">
          <div className="flex items-center gap-2 mb-6">
            <FileText className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-neutral-900">Receipt Settings</h2>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Receipt Header
              </label>
              <textarea
                name="receipt_header"
                value={settings.receipt_header || ''}
                onChange={handleChange}
                className="input-field"
                rows="3"
                placeholder="Custom header text for receipts..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Receipt Footer
              </label>
              <textarea
                name="receipt_footer"
                value={settings.receipt_footer || ''}
                onChange={handleChange}
                className="input-field"
                rows="3"
                placeholder="Thank you for your business! Visit us again..."
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="show_logo_on_receipt"
                name="show_logo_on_receipt"
                checked={settings.show_logo_on_receipt}
                onChange={handleChange}
                className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
              />
              <label htmlFor="show_logo_on_receipt" className="ml-2 text-sm text-neutral-700">
                Show logo on receipts
              </label>
            </div>
          </div>
        </div>

        {/* Business Hours & Currency */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <div className="flex items-center gap-2 mb-6">
              <Clock className="w-5 h-5 text-primary-600" />
              <h2 className="text-lg font-semibold text-neutral-900">Business Hours</h2>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Business Hours
              </label>
              <textarea
                name="business_hours"
                value={settings.business_hours || ''}
                onChange={handleChange}
                className="input-field"
                rows="4"
                placeholder="Mon-Fri: 9:00 AM - 8:00 PM&#10;Sat: 10:00 AM - 6:00 PM&#10;Sun: Closed"
              />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-2 mb-6">
              <DollarSign className="w-5 h-5 text-primary-600" />
              <h2 className="text-lg font-semibold text-neutral-900">Currency</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Currency Symbol
                </label>
                <input
                  type="text"
                  name="currency_symbol"
                  value={settings.currency_symbol}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="$"
                  maxLength="10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Currency Code
                </label>
                <input
                  type="text"
                  name="currency_code"
                  value={settings.currency_code}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="USD"
                  maxLength="3"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary"
          >
            {saving ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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

export default PharmacySettingsPage;
