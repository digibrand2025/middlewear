module.exports = {
    generate: function(billData) {
        return function(printer) {
            const WIDTH = 48;
            const SEPARATOR = '='.repeat(WIDTH);
            const THIN_SEPARATOR = '-'.repeat(WIDTH);

            const formatLine = (label, value) => {
                const labelStr = String(label);
                const valueStr = String(value);
                const spacing = Math.max(0, WIDTH - labelStr.length - valueStr.length);
                return labelStr + ' '.repeat(spacing) + valueStr;
            };

            // Determine if this is post-payment (has payment info)
            const isPostPayment = billData.payment_method || billData.amount_tendered;

            // Header
            printer
                .font('a')
                .align('ct')
                .style('b')
                .size(1, 1)
                .text('JAPANESE RESTAURANT')
                .size(2, 2)
                .text('KAMIKURA')
                .size(1, 1)
                .style('normal')
                .text('1A Park way, Park Road Colombo 5')
                .text('0112 554 555')
                .text('');

            // Title (different for pre/post payment)
            if (isPostPayment) {
                printer
                    .style('b')
                    .text('PAID RECEIPT')
                    .style('normal');
            } else {
                printer
                    .style('b')
                    .text('Customer Bill')
                    .style('normal');
            }

            printer
                .text(SEPARATOR)
                .align('lt');
            
            // Invoice info
            printer
                .text(formatLine('Invoice No :', billData.bill_number || 'DRAFT'))
                .text(formatLine('Date       :', billData.date))
                .text(formatLine('Time       :', billData.time || ''))
                .text(formatLine('Cashier    :', billData.cashier))
                .text(formatLine('Steward    :', billData.steward || billData.cashier))
                .text(formatLine('Table      :', billData.table))
                .text(SEPARATOR)
                .text('');
            
            // Items Header
            printer
                .style('b')
                .text(formatLine('ITEM', 'TOTAL'))
                .style('normal')
                .text(THIN_SEPARATOR);

            // Items Loop
            billData.items.forEach(item => {
                printer.align('lt').text(item.name);
                const calculation = `${item.quantity} x ${item.unit_price}`;
                const line = formatLine(`  ${calculation}`, item.total);
                printer.text(line).text('');
            });
            
            printer.text(SEPARATOR);
            
            // Totals
            printer
                .align('lt')
                .text(formatLine('Gross Amount   :', billData.gross_amount))
                .text(formatLine('Bill Discount  :', billData.bill_discount))
                .text(formatLine('Service Charge :', billData.service_charge))
                .text(formatLine('Other          :', billData.other))
                .text(SEPARATOR)
                .text('');
            
            // Net Total
            printer
                .style('b')
                .size(1, 2)
                .text(formatLine('Net Total      :', billData.net_total))
                .size(1, 1)
                .style('normal')
                .text(SEPARATOR);

            // === POST-PAYMENT ONLY SECTION ===
            if (isPostPayment) {
                printer
                    .text('')
                    .style('b')
                    .text('PAYMENT DETAILS')
                    .style('normal')
                    .text(THIN_SEPARATOR)
                    .text(formatLine('Payment Method :', billData.payment_method))
                    .text(formatLine('Amount Tendered:', billData.amount_tendered))
                    .text(formatLine('Change         :', billData.change_given))
                    .text(SEPARATOR);
            }

            // Footer
            printer
                .text('')
                .text(formatLine('Item Count :', billData.item_count))
                .text('')
                .text('')
                .align('ct');

            // Post-payment shows PAID stamp
            if (isPostPayment) {
                printer
                    .style('b')
                    .size(2, 2)
                    .text('PAID')
                    .size(1, 1)
                    .style('normal')
                    .text('');
            }

            printer
                .text('Thank you!')
                .text('')
                .text('Software By Digibrand')
                .text('')
                .text('')
                .cut();
        };
    }
};
