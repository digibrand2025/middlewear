module.exports = {
    generate: function(orderData) {
        return function(printer) {
            // Header
            printer
                .font('a')
                .align('ct')
                .style('b');
            
            // Show "ADDITIONAL ORDER" if needed
            if (orderData.is_additional) {
                printer
                    .size(2, 2)
                    .text('*** ADDITIONAL ***')
                    .size(1, 1);
            }
            
            printer
                .size(2, 2)
                .text('BAR ORDER')
                .size(1, 1)
                .text('================================')
                .style('normal')
                .align('lt');
            
            // Order info
            printer
                .text(`Table: ${orderData.table}`)
                .text(`Server: ${orderData.server}`)
                .text(`Time: ${new Date().toLocaleTimeString()}`)
                .text('================================')
                .text('');
            
            // Print items
            orderData.items.forEach(item => {
                printer
                    .style('b')
                    .size(1, 1)
                    .text(`${item.quantity}x ${item.item_name}`)
                    .style('normal')
                    .text('');
            });
            
            // Footer
            printer
                .text('================================')
                .align('ct')
                .text(`Order #${orderData.sale_id}`)
                .text('================================')
                .text('')
                .cut();
        };
    }
};