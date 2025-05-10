import http from 'k6/http';
import { check, sleep } from 'k6';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';

export const options = {
  stages: [
    { duration: '30s', target: 10 }, 
    { duration: '1m', target: 50 },  
    { duration: '30s', target: 0 },  
  ],
};

const BASE_URL = 'http://localhost';
const headers = { 'Content-Type': 'application/json' };

export default function () {
  const uniqueId = uuidv4();
  const email = `user_${uniqueId}@test.com`;

  const userPayload = JSON.stringify({
    first_name: "Shahd",
    last_name: "Hossam",
    email: email,
    password: "shahd123",
  });

  const userRes = http.post(`${BASE_URL}/v1/users`, userPayload, { headers });
  check(userRes, { 'user created': (r) => r.status === 200 || r.status === 201 });

  const orgPayload = JSON.stringify({
    organization_name: uniqueId,
    industry_type: "concerts",
    primary_contact_name: "Shahd Hossam",
    email: `org_${uniqueId}@test.com`,
    password: "shahdshahd",
    username: `shahdh_${uniqueId}`
  });

  const orgRes = http.post(`${BASE_URL}/v1/organizers`, orgPayload, { headers });
  check(orgRes, { 'organizer created': (r) => r.status === 200 || r.status === 201 });

  const vendorPayload = JSON.stringify({
    name: `Vendor_${uniqueId}`,
    genre: "bedroom pop",
    biography: "Claire Cottrill is an American singer-songwriter..."
  });

  const vendorRes = http.post(`${BASE_URL}/v1/vendor`, vendorPayload, { headers });
  check(vendorRes, { 'vendor created': (r) => r.status === 200 || r.status === 201 });
  const eventPayload = JSON.stringify({
    organizer_id: 1,
    vendor_name: `Vendor_${uniqueId}`,
    type: "Concert",
    facility: "Mesh3arfa",
    address: "123 Main St, Somewhere, MA 02101, USA",
    description: "Concert experience with Clairo.",
    date: "2025-04-16",
    city: "Boston",
    capacity: 200,
    ticket_types: [
        { type: "VIP", price: 500 },
        { type: "General Admission", price: 100 }
        ]
    });

    const eventRes = http.post(`${BASE_URL}/v1/events`, eventPayload, { headers });
    check(eventRes, { 'event created': (r) => r.status === 200 || r.status === 201 });
  sleep(1);
}
