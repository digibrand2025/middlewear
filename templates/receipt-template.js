module.exports = {
    generate: function(billData) {
        return function(printer) {
            // CONSTANTS FOR 80mm PAPER
            const WIDTH = 48; // Standard 80mm paper character width (Font A)
            const SEPARATOR = '='.repeat(WIDTH);
            const THIN_SEPARATOR = '-'.repeat(WIDTH);

            // Helper to align text: "Label ........... Value"
            const formatLine = (label, value) => {
                const labelStr = String(label);
                const valueStr = String(value);
                const spacing = Math.max(0, WIDTH - labelStr.length - valueStr.length);
                return labelStr + ' '.repeat(spacing) + valueStr;
            };

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
                .text('')
                .style('b')
                .text('Customer Bill')
                .style('normal')
                .text(SEPARATOR)
                .align('lt');
            
            // Invoice info (formatted to use width)
            printer
                .text(formatLine('Invoice No :', billData.bill_number))
                .text(formatLine('Date       :', `${billData.date} ${billData.time}`))
                .text(formatLine('Cashier    :', billData.cashier))
                .text(formatLine('Steward    :', billData.steward))
                .text(formatLine('Table      :', billData.table))
                .text(SEPARATOR)
                .text('');
            
            // Items Header
            printer
                .style('b')
                .text(formatLine('ITEM', 'TOTAL')) // Column headers
                .style('normal')
                .text(THIN_SEPARATOR);

            // Items Loop
            billData.items.forEach(item => {
                // Row 1: Item Name
                printer.align('lt').text(item.name);
                
                // Row 2: Qty x Price (Left) ..... Total (Right)
                const calculation = `${item.quantity}.00 x ${item.unit_price}`;
                const line = formatLine(`  ${calculation}`, item.total);
                
                printer
                    .text(line)
                    .text(''); // Small spacing between items
            });
            
            // Separator
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
            
            // Net Total (Larger Font)
            printer
                .style('b')
                .size(1, 2) // Taller font for emphasis
                .text(formatLine('Net Total      :', billData.net_total))
                .size(1, 1) // Reset size
                .style('normal')
                .text(SEPARATOR)
                .text('')
                .text(formatLine('Item Count :', billData.item_count));

            // Footer
            printer
                .text('')
                .text('')
                .align('ct')
                .text('Software By Digibrand')
                .text('')
                .text('')
                .cut();
        };
    }
};
