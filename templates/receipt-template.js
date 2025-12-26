module.exports = {
    generate: function(billData) {
        return function(printer) {
            // Helper function to pad/align text
            const leftRight = (left, right, width = 32) => {
                const rightStr = String(right);
                const leftStr = String(left);
                const spaces = width - leftStr.length - rightStr.length;
                return leftStr + ' '.repeat(Math.max(1, spaces)) + rightStr;
            };
            
            const rightAlign = (text, width = 32) => {
                const textStr = String(text);
                return ' '.repeat(Math.max(0, width - textStr.length)) + textStr;
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
                .text('1A Park way, Park Road')
                .text('Colombo 5')
                .text('0112 554 555')
                .text('')
                .style('b')
                .text('REPRINT INVOICE')
                .style('normal')
                .text('--------------------------------')
                .align('lt');
            
            // Invoice info
            printer
                .text(leftRight('Invoice No:', billData.bill_number))
                .text(leftRight('Date:', `${billData.date} ${billData.time}`))
                .text(leftRight('Cashier:', billData.cashier))
                .text(leftRight('Steward:', billData.steward))
                .text(leftRight('Table:', billData.table))
                .text('--------------------------------')
                .text('');
            
            // Items header
            printer.text('Item                  Qty  Price');
            printer.text('--------------------------------');
            
            // Items
            billData.items.forEach(item => {
                // Item name (truncate if too long)
                const itemName = item.name.length > 24 ? 
                    item.name.substring(0, 21) + '...' : 
                    item.name;
                printer.text(itemName);
                
                // Quantity, price and total on second line
                const qtyStr = `${parseFloat(item.quantity).toFixed(2)}`;
                const priceStr = `${parseFloat(item.unit_price).toFixed(2)}`;
                const totalStr = `${parseFloat(item.total).toFixed(2)}`;
                
                const qtyPrice = leftRight(`  ${qtyStr} x ${priceStr}`, totalStr);
                printer.text(qtyPrice);
            });
            
            // Separator
            printer.text('--------------------------------');
            
            // Totals
            printer
                .text(leftRight('Gross Amount:', parseFloat(billData.gross_amount).toFixed(2)))
                .text(leftRight('Bill Discount:', parseFloat(billData.bill_discount).toFixed(2)))
                .text(leftRight('Service Charge:', parseFloat(billData.service_charge).toFixed(2)))
                .text(leftRight('Other:', parseFloat(billData.other).toFixed(2)))
                .text('--------------------------------')
                .text('')
                .style('b')
                .size(1, 1)
                .text(leftRight('NET TOTAL:', parseFloat(billData.net_total).toFixed(2)))
                .size(1, 1)
                .style('normal')
                .text('--------------------------------')
                .text('')
                .text(leftRight('Item Count:', billData.item_count))
                .text('')
                .text('')
                .align('ct')
                .text('software by Digibrand.com')
                .text('')
                .text('')
                .cut();
        };
    }
};
