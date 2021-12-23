import http from 'k6/http';
import { sleep } from 'k6';

const token = 'eyJraWQiOiIzaHRkdFBYQnM2bFVUNGtTajhjcVRkUFhxTktoQ2ZaSW80QWdBQWhscGlVPSIsImFsZyI6IlJTMjU2In0.eyJvcmlnaW5fanRpIjoiYmRhYzgwNjQtYTA0Yy00MTczLWEwOTktN2U5OWE5ZDI2NGUzIiwic3ViIjoiZWIwNDI3ODktMjRjOC00ZjY3LWE1N2ItMWY4NTlmYWFmNGM0IiwiZXZlbnRfaWQiOiI4NmRmNjI2Ny0wN2VjLTRhYjYtYWEwMy0zMjk5NzFiNzQyM2YiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6ImF3cy5jb2duaXRvLnNpZ25pbi51c2VyLmFkbWluIiwiYXV0aF90aW1lIjoxNjQwMjYzNDE5LCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuZXUtY2VudHJhbC0xLmFtYXpvbmF3cy5jb21cL2V1LWNlbnRyYWwtMV9kWTRaZmlaRVkiLCJleHAiOjE2NDAzNDk4MTksImlhdCI6MTY0MDI2MzQxOSwianRpIjoiZjk2N2Q2NTQtNTU2Mi00ZmE4LWE5NjktMmVmYTEyMmU3MDFjIiwiY2xpZW50X2lkIjoiNTdsOGxmdGdyaHJldmtob3NkZG51aTZjODYiLCJ1c2VybmFtZSI6InF3ZXJ0eUBnbWFpbC5jb20ifQ.lpMipAP_aKKWmDXCQyO87GOW8qXzAg5kVAtJSDLzkN1G9id_Aqsf-lXlMwsphCKO0EDDwnCYsFsEefOFudXA4wS2y-cnXlPGf2GqhqNnLjOD55rxDO8Fi6n2-KAEPIQhwFkH2nlL_ZEr4vuNHvnBlGObIS7KBITOPP89HUfCXa1fN8AFhAP3oswt5GgiO9GgnT_SDHIFjgQp_VGkDRjJP0s1DTSny4Qwjbvja5OpWeC9aV3jr4qWq2udYbgLPpIC61KKujB44tKHyQF9lDeBC00tSL4ZzfBGfX-lV8i--zit6qYsIO12KZFrruhvhL7GG2yhgbGTX1UTpg_6UgjW6g';

export const options = {
  stages: [
    { duration: '30s', target: 20 },
    { duration: '1m30s', target: 10 },
    { duration: '20s', target: 0 },
  ],
};

export default function () {
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  http.get('http://localhost:5000/files/all', headers);
  sleep(1);
}
