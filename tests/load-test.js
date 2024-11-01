// TESTE DE CARGA - LOAD TEST 

import http from 'k6/http';
import { check, sleep } from 'k6';

import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export function handleSummary(data) {
    return {
      "summary.html": htmlReport(data),
    };
  }

export const options = {
    stages: [
        { duration: '30s', target: 0 },   // Nenhum usuário no início
        { duration: '5m', target: 500 },  // Aumenta para 500 usuários em 5 minutos
        { duration: '30s', target: 500 }, // Mantém 500 usuários por 30 segundos
        { duration: '30s', target: 0 },  // Diminui a carga para 0 usuários em 30 segundos
    ],
};

export default function () {
    const url = 'https://jsonplaceholder.typicode.com/posts'; 

    const payload = JSON.stringify({
        title: 'foo',
        body: 'bar',
        userId: 1,
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const res = http.post(url, payload, params);

    check(res, {
        'status is 201': (r) => r.status === 201,
    });

    sleep(1);
}
