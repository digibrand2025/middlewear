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
                .text('KITCHEN ORDER')
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
            
            // Group items by category
            const itemsByCategory = {};
            orderData.items.forEach(item => {
                const cat = item.category || 'Other';
                if (!itemsByCategory[cat]) {
                    itemsByCategory[cat] = [];
                }
                itemsByCategory[cat].push(item);
            });
            
            // Print items by category
            Object.keys(itemsByCategory).forEach(category => {
                printer
                    .style('b')
                    .text(category.toUpperCase() + ':')
                    .style('normal');
                
                itemsByCategory[category].forEach(item => {
                    printer
                        .size(1, 1)
                        .text(`  ${item.quantity}x ${item.item_name}`);
                });
                
                printer.text('');
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