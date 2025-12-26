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
                .text('REPRINT INVOICE')
                .style('normal')
                .text('------------------------------------------------')
                .align('lt');
            
            // Invoice info - use table format for better alignment
            printer
                .tableCustom([
                    { text: "Invoice No", align: "LEFT", width: 0.4 },
                    { text: ":", align: "CENTER", width: 0.1 },
                    { text: billData.bill_number, align: "LEFT", width: 0.5 }
                ])
                .tableCustom([
                    { text: "Date", align: "LEFT", width: 0.4 },
                    { text: ":", align: "CENTER", width: 0.1 },
                    { text: `${billData.date} ${billData.time}`, align: "LEFT", width: 0.5 }
                ])
                .tableCustom([
                    { text: "Cashier", align: "LEFT", width: 0.4 },
                    { text: ":", align: "CENTER", width: 0.1 },
                    { text: billData.cashier, align: "LEFT", width: 0.5 }
                ])
                .tableCustom([
                    { text: "Steward", align: "LEFT", width: 0.4 },
                    { text: ":", align: "CENTER", width: 0.1 },
                    { text: billData.steward, align: "LEFT", width: 0.5 }
                ])
                .tableCustom([
                    { text: "Table", align: "LEFT", width: 0.4 },
                    { text: ":", align: "CENTER", width: 0.1 },
                    { text: billData.table, align: "LEFT", width: 0.5 }
                ])
                .text('------------------------------------------------')
                .text('');
            
            // Items header
            printer
                .tableCustom([
                    { text: "Item", align: "LEFT", width: 0.50 },
                    { text: "Qty", align: "CENTER", width: 0.15 },
                    { text: "Price", align: "RIGHT", width: 0.17 },
                    { text: "Total", align: "RIGHT", width: 0.18 }
                ])
                .text('------------------------------------------------');
            
            // Items - using table for proper alignment
            billData.items.forEach(item => {
                printer
                    .tableCustom([
                        { text: item.name, align: "LEFT", width: 0.50 },
                        { text: item.quantity.toString(), align: "CENTER", width: 0.15 },
                        { text: parseFloat(item.unit_price).toFixed(2), align: "RIGHT", width: 0.17 },
                        { text: parseFloat(item.total).toFixed(2), align: "RIGHT", width: 0.18 }
                    ]);
            });
            
            // Separator
            printer.text('------------------------------------------------');
            
            // Totals - right aligned amounts
            printer
                .tableCustom([
                    { text: "Gross Amount", align: "LEFT", width: 0.65 },
                    { text: parseFloat(billData.gross_amount).toFixed(2), align: "RIGHT", width: 0.35 }
                ])
                .tableCustom([
                    { text: "Bill Discount", align: "LEFT", width: 0.65 },
                    { text: parseFloat(billData.bill_discount).toFixed(2), align: "RIGHT", width: 0.35 }
                ])
                .tableCustom([
                    { text: "Service Charge", align: "LEFT", width: 0.65 },
                    { text: parseFloat(billData.service_charge).toFixed(2), align: "RIGHT", width: 0.35 }
                ])
                .tableCustom([
                    { text: "Other", align: "LEFT", width: 0.65 },
                    { text: parseFloat(billData.other).toFixed(2), align: "RIGHT", width: 0.35 }
                ])
                .text('------------------------------------------------')
                .text('')
                .style('b')
                .size(1, 2);
            
            // Net total - larger and bold
            printer
                .tableCustom([
                    { text: "Net Total", align: "LEFT", width: 0.50, style: 'B' },
                    { text: parseFloat(billData.net_total).toFixed(2), align: "RIGHT", width: 0.50, style: 'B' }
                ])
                .size(1, 1)
                .style('normal')
                .text('------------------------------------------------')
                .text('');
            
            // Footer info
            printer
                .tableCustom([
                    { text: "Item Count", align: "LEFT", width: 0.65 },
                    { text: billData.item_count.toString(), align: "RIGHT", width: 0.35 }
                ])
                .text('')
                .text('')
                .align('ct')
                .text('Thank you for dining with us!')
                .text('software by Digibrand.com')
                .text('')
                .text('')
                .cut();
        };
    }
};
