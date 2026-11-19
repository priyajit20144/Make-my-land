const VALID_REQUEST_STATUSES = ['pending', 'approved', 'rejected'];

function normalizeRequestStatus(status) {
  const normalized = typeof status === 'string' ? status.trim().toLowerCase() : '';
  return VALID_REQUEST_STATUSES.includes(normalized) ? normalized : 'pending';
}

module.exports = { normalizeRequestStatus, VALID_REQUEST_STATUSES };
