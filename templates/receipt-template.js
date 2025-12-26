module.exports = {
    generate: function(billData) {
        return function(printer) {
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
                .text('================================')
                .align('lt');
            
            // Invoice info
            printer
                .text(`Invoice No  : ${billData.bill_number}`)
                .text(`Date        : ${billData.date} ${billData.time}`)
                .text(`Cashier     : ${billData.cashier}`)
                .text(`Steward     : ${billData.steward}`)
                .text(`Table       : ${billData.table}`)
                .text('================================')
                .text('');
            
            // Items
            billData.items.forEach(item => {
                printer
                    .text(`${item.name}`)
                    .text(`${item.quantity}.00    x    ${item.unit_price}        ${item.total}`)
                    .text('');
            });
            
            // Separator
            printer.text('================================');
            
            // Totals
            const formatRightAlign = (label, value) => {
                const line = `${label}${value}`;
                const padding = 32 - line.length;
                return `${label}${' '.repeat(Math.max(0, padding))}${value}`;
            };
            
            printer
                .text(formatRightAlign('Gross Amount      : ', billData.gross_amount))
                .text(formatRightAlign('Bill Discount     : ', billData.bill_discount))
                .text(formatRightAlign('Service Charge    : ', billData.service_charge))
                .text(formatRightAlign('Other             : ', billData.other))
                .text('================================')
                .text('')
                .style('b')
                .size(1, 2)
                .text(formatRightAlign('Net Total         : ', billData.net_total))
                .size(1, 1)
                .style('normal')
                .text('================================')
                .text('')
                .text(`Item Count        :    ${billData.item_count}`)
                .text('')
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