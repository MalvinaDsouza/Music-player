const { CloudSQL } = require('@google-cloud/sql');

const sqlClient = new CloudSQL({
  projectId: 'dataproc-412616',
});

async function getInsights() {
  const [instances] = await sqlClient.getInstances({
    database: 'music',
  });
  const instance = instances[0];

  const [stats] = await instance.getStats();
  console.log(stats); // View detailed Cloud SQL instance statistics
}

module.exports = { getInsights };