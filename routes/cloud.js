const { MetricServiceClient } = require('@google-cloud/monitoring');
const express = require('express');
const router = express.Router();

const client = new MetricServiceClient({ keyFilename: '/Users/malvinadsouza/Desktop/Music-player/dataproc-412616-9585f1ba4df6.json' });

router.get('/', async (req, res, next) => {
    try {
        const projectId = 'dataproc-412616'; // Replace with your GCP project ID
        const instanceName = 'yash123'; // Replace with your Cloud SQL instance name

        const resource = `projects/${projectId}/instances/${instanceName}`;

        // Define metrics to track (replace with relevant metrics for your needs)
        const metrics = [
            'cloudsql.googleapis.com/sql/backend_blocks',
            'cloudsql.googleapis.com/sql/cpu/usage',
            'cloudsql.googleapis.com/sql/memory/usage'
        ];

        const [data] = await client.listTimeSeries({ name: resource, filter: metrics.join(' OR ') });

        // Process and analyze metrics data here
        console.log('Cloud SQL metrics:', data);

        res.json(data);
    } catch (error) {
        console.error('Error fetching Cloud SQL metrics:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
