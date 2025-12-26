module.exports = {
    generate: function(orderData) {
        return function(printer) {
            // Header
            printer
                .font('a')
                .align('ct')
                .style('b')
                .size(2, 2)
                .text('KAMIKURA RESTAURANT')
                .size(1, 1)
                .style('normal')
                .text('123 Main St, Negombo')
                .text('Tel: 031-1234567')
                .text('================================')
                .align('lt');
            
            // Invoice info
            printer
                .text(`Invoice: ${orderData.invoice_number || 'N/A'}`)
                .text(`Date: ${new Date().toLocaleDateString()}`)
                .text(`Time: ${new Date().toLocaleTimeString()}`)
                .text(`Server: ${orderData.server}`)
                .text(`Table: ${orderData.table}`)
                .text('================================')
                .text('');
            
            // Items
            printer.text('ITEMS:');
            orderData.items.forEach(item => {
                const itemTotal = (item.quantity * item.unit_price).toFixed(2);
                printer
                    .text(`${item.quantity}x ${item.item_name}`)
                    .text(`      Rs. ${itemTotal}`)
                    .text('');
            });
            
            // Totals
            printer
                .text('--------------------------------')
                .text(`Subtotal:        Rs. ${orderData.subtotal || '0.00'}`)
                .text(`Service (10%):   Rs. ${orderData.service_charge || '0.00'}`)
                .text('--------------------------------')
                .style('b')
                .size(1, 2)
                .text(`TOTAL:           Rs. ${orderData.total || '0.00'}`)
                .size(1, 1)
                .style('normal')
                .text('================================')
                .text('')
                .align('ct')
                .text('Thank you for dining with us!')
                .text('www.kamikura.lk')
                .text('================================')
                .text('')
                .cut();
        };
    }
};