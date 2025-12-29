// KOT Template - Kitchen Order Ticket
// Optimized for 80mm thermal printer (48 chars normal, 24 chars double-width)

module.exports = {
    generate: function(orderData) {
        return function(printer) {
            const WIDTH = 32;  // Safe width for double-size text
            const SEPARATOR_THICK = '='.repeat(WIDTH);
            const SEPARATOR_THIN = '-'.repeat(WIDTH);
            const SEPARATOR_STAR = '*'.repeat(WIDTH);
            
            // Format order type for display
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
            
            // Get current time formatted
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
            
            // ADDITIONAL ORDER banner (if applicable)
            if (orderData.is_additional) {
                printer
                    .size(2, 2)
                    .text('')
                    .text('** ADDITIONAL **')
                    .size(1, 1)
                    .text('');
            }
            
            // Main title - KITCHEN ORDER (big)
            printer
                .size(2, 2)
                .text('KITCHEN ORDER')
                .size(1, 1)
                .text('');
            
            // ==========================================
            // ORDER TYPE - Prominently displayed
            // ==========================================
            const orderType = formatOrderType(orderData.order_type);
            
            // Highlight non-dine-in orders more prominently
            if (orderData.order_type && orderData.order_type !== 'dine_in') {
                printer
                    .style('b')
                    .size(2, 2)
                    .text('')
                    .text(`>>> ${orderType} <<<`)
                    .text('')
                    .size(1, 1);
            } else {
                printer
                    .style('b')
                    .size(1, 2)
                    .text(`[ ${orderType} ]`)
                    .size(1, 1)
                    .text('');
            }
            
            printer
                .style('normal')
                .text(SEPARATOR_THICK);
            
            // ==========================================
            // ORDER INFO
            // ==========================================
            printer
                .align('lt')
                .style('b')
                .size(1, 2);
            
            // Table number - BIG
            printer
                .text(`TABLE: ${orderData.table || 'N/A'}`);
            
            printer
                .size(1, 1)
                .style('normal')
                .text(`Server : ${orderData.server || 'N/A'}`)
                .text(`Time   : ${orderData.time || getTime()}`)
                .text(`Order  : #${orderData.sale_id || 'N/A'}`)
                .text(SEPARATOR_THICK)
                .text('');
            
            // ==========================================
            // ORDER NOTES (if any)
            // ==========================================
            if (orderData.notes && orderData.notes.trim() !== '') {
                printer
                    .style('b')
                    .align('ct')
                    .size(1, 2)
                    .text('*** SPECIAL NOTES ***')
                    .size(1, 1)
                    .align('lt')
                    .style('normal')
                    .text('');
                
                // Word wrap notes
                const notes = orderData.notes.trim();
                const words = notes.split(' ');
                let line = '';
                
                words.forEach(word => {
                    if ((line + ' ' + word).trim().length <= WIDTH) {
                        line = (line + ' ' + word).trim();
                    } else {
                        if (line) printer.text(line);
                        line = word;
                    }
                });
                if (line) printer.text(line);
                
                printer
                    .text('')
                    .text(SEPARATOR_STAR)
                    .text('');
            }
            
            // ==========================================
            // ITEMS - Grouped by category
            // ==========================================
            printer
                .align('ct')
                .style('b')
                .size(1, 1)
                .text('ITEMS')
                .text(SEPARATOR_THIN)
                .align('lt')
                .text('');
            
            // Group items by category
            const itemsByCategory = {};
            (orderData.items || []).forEach(item => {
                const cat = item.category || 'Other';
                if (!itemsByCategory[cat]) {
                    itemsByCategory[cat] = [];
                }
                itemsByCategory[cat].push(item);
            });
            
            // Print items by category
            Object.keys(itemsByCategory).forEach(category => {
                // Category header
                printer
                    .style('b')
                    .size(1, 1)
                    .text(`-- ${category.toUpperCase()} --`)
                    .style('normal');
                
                // Items in category
                itemsByCategory[category].forEach(item => {
                    // Item line with quantity - BIGGER
                    printer
                        .style('b')
                        .size(1, 2)
                        .text(`${item.quantity}x ${item.item_name}`);
                    
                    // Item-level notes (if any)
                    if (item.notes && item.notes.trim() !== '') {
                        printer
                            .size(1, 1)
                            .style('normal')
                            .text(`   >> ${item.notes.trim()}`);
                    }
                    
                    printer.size(1, 1);
                });
                
                printer.text('');
            });
            
            // ==========================================
            // FOOTER
            // ==========================================
            printer
                .text(SEPARATOR_THICK)
                .align('ct')
                .style('b')
                .size(1, 2)
                .text(`ORDER #${orderData.sale_id}`)
                .size(1, 1)
                .style('normal')
                .text(SEPARATOR_THICK);
            
            // Timestamp at bottom
            printer
                .align('ct')
                .text('')
                .text(new Date().toLocaleString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true
                }))
                .text('')
                .text('')
                .cut();
        };
    }
};
