import { check, sleep } from 'k6';
import http from 'k6/http';

export const options = {
  stages: [
    { duration: '10s', target: 1000 }, // 10초동안 2000명의 유저가 동시에 요청
    // { duration: "1m", target: 800 },
    // { duration: "30s",c target: 0 },
    // { duration: '10s', target: 1000 },
  ],
  thresholds: {
    http_req_duration: ['p(99)<100'],
  },
};

// export default () => {
//   const res = http.get('http://localhost:4000/api/v2/apartments');
//   check(res, { 'status was 200': (r) => r.status === 200 });
//   sleep(1);
// };

/**
 * 가입한 입주자들 get 성능 테스트
 */
export default () => {
  const res = http.get('http://localhost:4000/api/v2/users/residents', {
    headers: {
      Cookie:
        'access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmZDg5OTMzNC1hNTQ4LTQ3MTAtODFhZi1hZjc3ZDE5OGNhODYiLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NjkxNTg1MjAsImV4cCI6MTc2OTE1OTQyMH0.pMTEaAOSKlsElDp7UySyxqsJ43bKYGJj7Nvs7pfEB6U;',
    },
  });
  check(res, { 'status was 200': (r) => r.status === 200 });
  sleep(1);
};
