/**
 * Format role name to display format
 * @param {string} role - Role identifier (e.g., 'lab_technician', 'admin')
 * @returns {string} - Formatted role name (e.g., 'Lab Technician', 'Admin')
 */
export const formatRole = (role) => {
  if (!role) return '';
  
  return role
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Format currency with symbol
 * @param {number} amount - Amount to format
 * @param {string} symbol - Currency symbol (default: 'TSH')
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (amount, symbol = 'TSH') => {
  const value = parseFloat(amount).toFixed(2);
  return `${symbol} ${value}`;
};

/**
 * Format date to readable format
 * @param {string|Date} date - Date to format
 * @returns {string} - Formatted date string
 */
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

/**
 * Format date and time to readable format
 * @param {string|Date} datetime - DateTime to format
 * @returns {string} - Formatted datetime string
 */
export const formatDateTime = (datetime) => {
  if (!datetime) return '';
  const d = new Date(datetime);
  return d.toLocaleString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
