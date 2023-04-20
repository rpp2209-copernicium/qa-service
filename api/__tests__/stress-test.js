import http from 'k6/http';
import { check, sleep } from 'k6'; // sleep takes arg in seconds only (no ms)

http.setResponseCallback(http.expectedStatuses({ min: 200, max: 300 }));

// Smoke Test - Test Minimal Load
// export const smokeTest_options = {
//   stages: [
//     { duration: '30s', target: 20 },
//     { duration: '1m30s', target: 10 },
//     { duration: '20s', target: 0 },
//   ],
// };

// Performance Test - Test Normal Load
// export const loadTest_options = {
//   stages: [
//     { duration: '30s', target: 20 },
//     { duration: '1m30s', target: 10 },
//     { duration: '20s', target: 0 },
//   ],
// };

// Stress Test - Test under Extreme Conditions
// export const options = {
//   vus: 10,
//   duration: '30s'
// }

// Soak Test - Test Reliability Over a Longer Period of Time
// export const soakTest_options = {
//   stages: [
//     { duration: '30s', target: 20 },
//     { duration: '1m30s', target: 10 },
//     { duration: '20s', target: 0 },
//   ],
// };

export const options = {
  discardResponseBodies: true,

  thresholds: {
    http_req_duration: ['p(95)<50'], // allow up to <=50ms latency
    http_req_failed: ['rate<0.01'], // http errors should be less than 1%
    checks: ['rate>0.99'],
  },

  scenarios: {

    stress: {
      executor: 'ramping-arrival-rate',
      startRate: 1,
      timeUnit: '1s',
      preAllocatedVUs: 60,

      stages: [
        { duration: "10s", target: 1  },
        { duration: "20s", target: 5  },
        { duration: "10s", target: 1  },
        { duration: "20s", target: 0 }, // scale down. Recovery stage.
      ],

    },
  },

};

// QA Service API
// Load Test QA Perfomance Locally (No Nginx, No EC2, No Legacy Endpoints)
export default function () {
  
  const BASE_URL = 'http://localhost:8080/qa/questions';

  // Generate a random number between min and max:
  // Math.random() * (max - min) + min
  let min = 99999;
  let max = 999999;
  let id = Math.floor(Math.random() * (max - min) + min);
  let res = http.get(BASE_URL + `?product_id=${id}`);

  console.log(`Response Time: ${String(res.timings.duration)} ms \n| URL was: ${String(res.url)}`);
    
    // for (let i = 99999; i <= 999999; id++) {
    //   res = http.get(BASE_URL + `?product_id=${id}`);

    //   console.log(`Response Time: ${String(res.timings.duration)} ms
    //     \n| Errors: ${String(res.error)}
    //     \n| URL was: ${String(res.url)}
    //     \n| Status Text: ${String(res.status_text)}
    //   `);
    // }

}

// =============================================
//            Response Object Keys
// =============================================
// remote_ip,
// remote_port,
// url,
// status,
// status_text,
// proto,
// headers,
// cookies,
// body, 
// timings, 
// tls_version, 
// tls_cipher_suite,
// ocsp,
// error,
// error_code,
// request,
// getCtx