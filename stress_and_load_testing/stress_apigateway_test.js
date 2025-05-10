import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '30s', target: 50 },
    { duration: '30s', target: 100 },
    { duration: '30s', target: 200 },
    { duration: '30s', target: 400 }, 
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000'], 
    http_req_failed: ['rate<0.1'],    
  },
};

const BASE_URL = 'http://localhost'

let users_payload = JSON.stringify({
    "first_name":"shahd",
    "last_name":"hossam",
    "email":"shahd@gmail.com",
    "password":"shahd123"
})
let orgainzers_payload = JSON.stringify({
    "organization_name":"cairo's organization",
    "industry_type":"concerts",
    "primary_contact_name":"shahd hossam",
    "email":"shahd@gmail.com",
    "password":"shahdshahd",
    "username":"shahdh"
})
let vendors_payload = JSON.stringify({
    "name":"Clairo",
    "genre":"bedroom pop",
    "biography":"Claire Elizabeth Cottrill (born August 18, 1998), known professionally as Clairo, is an American singer-songwriter. She began posting music on the internet ..."
})
let events_payload = JSON.stringify({
  "organizer_id": 1,
  "vendor_name": "Clairo",
  "type": "Concert",
  "facility": "Mesh3arfa",
  "address": "123 Main St, Somewhere, MA 02101, USA",
  "description": "Join us for a one-of-a-kind concert experience with Clairo, featuring an intimate set of her latest hits and crowd favorites. Don't miss out on this special evening!",
  "date": "2025-04-16",
  "city": "Boston",
  "capacity": 200,
  "ticket_types": [
    {
      "type": "VIP",
      "price": 500
    },
    {
      "type": "General Admission",
      "price": 100
    }
  ]
})
let headers = { 'Content-Type': 'application/json' };

export default function () {
  let users_endpoint = http.post(`${BASE_URL}/v1/users`, users_payload, {headers})
  check(users_endpoint, {
    'status is 200': (r) => r.status === 200,
  })
  let orgainzers_endpoint = http.post(`${BASE_URL}/v1/organizers`, orgainzers_payload, {headers})
  check(orgainzers_endpoint, {
    "status is 200": (r)=> r.status === 200
  })
  let vendors_endpoint = http.post(`${BASE_URL}/v1/vendor`, vendors_payload, {headers})
  check(vendors_endpoint, {
    "status is 200": (r)=> r.status === 200
  })
  let events_endpoint = http.post(`${BASE_URL}/v1/events`, events_payload, {headers})
  check(events_endpoint, {
    "status is 200": (r)=> r.status === 200
  })
  sleep(1)
}

