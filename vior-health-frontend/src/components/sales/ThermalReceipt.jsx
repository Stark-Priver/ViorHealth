import { useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { format } from 'date-fns';

const ThermalReceipt = ({ sale, pharmacySettings, onClose }) => {
  const printRef = useRef();

  useEffect(() => {
    // Auto print when component mounts (optional)
    // handlePrint();
  }, []);

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const printContent = printRef.current.innerHTML;
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt - ${sale.invoice_number}</title>
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
              font-family: 'Courier New', monospace;
              font-size: 12px;
              line-height: 1.4;
              color: #000;
              background: white;
              width: 80mm;
              padding: 10mm 5mm;
            }
            
            .receipt-container {
              width: 100%;
            }
            
            .header {
              text-align: center;
              margin-bottom: 8px;
              border-bottom: 2px dashed #000;
              padding-bottom: 8px;
            }
            
            .header h1 {
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 4px;
              text-transform: uppercase;
            }
            
            .header-info {
              font-size: 11px;
              line-height: 1.3;
            }
            
            .section {
              margin: 8px 0;
              padding: 6px 0;
            }
            
            .section-title {
              font-weight: bold;
              font-size: 11px;
              text-transform: uppercase;
              margin-bottom: 4px;
              border-bottom: 1px solid #000;
            }
            
            .info-row {
              display: flex;
              justify-content: space-between;
              font-size: 11px;
              margin: 2px 0;
            }
            
            .info-label {
              font-weight: bold;
            }
            
            .items-table {
              width: 100%;
              margin: 8px 0;
              border-top: 1px dashed #000;
              border-bottom: 1px dashed #000;
              padding: 6px 0;
            }
            
            .item-row {
              margin: 4px 0;
            }
            
            .item-name {
              font-weight: bold;
              font-size: 11px;
            }
            
            .item-details {
              display: flex;
              justify-content: space-between;
              font-size: 10px;
              margin-top: 2px;
            }
            
            .totals {
              margin-top: 8px;
              padding-top: 6px;
              border-top: 1px solid #000;
            }
            
            .total-row {
              display: flex;
              justify-content: space-between;
              margin: 3px 0;
              font-size: 11px;
            }
            
            .total-row.grand-total {
              font-size: 14px;
              font-weight: bold;
              border-top: 2px solid #000;
              border-bottom: 2px solid #000;
              padding: 4px 0;
              margin-top: 6px;
            }
            
            .footer {
              text-align: center;
              margin-top: 12px;
              padding-top: 8px;
              border-top: 2px dashed #000;
              font-size: 10px;
            }
            
            .footer-message {
              margin: 4px 0;
              font-style: italic;
            }
            
            .barcode-section {
              text-align: center;
              margin: 8px 0;
            }
            
            .text-center {
              text-align: center;
            }
            
            .text-bold {
              font-weight: bold;
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
    return `${pharmacySettings?.currency_symbol || '$'}${parseFloat(amount).toFixed(2)}`;
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
          <div className="bg-white shadow-sm" style={{ width: '80mm', margin: '0 auto', padding: '10mm 5mm', fontFamily: "'Courier New', monospace" }}>
            <div ref={printRef} className="receipt-container">
              {/* Header */}
              <div className="header">
                <h1>{pharmacySettings?.pharmacy_name || 'Pharmacy'}</h1>
                <div className="header-info">
                  {pharmacySettings?.address_line1 && <div>{pharmacySettings.address_line1}</div>}
                  {pharmacySettings?.city && pharmacySettings?.state_province && (
                    <div>{pharmacySettings.city}, {pharmacySettings.state_province} {pharmacySettings.postal_code}</div>
                  )}
                  {pharmacySettings?.phone && <div>Tel: {pharmacySettings.phone}</div>}
                  {pharmacySettings?.email && <div>Email: {pharmacySettings.email}</div>}
                  {pharmacySettings?.tax_id && <div>Tax ID: {pharmacySettings.tax_id}</div>}
                </div>
              </div>

              {/* Custom Header */}
              {pharmacySettings?.receipt_header && (
                <div className="text-center" style={{ fontSize: '10px', margin: '6px 0', fontStyle: 'italic' }}>
                  {pharmacySettings.receipt_header}
                </div>
              )}

              {/* Sale Information */}
              <div className="section">
                <div className="info-row">
                  <span className="info-label">Invoice:</span>
                  <span>{sale.invoice_number}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Date:</span>
                  <span>{formatDate(sale.created_at)}</span>
                </div>
                {sale.customer_name && (
                  <div className="info-row">
                    <span className="info-label">Customer:</span>
                    <span>{sale.customer_name}</span>
                  </div>
                )}
                <div className="info-row">
                  <span className="info-label">Cashier:</span>
                  <span>{sale.cashier_name || 'N/A'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Payment:</span>
                  <span>{sale.payment_method.toUpperCase()}</span>
                </div>
              </div>

              {/* Items */}
              <div className="items-table">
                <div className="section-title">ITEMS</div>
                {sale.items && sale.items.map((item, index) => (
                  <div key={index} className="item-row">
                    <div className="item-name">{item.product_name}</div>
                    <div className="item-details">
                      <span>{item.quantity} x {formatCurrency(item.unit_price)}</span>
                      <span className="text-bold">{formatCurrency(item.total)}</span>
                    </div>
                    {parseFloat(item.discount) > 0 && (
                      <div style={{ fontSize: '10px', color: '#666', marginTop: '2px' }}>
                        Discount: -{formatCurrency(item.discount)}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="totals">
                <div className="total-row">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(sale.subtotal)}</span>
                </div>
                {parseFloat(sale.discount) > 0 && (
                  <div className="total-row">
                    <span>Discount:</span>
                    <span>-{formatCurrency(sale.discount)}</span>
                  </div>
                )}
                {parseFloat(sale.tax) > 0 && (
                  <div className="total-row">
                    <span>Tax:</span>
                    <span>{formatCurrency(sale.tax)}</span>
                  </div>
                )}
                <div className="total-row grand-total">
                  <span>TOTAL:</span>
                  <span>{formatCurrency(sale.total)}</span>
                </div>
                <div className="total-row">
                  <span>Amount Paid:</span>
                  <span>{formatCurrency(sale.amount_paid)}</span>
                </div>
                {parseFloat(sale.change_amount) > 0 && (
                  <div className="total-row">
                    <span>Change:</span>
                    <span>{formatCurrency(sale.change_amount)}</span>
                  </div>
                )}
              </div>

              {/* Notes */}
              {sale.notes && (
                <div className="section" style={{ fontSize: '10px', fontStyle: 'italic' }}>
                  <div className="section-title">Notes</div>
                  <div>{sale.notes}</div>
                </div>
              )}

              {/* Footer */}
              <div className="footer">
                {pharmacySettings?.receipt_footer && (
                  <div className="footer-message">{pharmacySettings.receipt_footer}</div>
                )}
                <div style={{ marginTop: '8px' }}>
                  <div>Thank you for your business!</div>
                  {pharmacySettings?.business_hours && (
                    <div style={{ marginTop: '4px', fontSize: '9px' }}>
                      {pharmacySettings.business_hours.split('\n').map((line, i) => (
                        <div key={i}>{line}</div>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ marginTop: '8px', fontSize: '9px' }}>
                  Powered by VIOR Health
                </div>
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
