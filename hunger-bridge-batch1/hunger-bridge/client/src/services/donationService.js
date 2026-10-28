import api from "./api";

export async function createDonation(payload) {
  const { data } = await api.post("/donations", payload);
  return data;
}

export async function getMyDonations(status) {
  const { data } = await api.get("/donations/mine", { params: status ? { status } : {} });
  return data.donations;
}

export async function getAvailableDonations(filters = {}) {
  const { data } = await api.get("/donations", { params: filters });
  return data.donations;
}

export async function getDonationById(id) {
  const { data } = await api.get(`/donations/${id}`);
  return data.donation;
}

export async function updateDonation(id, payload) {
  const { data } = await api.put(`/donations/${id}`, payload);
  return data.donation;
}

export async function cancelDonation(id) {
  const { data } = await api.patch(`/donations/${id}/cancel`);
  return data.donation;
}

export async function markCollected(id) {
  const { data } = await api.patch(`/donations/${id}/collect`);
  return data.donation;
}

export async function markDistributed(id) {
  const { data } = await api.patch(`/donations/${id}/distribute`);
  return data.donation;
}

export async function markCompleted(id) {
  const { data } = await api.patch(`/donations/${id}/complete`);
  return data.donation;
}
