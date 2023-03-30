import http from 'k6/http';
// K6 Provided Functions: check(), sleep() -- sleep takes arg in seconds only (no ms)
import { check, sleep } from 'k6';

// EXAMPLE WITHOUT STAGES
// export const options = {
//   vus: 10,
//   duration: '30s',
// };

// EXAMPLE WITH STAGES
// export const options = {
//   stages: [
//     { duration: '30s', target: 20 },
//     { duration: '1m30s', target: 10 },
//     { duration: '20s', target: 0 },
//   ],
// };

// Smoke Test
// Test Minimal Load
export const smokeTest_options = {
  // stages: [
  //   { duration: '30s', target: 20 },
  //   { duration: '1m30s', target: 10 },
  //   { duration: '20s', target: 0 },
  // ],
};

// Performance Test
// Test Normal Load
export const loadTest_options = {
  // stages: [
  //   { duration: '30s', target: 20 },
  //   { duration: '1m30s', target: 10 },
  //   { duration: '20s', target: 0 },
  // ],
};

// Stress Test
// Test under Extreme Conditions
export const options = {
  scenarios: {
    stress: {
      executor: "ramping-arrival-rate",
      preAllocatedVUs: 500,
      timeUnit: "1s",
      stages: [
        { duration: "2m", target: 10 }, // below normal load
        { duration: "5m", target: 10 },
        { duration: "2m", target: 20 }, // normal load
        { duration: "5m", target: 20 },
        { duration: "2m", target: 30 }, // around the breaking point
        { duration: "5m", target: 30 },
        { duration: "2m", target: 40 }, // beyond the breaking point
        { duration: "5m", target: 40 },
        { duration: "10m", target: 0 }, // scale down. Recovery stage.
      ],
    },
  },
};

// Soak Test
// Test Reliability Over a Longer Period of Time
export const soakTest_options = {
  // stages: [
  //   { duration: '30s', target: 20 },
  //   { duration: '1m30s', target: 10 },
  //   { duration: '20s', target: 0 },
  // ],
};

// Test k6 works before dropping in QA API
export default function () {
  const BASE_URL = "https://test-api.k6.io"; // make sure this is not production
  const responses = http.batch([
    ["GET", `${BASE_URL}/public/crocodiles/1/`],
    ["GET", `${BASE_URL}/public/crocodiles/2/`],
    ["GET", `${BASE_URL}/public/crocodiles/3/`],
    ["GET", `${BASE_URL}/public/crocodiles/4/`],
  ]);
}

// QA Service API (TODO)
export default function () {
  const BASE_URL = 'http://localhost:3000/qa/questions';
  const responses = http.batch([
    ["GET", /* REAL API TODO */],
    ["GET", /* REAL API TODO */],
    ["GET", /* REAL API TODO */],
    ["GET", /* REAL API TODO */],
  ]);
}

