// KOT Template - Kitchen Order Ticket
// Optimized for 80mm thermal printer
// Features: Large 'Additional' banner, tall item names, no categories, ultra-clean footer.

module.exports = {
    generate: function(orderData) {
        return function(printer) {
            const WIDTH = 32; 
            const SEPARATOR_THIN = '-'.repeat(WIDTH);
            
            // Format order type
            const formatOrderType = (type) => {
                const types = {
                    'dine_in': 'DINE IN',
                    'takeaway': 'TAKEAWAY',
                    'delivery': 'DELIVERY',
                    'uber_delivery': 'UBER EATS',
                    'pickme_delivery': 'PICKME'
                };
                return types[type] || type?.toUpperCase() || 'DINE IN';
            };
            
            const getTime = () => {
                return new Date().toLocaleTimeString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                });
            };
            
            // ==========================================
            // HEADER
            // ==========================================
            printer
                .font('a')
                .align('ct')
                .style('b');
            
            // LARGE ADDITIONAL BANNER
            if (orderData.is_additional) {
                printer
                    .size(2, 2) 
                    .text('ADDITIONAL')
                    .size(1, 1)
                    .text(SEPARATOR_THIN);
            }
            
            // Kitchen Order Title (Small)
            printer
                .size(1, 1) 
                .text('KITCHEN ORDER')
                .text(SEPARATOR_THIN);
            
            // ORDER TYPE
            const orderType = formatOrderType(orderData.order_type);
            printer
                .style('b')
                .size(orderData.order_type !== 'dine_in' ? 2 : 1, 2)
                .text(orderType)
                .size(1, 1)
                .style('normal')
                .text(''); 

            // ==========================================
            // ORDER INFO - Left Aligned
            // ==========================================
            printer.align('lt').style('b');
            
            if (orderData.table) {
                printer.size(2, 2).text(`TBL: ${orderData.table}`).size(1, 1);
            }
            
            printer
                .text(`Server : ${orderData.server || 'N/A'}`)
                .text(`Time   : ${orderData.time || getTime()}`)
                .style('normal')
                .text(''); 

            // ==========================================
            // SPECIAL NOTES
            // ==========================================
            if (orderData.notes && orderData.notes.trim() !== '') {
                printer
                    .style('b')
                    .align('ct')
                    .invert(true)
                    .text(' SPECIAL NOTES ')
                    .invert(false)
                    .align('lt')
                    .size(1, 2); 

                const notes = orderData.notes.trim();
                const words = notes.split(' ');
                let line = '';
                
                words.forEach(word => {
                    if ((line + ' ' + word).trim().length <= (WIDTH / 1.5)) { 
                        line = (line + ' ' + word).trim();
                    } else {
                        if (line) printer.text(line);
                        line = word;
                    }
                });
                if (line) printer.text(line);
                
                printer
                    .size(1, 1)
                    .style('normal')
                    .text(''); 
            }
            
            // ==========================================
            // ITEMS (Flat List - Category Removed)
            // ==========================================
            printer.text(''); // Space before items
            
            (orderData.items || []).forEach(item => {
                // Item Name: Tall but NOT bold
                printer
                    .align('lt')
                    .size(1, 2)
                    .text(`${item.quantity} x ${item.item_name}`);
                
                // Item Modifiers
                if (item.notes && item.notes.trim() !== '') {
                    printer
                        .size(1, 1)
                        .style('b')
                        .text(`   >> ${item.notes.trim()}`)
                        .style('normal');
                }
            });

            // Separator line after all items
            printer.text('').text(SEPARATOR_THIN);
            
            // ==========================================
            // FOOTER - Clean Cut
            // ==========================================
            printer
                .text('.') 
                .cut();
        };
    }
};