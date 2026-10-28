import api from "./api";

export async function createRequest(donationId, message) {
  const { data } = await api.post("/requests", { donationId, message });
  return data.request;
}

export async function getMyRequests() {
  const { data } = await api.get("/requests/mine");
  return data.requests;
}

export async function getRequestsForDonation(donationId) {
  const { data } = await api.get(`/requests/donation/${donationId}`);
  return data.requests;
}

export async function acceptRequest(requestId) {
  const { data } = await api.patch(`/requests/${requestId}/accept`);
  return data.donation;
}

export async function rejectRequest(requestId) {
  const { data } = await api.patch(`/requests/${requestId}/reject`);
  return data;
}

export async function cancelRequest(requestId) {
  const { data } = await api.patch(`/requests/${requestId}/cancel`);
  return data;
}
