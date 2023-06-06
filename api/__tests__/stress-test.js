import http from 'k6/http';
import { check, sleep } from 'k6'; // sleep takes arg in seconds only (no ms)

http.setResponseCallback(http.expectedStatuses({ min: 200, max: 300 }));

export const options = {
  discardResponseBodies: true,

  thresholds: {
    http_req_duration: ['p(95)<50'], // allow up to <=50ms latency
    http_req_failed: ['rate<0.01'], // http errors should be less than 1%
    checks: ['rate>0.99'],
  },

  scenarios: {

    qStress: {
      executor: 'ramping-arrival-rate',

      startRate: 10,
      timeUnit: '1s',
      gracefulStop: '60s',

      // GET Q's Config
      preAllocatedVUs: 325,
      maxVUs: 500,
      stages: [
        { duration: "5s", target: 10  },

        { duration: "5s", target: 100 },
        { duration: "10s", target: 250 },

        { duration: "5s", target: 450  },
        { duration: "10s", target: 750 },
        { duration: "5s", target: 450 },

        { duration: "5s", target: 250  },
        { duration: "10s", target: 100 },

        { duration: "5s", target: 10 },
        { duration: "10s", target: 0 }, // scale down. Recovery stage.
      ],
    },
    
    aStress: {
      executor: 'ramping-arrival-rate',
  
      startRate: 10,
      timeUnit: '1s',
      gracefulStop: '60s',
      preAllocatedVUs: 375,
      maxVUs: 500,
      stages: [
        { duration: "5s", target: 10  },
  
        { duration: "5s", target: 600 },
        { duration: "10s", target: 1100 },
  
        { duration: "5s", target: 1250  },
        { duration: "10s", target: 1510 },
        { duration: "5s", target: 1250 },
  
        { duration: "5s", target: 1100  },
        { duration: "10s", target: 600 },
  
        { duration: "5s", target: 10 },
        { duration: "10s", target: 0 }, // scale down. Recovery stage.
      ],
    }
    
  },

}

export default function () {
  const BASE_URL = 'http://localhost:8080/qa/questions';

  // Generate a random number between min and max:

  // GET QUESTIONS min/max
  // let min = 99999;
  // let max = 999999;

  // GET ANSWERS min/max
  let min = 351896;
  let max = 3518963;
  let id = Math.floor(Math.random() * (max - min) + min);

  // TEST GET QUESTIONS
  // let res = http.get(BASE_URL + `?product_id=${id}`);

  // TEST GET ANSWERS
  let res = http.get(BASE_URL + `/${id}/answers`);
  //console.log(`Response Time: ${String(res.timings.duration)} ms \n| URL was: ${String(res.url)}`);
}