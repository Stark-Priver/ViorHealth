import { useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { format } from 'date-fns';

const ThermalReceipt = ({ sale, pharmacySettings, onClose }) => {
  const printRef = useRef();

  useEffect(() => {
    console.log('ThermalReceipt - Pharmacy Settings:', pharmacySettings);
    console.log('ThermalReceipt - Sale:', sale);
    // Auto print when component mounts (optional)
    // handlePrint();
  }, [pharmacySettings, sale]);

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const printContent = printRef.current.innerHTML;
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt - ${sale.invoice_number}</title>
          <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
          <style>
            @page {
              size: 80mm auto;
              margin: 0;
            }
            
            @media print {
              body {
                width: 80mm;
                margin: 0;
                padding: 0;
              }
              
              .no-print {
                display: none !important;
              }
            }
            
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: 'Poppins', sans-serif;
              font-size: 10px;
              line-height: 1.4;
              color: #000;
              background: white;
              width: 80mm;
              padding: 5mm;
            }
            
            .receipt-container {
              width: 100%;
            }
            
            /* Header Styling */
            .header {
              text-align: center;
              margin-bottom: 15px;
              padding-bottom: 12px;
              border-bottom: 3px double #000;
            }
            
            .pharmacy-name {
              font-size: 22px;
              font-weight: 800;
              margin-bottom: 4px;
              text-transform: uppercase;
              letter-spacing: 1px;
              color: #000;
            }
            
            .header-info {
              font-size: 9px;
              line-height: 1.5;
              color: #333;
              margin-top: 6px;
            }
            
            .header-info div {
              margin: 1px 0;
            }
            
            .divider {
              border-bottom: 1px dashed #999;
              margin: 10px 0;
            }
            
            .divider-thick {
              border-bottom: 2px solid #000;
              margin: 12px 0;
            }
            
            /* Transaction Info */
            .transaction-header {
              text-align: center;
              font-size: 11px;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 1px;
              margin: 12px 0 8px 0;
              color: #000;
            }
            
            .info-table {
              width: 100%;
              margin: 8px 0;
              font-size: 9px;
            }
            
            .info-row {
              display: flex;
              justify-content: space-between;
              padding: 3px 0;
              border-bottom: 1px dotted #ddd;
            }
            
            .info-row:last-child {
              border-bottom: none;
            }
            
            .info-label {
              font-weight: 600;
              color: #555;
              text-transform: uppercase;
              font-size: 8px;
              letter-spacing: 0.5px;
            }
            
            .info-value {
              font-weight: 600;
              text-align: right;
              color: #000;
            }
            
            /* Items Section */
            .items-header {
              text-align: center;
              font-size: 11px;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 1px;
              margin: 12px 0 8px 0;
              padding: 6px 0;
              background: #f5f5f5;
              border-top: 2px solid #000;
              border-bottom: 2px solid #000;
            }
            
            .items-list {
              margin: 10px 0;
            }
            
            .item {
              margin: 8px 0;
              padding: 6px 0;
              border-bottom: 1px dashed #ddd;
            }
            
            .item:last-child {
              border-bottom: none;
            }
            
            .item-name {
              font-weight: 600;
              font-size: 10px;
              margin-bottom: 3px;
              color: #000;
            }
            
            .item-details {
              display: flex;
              justify-content: space-between;
              font-size: 9px;
              color: #666;
            }
            
            .item-qty {
              flex: 1;
            }
            
            .item-price {
              text-align: right;
              font-weight: 600;
              color: #000;
            }
            
            .item-discount {
              font-size: 8px;
              color: #e74c3c;
              margin-top: 2px;
              text-align: right;
            }
            
            /* Totals Section */
            .totals-section {
              margin-top: 15px;
              padding-top: 10px;
              border-top: 3px double #000;
            }
            
            .total-line {
              display: flex;
              justify-content: space-between;
              padding: 4px 0;
              font-size: 10px;
            }
            
            .total-label {
              text-transform: uppercase;
              font-size: 9px;
              letter-spacing: 0.5px;
            }
            
            .total-value {
              font-weight: 600;
              text-align: right;
            }
            
            .subtotal-line {
              color: #666;
            }
            
            .discount-line {
              color: #e74c3c;
            }
            
            .tax-line {
              color: #666;
            }
            
            .grand-total-line {
              margin-top: 8px;
              padding: 10px 8px;
              background: #000;
              color: #fff;
              font-size: 14px;
              font-weight: 800;
              border-radius: 4px;
            }
            
            .grand-total-line .total-label {
              font-size: 12px;
              letter-spacing: 1px;
            }
            
            .payment-info {
              margin-top: 10px;
              padding-top: 10px;
              border-top: 1px dashed #999;
            }
            
            .payment-line {
              display: flex;
              justify-content: space-between;
              padding: 3px 0;
              font-size: 10px;
              font-weight: 600;
            }
            
            /* Notes Section */
            .notes-box {
              margin: 12px 0;
              padding: 8px;
              background: #f9f9f9;
              border-left: 3px solid #3498db;
              border-radius: 2px;
            }
            
            .notes-title {
              font-weight: 700;
              font-size: 8px;
              text-transform: uppercase;
              margin-bottom: 4px;
              color: #3498db;
              letter-spacing: 0.5px;
            }
            
            .notes-text {
              font-size: 9px;
              line-height: 1.4;
              color: #555;
            }
            
            /* Footer Section */
            .footer {
              text-align: center;
              margin-top: 15px;
              padding-top: 12px;
              border-top: 3px double #000;
            }
            
            .thank-you {
              font-size: 12px;
              font-weight: 700;
              margin-bottom: 8px;
              color: #000;
            }
            
            .footer-message {
              font-size: 9px;
              margin: 6px 0;
              font-style: italic;
              color: #555;
            }
            
            .hours-section {
              margin: 10px 0;
              padding: 8px;
              background: #f5f5f5;
              border-radius: 3px;
            }
            
            .hours-title {
              font-size: 8px;
              font-weight: 700;
              text-transform: uppercase;
              margin-bottom: 4px;
              color: #000;
              letter-spacing: 0.5px;
            }
            
            .hours-text {
              font-size: 8px;
              line-height: 1.5;
              color: #555;
            }
            
            .powered {
              font-size: 7px;
              margin-top: 12px;
              color: #999;
              font-weight: 500;
              letter-spacing: 0.5px;
            }
            
            .highlight-box {
              background: #f9f9f9;
              padding: 6px;
              margin: 8px 0;
              border-radius: 3px;
              text-align: center;
              font-size: 9px;
              font-style: italic;
              color: #555;
              border: 1px dashed #ddd;
            }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const formatCurrency = (amount) => {
    const symbol = pharmacySettings?.currency_symbol || 'TSH';
    const value = parseFloat(amount).toFixed(2);
    return `${symbol} ${value}`;
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy hh:mm a');
    } catch {
      return dateString;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-neutral-200 p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-900">Receipt Preview</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="btn-primary"
            >
              Print Receipt
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-neutral-600" />
            </button>
          </div>
        </div>

        {/* Receipt Content */}
        <div className="p-6 bg-neutral-50">
          <div className="bg-white shadow-lg" style={{ width: '80mm', margin: '0 auto', padding: '5mm', fontFamily: "'Poppins', sans-serif" }}>
            <div ref={printRef} className="receipt-container">
              
              {/* Header */}
              <div className="header">
                <div className="pharmacy-name">{pharmacySettings?.pharmacy_name || 'VIOR HEALTH PHARMACY'}</div>
                <div className="header-info">
                  {pharmacySettings?.business_registration_number && (
                    <div><strong>Reg No:</strong> {pharmacySettings.business_registration_number}</div>
                  )}
                  {pharmacySettings?.tax_id && (
                    <div><strong>TIN:</strong> {pharmacySettings.tax_id}</div>
                  )}
                  {pharmacySettings?.address_line1 && <div>{pharmacySettings.address_line1}</div>}
                  {pharmacySettings?.address_line2 && <div>{pharmacySettings.address_line2}</div>}
                  {(pharmacySettings?.city || pharmacySettings?.state_province) && (
                    <div>
                      {pharmacySettings.city}
                      {pharmacySettings.city && pharmacySettings.state_province && ', '}
                      {pharmacySettings.state_province} {pharmacySettings.postal_code}
                    </div>
                  )}
                  {pharmacySettings?.country && <div>{pharmacySettings.country}</div>}
                  <div style={{ marginTop: '4px', paddingTop: '4px', borderTop: '1px solid #ddd' }}></div>
                  {pharmacySettings?.phone && (
                    <div><strong>Phone:</strong> {pharmacySettings.phone}</div>
                  )}
                  {pharmacySettings?.email && (
                    <div><strong>Email:</strong> {pharmacySettings.email}</div>
                  )}
                  {pharmacySettings?.website && (
                    <div><strong>Web:</strong> {pharmacySettings.website}</div>
                  )}
                </div>
              </div>

              {/* Custom Message */}
              {pharmacySettings?.receipt_header && (
                <div className="highlight-box">
                  {pharmacySettings.receipt_header}
                </div>
              )}

              {/* Transaction Details */}
              <div className="transaction-header">SALES RECEIPT</div>
              <div className="info-table">
                <div className="info-row">
                  <span className="info-label">Invoice No</span>
                  <span className="info-value">{sale.invoice_number}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Date & Time</span>
                  <span className="info-value">{formatDate(sale.created_at)}</span>
                </div>
                {sale.customer_name && (
                  <div className="info-row">
                    <span className="info-label">Customer</span>
                    <span className="info-value">{sale.customer_name}</span>
                  </div>
                )}
                <div className="info-row">
                  <span className="info-label">Cashier</span>
                  <span className="info-value">{sale.cashier_name || 'N/A'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Payment</span>
                  <span className="info-value" style={{ textTransform: 'uppercase' }}>{sale.payment_method}</span>
                </div>
              </div>

              {/* Items Header */}
              <div className="items-header">ITEMS PURCHASED</div>

              {/* Items List */}
              <div className="items-list">
                {sale.items && sale.items.map((item, index) => (
                  <div key={index} className="item">
                    <div className="item-name">{item.product_name}</div>
                    <div className="item-details">
                      <span className="item-qty">{item.quantity} × {formatCurrency(item.unit_price)}</span>
                      <span className="item-price">{formatCurrency(item.total)}</span>
                    </div>
                    {parseFloat(item.discount) > 0 && (
                      <div className="item-discount">
                        Discount Applied: -{formatCurrency(item.discount)}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Totals Section */}
              <div className="totals-section">
                <div className="total-line subtotal-line">
                  <span className="total-label">Subtotal</span>
                  <span className="total-value">{formatCurrency(sale.subtotal)}</span>
                </div>
                {parseFloat(sale.discount) > 0 && (
                  <div className="total-line discount-line">
                    <span className="total-label">Discount</span>
                    <span className="total-value">-{formatCurrency(sale.discount)}</span>
                  </div>
                )}
                {parseFloat(sale.tax) > 0 && (
                  <div className="total-line tax-line">
                    <span className="total-label">Tax (VAT)</span>
                    <span className="total-value">{formatCurrency(sale.tax)}</span>
                  </div>
                )}
                
                <div className="total-line grand-total-line">
                  <span className="total-label">GRAND TOTAL</span>
                  <span className="total-value">{formatCurrency(sale.total)}</span>
                </div>

                <div className="payment-info">
                  <div className="payment-line">
                    <span>Amount Paid</span>
                    <span>{formatCurrency(sale.amount_paid)}</span>
                  </div>
                  {parseFloat(sale.change_amount) > 0 && (
                    <div className="payment-line">
                      <span>Change</span>
                      <span>{formatCurrency(sale.change_amount)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes Section */}
              {sale.notes && (
                <div className="notes-box">
                  <div className="notes-title">Special Notes</div>
                  <div className="notes-text">{sale.notes}</div>
                </div>
              )}

              {/* Footer */}
              <div className="footer">
                <div className="thank-you">
                  {pharmacySettings?.receipt_footer || 'THANK YOU FOR YOUR PURCHASE!'}
                </div>
                
                {pharmacySettings?.business_hours && (
                  <div className="hours-section">
                    <div className="hours-title">Business Hours</div>
                    <div className="hours-text">
                      {pharmacySettings.business_hours.split('\n').map((line, i) => (
                        <div key={i}>{line}</div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="divider"></div>
                <div className="powered">POWERED BY VIOR HEALTH SYSTEM</div>
              </div>

            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-neutral-200 p-4 flex justify-end gap-2">
          <button onClick={onClose} className="btn-secondary">
            Close
          </button>
          <button onClick={handlePrint} className="btn-primary">
            Print
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThermalReceipt;
