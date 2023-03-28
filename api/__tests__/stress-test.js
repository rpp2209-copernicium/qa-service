import http from 'k6/http';
import { sleep } from 'k6';

export default function () {
  http.get('https://test.k6.io');
  sleep(1);
}

// describe.only('', function() {
//   it('should', function() {
//       expect().toBe();
//   });
// });