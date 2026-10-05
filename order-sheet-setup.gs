/**
 * Tinkerleaf - Google Sheet order recorder + email alert + Razorpay payment verification
 * Setup steps README-SETUP.txt mein hain.
 */
var OWNER_EMAIL = 'babliamisha@gmail.com';   // yahan par order ki email aayegi
var SHEET_NAME  = 'Orders';
var HEADERS = ['Time','Order ID','Name','Phone','Email','Address','City','Pincode','Items','Subtotal','Delivery','Total','Payment','UTR','Paid (customer)','Status','Razorpay Payment ID','Payment check','GST invoice (business / GSTIN)','Coupon','Discount'];
var QUOTE_SHEET = 'Quotes';
var QUOTE_HEADERS = ['Time','Quote ID','Name','Organisation','Phone','Email','Products x Qty','Notes','Status'];

/* Razorpay keys CODE MEIN MAT likhein. Apps Script > Project Settings > Script properties mein daalein:
   RZP_KEY_ID  = rzp_live_xxxxx
   RZP_KEY_SECRET = xxxxxxxx                                                                        */
function verifyRazorpay_(paymentId, orderId, total) {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty('RZP_KEY_ID'), secret = props.getProperty('RZP_KEY_SECRET');
  if (!id || !secret) return 'NOT CHECKED (Razorpay keys missing in Script properties)';
  try {
    var r = UrlFetchApp.fetch('https://api.razorpay.com/v1/payments/' + encodeURIComponent(paymentId), {
      headers: { Authorization: 'Basic ' + Utilities.base64Encode(id + ':' + secret) },
      muteHttpExceptions: true
    });
    if (r.getResponseCode() !== 200) return 'FAILED: payment not found (' + r.getResponseCode() + ')';
    var d = JSON.parse(r.getContentText());
    if (d.amount !== Math.round(Number(total) * 100)) return 'MISMATCH: Razorpay amount is Rs ' + (d.amount / 100) + ', order total Rs ' + total;
    if (d.notes && d.notes.order_id && d.notes.order_id !== orderId) return 'MISMATCH: payment belongs to order ' + d.notes.order_id;
    if (d.status === 'captured') return 'PAID & VERIFIED';
    if (d.status === 'authorized') return 'AUTHORIZED - capture it in Razorpay dashboard';
    return 'NOT PAID (' + d.status + ')';
  } catch (err) {
    return 'CHECK MANUALLY (' + err + ')';
  }
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var p = e.parameter || {};
    if (p.type === 'quote') return handleQuote_(p);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    if (sh.getLastRow() === 0 || sh.getLastColumn() < HEADERS.length) {
      sh.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
      sh.setFrozenRows(1);
    }
    var n = sh.getLastRow() - 1;
    var ids = n > 0 ? sh.getRange(2, 2, n, 1).getValues().flat() : [];
    if (ids.indexOf(p.order_id) !== -1) return ContentService.createTextOutput('duplicate');

    var check = '';
    if (p.rzp_payment_id) {
      var used = n > 0 ? sh.getRange(2, 17, n, 1).getValues().flat() : [];
      check = used.indexOf(p.rzp_payment_id) !== -1
        ? 'DUPLICATE: this payment ID was already used for another order'
        : verifyRazorpay_(p.rzp_payment_id, p.order_id, p.total);
    } else if (p.payment && p.payment.indexOf('Online') === 0) {
      check = 'VERIFY UTR in your UPI app';
    }

    sh.appendRow([
      p.time, p.order_id, p.name, "'" + p.phone, p.customer_email, p.address, p.city, "'" + p.pincode,
      p.items, p.subtotal, p.delivery, p.total, p.payment, p.utr, p.paid, 'New', p.rzp_payment_id || '', check,
      (p.gstin ? (p.gst_business || '') + ' / ' + p.gstin : ''),
      p.coupon || '', Number(p.discount) || 0
    ]);

    MailApp.sendEmail({
      to: OWNER_EMAIL,
      subject: (p._subject || ('New order ' + p.order_id)) + (check ? ' [' + check + ']' : ''),
      body: 'New order on Tinkerleaf\n\n' +
        'Order ID: ' + p.order_id + '\n' +
        'Name: ' + p.name + '\nPhone: ' + p.phone + '\nEmail: ' + (p.customer_email || '-') + '\n' +
        'Address: ' + p.address + ', ' + p.city + ' - ' + p.pincode + '\n\n' +
        'Items: ' + p.items + '\n' +
        'Subtotal: Rs ' + p.subtotal + '\n' +
        (Number(p.discount) > 0 ? 'Coupon: ' + (p.coupon || '-') + ' (- Rs ' + p.discount + ')\n' : '') +
        'Delivery: Rs ' + p.delivery + '\nTotal: Rs ' + p.total + '\n' +
        'Payment: ' + p.payment + (p.utr ? ' (UTR ' + p.utr + ')' : '') + (p.rzp_payment_id ? ' (Razorpay ' + p.rzp_payment_id + ')' : '') + '\n' +
        (check ? 'Payment check: ' + check + '\n' : '') +
        (p.gstin ? 'GST invoice: ' + p.gst_business + ' / ' + p.gstin + '\n' : '')
    });
    return ContentService.createTextOutput('ok');
  } finally {
    lock.releaseLock();
  }
}

function handleQuote_(p) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(QUOTE_SHEET) || ss.insertSheet(QUOTE_SHEET);
  if (sh.getLastRow() === 0) {
    sh.getRange(1, 1, 1, QUOTE_HEADERS.length).setValues([QUOTE_HEADERS]);
    sh.setFrozenRows(1);
  }
  var n = sh.getLastRow() - 1;
  var ids = n > 0 ? sh.getRange(2, 2, n, 1).getValues().flat() : [];
  if (ids.indexOf(p.quote_id) !== -1) return ContentService.createTextOutput('duplicate');
  sh.appendRow([p.time, p.quote_id, p.name, p.organisation, "'" + p.phone, p.customer_email, p.items, p.notes, 'New']);
  MailApp.sendEmail({
    to: OWNER_EMAIL,
    subject: p._subject || ('Quotation request ' + p.quote_id),
    body: 'New quotation request on Tinkerleaf\n\n' +
      'Quote ID: ' + p.quote_id + '\nName: ' + p.name + '\nOrganisation: ' + p.organisation + '\n' +
      'Phone: ' + p.phone + '\nEmail: ' + (p.customer_email || '-') + '\n\n' +
      'Products: ' + p.items + '\n' + (p.notes ? 'Notes: ' + p.notes + '\n' : '')
  });
  return ContentService.createTextOutput('ok');
}

function doGet() { return ContentService.createTextOutput('Tinkerleaf order endpoint is live'); }
