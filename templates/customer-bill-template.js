// Customer Bill Template (Pre-Payment Receipt)
// This matches the Kamikura receipt format from the image

module.exports = {
    generate: function(billData) {
        return function(printer) {
            // Header
            printer
                .font('a')
                .align('ct')
                .style('normal')
                .text('JAPANESE RESTAURANT')
                .style('b')
                .size(1, 1)
                .text('KAMIKURA')
                .style('normal')
                .size(1, 1)
                .text('1A Park way, Park Road Colombo 5')
                .text('0112 554 555')
                .text('')
                .text('--------------------------------')
                .text('');
            
            // Bill Number (not invoice - this is pre-payment)
            printer
                .align('lt')
                .text(`Bill No    : ${billData.bill_number || 'DRAFT'}`)
                .text(`Date       : ${billData.date}`)
                .text(`Cashier    : ${billData.cashier}`)
                .text(`Steward    : ${billData.steward || billData.cashier}`)
                .text(`Table      : ${billData.table}`)
                .text('--------------------------------')
                .text('');
            
            // Items
            billData.items.forEach(item => {
                const itemTotal = (item.quantity * item.unit_price).toFixed(2);
                const itemLine = `${item.item_name}`;
                const qtyLine = `${item.quantity.toFixed(2).padStart(6)}  x  ${item.unit_price.toFixed(2).padStart(10)}  ${itemTotal.padStart(10)}`;
                
                printer
                    .text(itemLine)
                    .text(qtyLine)
                    .text('');
            });
            
            printer.text('--------------------------------');
            
            // Totals
            printer
                .text(`Gross Amount  :      ${billData.subtotal.padStart(10)}`)
                .text(`Bill Discount :      ${billData.discount.padStart(10)}`)
                .text(`Service Charge:      ${billData.service_charge.padStart(10)}`)
                .text(`Other         :      ${billData.other.padStart(10)}`)
                .text('--------------------------------')
                .style('b')
                .size(1, 1)
                .text(`Net Total     :      ${billData.total.padStart(10)}`)
                .style('normal')
                .text('================================')
                .text('')
                .text(`Item Count    : ${billData.item_count}`)
                .text('')
                .text('')
                .align('ct')
                .text('Thank you!')
                .text('')
                .text('')
                .cut();
        };
    }
};
