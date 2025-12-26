const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

// Load configuration
const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

// Load templates
const kotTemplate = require('./templates/kot-template');
const barTemplate = require('./templates/bar-template');
const receiptTemplate = require('./templates/receipt-template');

// Logging function
function log(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    
    console.log(logMessage);
    if (data) console.log(JSON.stringify(data, null, 2));
    
    if (config.logging.enabled) {
        const logFile = config.logging.file;
        const logLine = data 
            ? `${logMessage}\n${JSON.stringify(data, null, 2)}\n`
            : `${logMessage}\n`;
        fs.appendFileSync(logFile, logLine);
    }
}

// Fetch pending jobs from API
async function fetchPendingJobs() {
    try {
        const response = await fetch(`${config.api.base_url}/get_pending_jobs.php`, {
            method: 'GET',
            headers: {
                'X-API-Key': config.api.api_key,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.error || 'Unknown API error');
        }
        
        return data.jobs || [];
        
    } catch (error) {
        log('error', 'Failed to fetch pending jobs', { error: error.message });
        return [];
    }
}

// Update job status via API
async function updateJobStatus(jobId, status, errorMessage = null) {
    try {
        const payload = {
            job_id: jobId,
            status: status
        };
        
        if (errorMessage) {
            payload.error_message = errorMessage;
        }
        
        const response = await fetch(`${config.api.base_url}/update_job_status.php`, {
            method: 'POST',
            headers: {
                'X-API-Key': config.api.api_key,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        
        const data = await response.json();
        
        if (!data.success) {
            log('warn', `Failed to update job ${jobId} status`, data);
        }
        
        return data.success;
        
    } catch (error) {
        log('error', `Error updating job ${jobId} status`, { error: error.message });
        return false;
    }
}

// Print to network printer
async function printToNetworkPrinter(printerIp, printerPort, receiptContent) {
    return new Promise((resolve, reject) => {
        const escpos = require('escpos');
        escpos.Network = require('escpos-network');
        
        const device = new escpos.Network(printerIp, printerPort);
        const printer = new escpos.Printer(device, { encoding: config.printing.encoding });
        
        // Set timeout
        const timeout = setTimeout(() => {
            device.close();
            reject(new Error('Print timeout'));
        }, config.printing.timeout);
        
        device.open(function(error) {
            clearTimeout(timeout);
            
            if (error) {
                reject(error);
                return;
            }
            
            try {
                // Execute print commands
                receiptContent(printer);
                
                // Close and resolve
                printer.close(() => {
                    resolve();
                });
                
            } catch (err) {
                device.close();
                reject(err);
            }
        });
    });
}

// Process a single print job
async function processJob(job) {
    log('info', `Processing job ${job.job_id} (${job.job_type}) for ${job.printer_name}`);
    
    // Update status to 'printing'
    await updateJobStatus(job.job_id, 'printing');
    
    let retries = 0;
    const maxRetries = config.printing.max_immediate_retries;
    
    while (retries <= maxRetries) {
        try {
            // Generate receipt content based on job type
            let receiptContent;
            
            if (job.job_type === 'kot') {
                receiptContent = kotTemplate.generate(job.job_data);
            } else if (job.job_type === 'bar_ticket') {
                receiptContent = barTemplate.generate(job.job_data);
            } else if (job.job_type === 'receipt') {
                receiptContent = receiptTemplate.generate(job.job_data);
            } else {
                throw new Error(`Unknown job type: ${job.job_type}`);
            }
            
            // Print to network printer
            await printToNetworkPrinter(job.printer_ip, job.printer_port, receiptContent);
            
            // Success - update status
            await updateJobStatus(job.job_id, 'printed');
            log('info', `✓ Job ${job.job_id} printed successfully`);
            
            return true;
            
        } catch (error) {
            retries++;
            
            if (retries <= maxRetries) {
                log('warn', `Print attempt ${retries} failed for job ${job.job_id}, retrying...`, { error: error.message });
                await new Promise(resolve => setTimeout(resolve, config.printing.retry_delay));
            } else {
                // All retries failed
                const errorMsg = `Print failed after ${maxRetries} retries: ${error.message}`;
                await updateJobStatus(job.job_id, 'failed', errorMsg);
                log('error', `✗ Job ${job.job_id} failed`, { error: error.message });
                return false;
            }
        }
    }
}

// Main polling loop for pending jobs
async function pollPendingJobs() {
    try {
        const jobs = await fetchPendingJobs();
        
        if (jobs.length > 0) {
            log('info', `Found ${jobs.length} pending job(s)`);
            
            for (const job of jobs) {
                await processJob(job);
            }
        }
        
    } catch (error) {
        log('error', 'Error in polling loop', { error: error.message });
    }
}

// Retry failed jobs loop
async function retryFailedJobs() {
    try {
        // We could fetch failed jobs here and retry them
        // For now, this is a placeholder
        // You can implement this later if needed
        
    } catch (error) {
        log('error', 'Error in retry loop', { error: error.message });
    }
}

// Start the print server
function startPrintServer() {
    console.log('╔════════════════════════════════════════════════════╗');
    console.log('║     KAMIKURA RESTAURANT - PRINT SERVER v1.0       ║');
    console.log('╚════════════════════════════════════════════════════╝');
    console.log('');
    log('info', 'Print server starting...');
    log('info', `API: ${config.api.base_url}`);
    log('info', `Poll interval: ${config.api.poll_interval}ms`);
    log('info', `Retry interval: ${config.api.retry_interval}ms`);
    console.log('');
    log('info', '✓ Print server running. Press Ctrl+C to stop.');
    console.log('');
    
    // Start polling for pending jobs
    setInterval(pollPendingJobs, config.api.poll_interval);
    
    // Start retry loop for failed jobs
    setInterval(retryFailedJobs, config.api.retry_interval);
    
    // Run immediately on start
    pollPendingJobs();
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('');
    log('info', 'Print server shutting down...');
    process.exit(0);
});

// Start the server
startPrintServer();