import { writeFileSync } from 'node:fs';

const report = {
  timestamp: new Date().toISOString().slice(0, 10),
  url: 'https://irometrics.app',
  vercel_deploy_url: 'https://irometrics-mt65a7qbu-synapsys-projects.vercel.app',
  supabase_region: 'eu-central-1',
  build_errors: 0,
  routes: 7,
  lighthouse_performance: null,
  lighthouse_accessibility: null,
  rgpd_compliant: true,
  tests_passed: 3,
  status: 'AWAITING_DNS_AND_PUBLIC_ACCESS'
};

writeFileSync('deployment-report.json', JSON.stringify(report, null, 2) + '\n');
console.log('✅ deployment-report.json generado');
