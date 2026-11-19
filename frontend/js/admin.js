// Immediate Session Verification to prevent flash of unauthorized UI
(() => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (!token || !user || user.role !== 'admin') {
    window.location.href = 'login.html';
  }
})();

const adminSelectors = {
  stats: document.getElementById('admin-stats'),
  properties: document.getElementById('admin-properties'),
  users: document.getElementById('admin-users'),
  requests: document.getElementById('admin-requests'),
  propertySearch: document.getElementById('admin-search'),
  propertyFilter: document.getElementById('admin-filter'),
  propertyStatus: document.getElementById('admin-status'),
  logout: document.getElementById('admin-logout'),
  welcome: document.getElementById('admin-welcome')
};

const getRequestBadge = (status) => {
  const normalized = (status || 'pending').toLowerCase();
  if (normalized === 'approved') return '<span class="badge bg-success">Approved</span>';
  if (normalized === 'rejected') return '<span class="badge bg-danger">Rejected</span>';
  return '<span class="badge bg-warning text-dark">Pending</span>';
};

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const redirectToLogin = () => {
  window.location.href = 'login.html';
};

const handleAdminError = (response) => {
  if (!response) return true;
  if (response.status === 401 || response.status === 403) {
    redirectToLogin();
    return true;
  }
  return false;
};

const fetchJson = async (url, options = {}) => {
  const response = await fetch(url, { headers: { ...getAuthHeaders(), ...options.headers }, ...options });
  if (handleAdminError(response)) return null;
  return response.json();
};

const renderProperties = (properties) => {
  if (!properties || !properties.length) {
    return '<tr><td colspan="5" class="text-center text-muted">No listings found</td></tr>';
  }
  return properties.map((property) => `
    <tr>
      <td>${property.title}</td>
      <td>${property.ownerName}</td>
      <td>₹${property.price.toLocaleString()}</td>
      <td>${property.verified ? '<span class="badge bg-success">Verified</span>' : '<span class="badge bg-warning text-dark">Pending</span>'}</td>
      <td>
        <button class="btn btn-sm btn-success approve-property" data-id="${property._id}" ${property.verified ? 'disabled' : ''}>Approve</button>
        <button class="btn btn-sm btn-danger delete-property" data-id="${property._id}">Delete</button>
      </td>
    </tr>
  `).join('');
};

const renderUsers = (users) => {
  if (!users || !users.length) {
    return '<tr><td colspan="3" class="text-center text-muted">No users found</td></tr>';
  }
  return users.map((user) => `
    <tr>
      <td>${user.name}</td>
      <td>
        <select class="form-select form-select-sm user-role" data-id="${user._id}">
          <option value="buyer" ${user.role === 'buyer' ? 'selected' : ''}>Buyer</option>
          <option value="seller" ${user.role === 'seller' ? 'selected' : ''}>Seller</option>
          <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
        </select>
      </td>
      <td>
        <button class="btn btn-sm btn-outline-light view-user-details" data-id="${user._id}">
          👁 View
        </button>
      </td>
    </tr>
  `).join('');
};

const renderRequests = (requests) => {
  if (!requests || !requests.length) {
    return '<li class="list-group-item text-center text-muted">No requests found</li>';
  }
  return requests.slice(0, 8).map((request) => `
    <li class="list-group-item">
      <div class="d-flex justify-content-between align-items-start gap-2 mb-2">
        <div>
          <strong>${request.name}</strong><br />
          ${request.preferredLocation} · ₹${request.budget.toLocaleString()}<br />
          ${request.landType} · ${request.email}
        </div>
        ${getRequestBadge(request.status)}
      </div>
      <div class="d-flex gap-2 mt-2">
        <button class="btn btn-sm btn-success approve-request" data-id="${request._id}">Approve</button>
        <button class="btn btn-sm btn-outline-light reject-request" data-id="${request._id}">Reject</button>
      </div>
    </li>
  `).join('');
};

const refreshProperties = async () => {
  const query = [];
  if (adminSelectors.propertySearch?.value) query.push(`search=${encodeURIComponent(adminSelectors.propertySearch.value)}`);
  if (adminSelectors.propertyFilter?.value) query.push(`landType=${encodeURIComponent(adminSelectors.propertyFilter.value)}`);
  if (adminSelectors.propertyStatus?.value) query.push(`verified=${encodeURIComponent(adminSelectors.propertyStatus.value)}`);
  const queryString = query.length ? `?${query.join('&')}` : '';

  const properties = await fetchJson(`/api/admin/properties${queryString}`);
  adminSelectors.properties.innerHTML = renderProperties(properties);
};

const initAdminPage = async () => {
  if (!adminSelectors.stats) return;

  const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
  if (adminSelectors.welcome) {
    adminSelectors.welcome.textContent = currentUser ? `Signed in as ${currentUser.name} (${currentUser.role})` : 'Review listings, buyer requests, and user accounts from a single admin dashboard.';
  }

  if (adminSelectors.logout) {
    adminSelectors.logout.addEventListener('click', () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = 'login.html';
    });
  }

  const stats = await fetchJson('/api/admin/stats');
  if (stats) {
    document.getElementById('total-properties').textContent = stats.totalProperties;
    document.getElementById('total-users').textContent = stats.totalUsers;
    document.getElementById('total-requests').textContent = stats.totalBuyRequests;
    document.getElementById('pending-properties').textContent = stats.pendingProperties;
    document.getElementById('pending-buy-requests').textContent = stats.pendingBuyRequests;
    document.getElementById('approved-buy-requests').textContent = stats.approvedBuyRequests;
  }

  const users = await fetchJson('/api/admin/users');
  if (users && adminSelectors.users) {
    adminSelectors.users.innerHTML = renderUsers(users);
  }

  const requests = await fetchJson('/api/admin/requests');
  if (requests && adminSelectors.requests) {
    adminSelectors.requests.innerHTML = renderRequests(requests);
  }

  await refreshProperties();

  if (adminSelectors.properties) {
    adminSelectors.properties.addEventListener('click', async (event) => {
      const approveButton = event.target.closest('.approve-property');
      const deleteButton = event.target.closest('.delete-property');
      if (approveButton) {
        const propertyId = approveButton.dataset.id;
        const res = await fetchJson(`/api/admin/properties/${propertyId}/approve`, { method: 'POST' });
        if (res) await refreshProperties();
      }
      if (deleteButton) {
        const propertyId = deleteButton.dataset.id;
        if (!confirm('Delete this property?')) return;
        const res = await fetchJson(`/api/admin/properties/${propertyId}`, { method: 'DELETE' });
        if (res) await refreshProperties();
      }
    });
  }

  if (adminSelectors.requests) {
    adminSelectors.requests.addEventListener('click', async (event) => {
      const approveButton = event.target.closest('.approve-request');
      const rejectButton = event.target.closest('.reject-request');
      if (approveButton) {
        const requestId = approveButton.dataset.id;
        const res = await fetchJson(`/api/admin/requests/${requestId}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'approved' })
        });
        if (res) {
          const requests = await fetchJson('/api/admin/requests');
          if (requests && adminSelectors.requests) {
            adminSelectors.requests.innerHTML = renderRequests(requests);
          }
          const stats = await fetchJson('/api/admin/stats');
          if (stats) {
            document.getElementById('total-properties').textContent = stats.totalProperties;
            document.getElementById('total-users').textContent = stats.totalUsers;
            document.getElementById('total-requests').textContent = stats.totalBuyRequests;
            document.getElementById('pending-properties').textContent = stats.pendingProperties;
            document.getElementById('pending-buy-requests').textContent = stats.pendingBuyRequests;
            document.getElementById('approved-buy-requests').textContent = stats.approvedBuyRequests;
          }
        }
      }
      if (rejectButton) {
        const requestId = rejectButton.dataset.id;
        const res = await fetchJson(`/api/admin/requests/${requestId}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'rejected' })
        });
        if (res) {
          const requests = await fetchJson('/api/admin/requests');
          if (requests && adminSelectors.requests) {
            adminSelectors.requests.innerHTML = renderRequests(requests);
          }
          const stats = await fetchJson('/api/admin/stats');
          if (stats) {
            document.getElementById('total-properties').textContent = stats.totalProperties;
            document.getElementById('total-users').textContent = stats.totalUsers;
            document.getElementById('total-requests').textContent = stats.totalBuyRequests;
            document.getElementById('pending-properties').textContent = stats.pendingProperties;
            document.getElementById('pending-buy-requests').textContent = stats.pendingBuyRequests;
            document.getElementById('approved-buy-requests').textContent = stats.approvedBuyRequests;
          }
        }
      }
    });
  }

  // Handle role updates
  if (adminSelectors.users) {
    adminSelectors.users.addEventListener('change', async (event) => {
      const select = event.target.closest('.user-role');
      if (!select) return;
      const userId = select.dataset.id;
      const role = select.value;
      const updated = await fetchJson(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
      });
      if (!updated) {
        alert('Failed to update role');
      }
    });

    // Handle detailed user viewing
    adminSelectors.users.addEventListener('click', async (event) => {
      const viewButton = event.target.closest('.view-user-details');
      if (!viewButton) return;

      const userId = viewButton.dataset.id;
      const detailsBody = document.getElementById('user-details-body');
      if (!detailsBody) return;

      detailsBody.innerHTML = `<div class="text-center py-4"><div class="spinner-border text-gold" role="status"></div></div>`;

      const modalElement = document.getElementById('userDetailsModal');
      const modal = new bootstrap.Modal(modalElement);
      modal.show();

      try {
        const user = await fetchJson(`/api/admin/users/${userId}`);
        if (user) {
          detailsBody.innerHTML = `
            <div class="user-details-modal-content">
              <div class="d-flex align-items-center mb-3">
                <div class="user-avatar-placeholder bg-gold text-dark d-flex align-items-center justify-content-center fw-bold me-3" style="width: 50px; height: 50px; border-radius: 50%; font-size: 1.25rem;">
                  ${user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h6 class="mb-0 text-white">${user.name}</h6>
                  <span class="badge ${user.role === 'admin' ? 'bg-danger' : user.role === 'seller' ? 'bg-info text-dark' : 'bg-secondary'}">${user.role.toUpperCase()}</span>
                </div>
              </div>
              <table class="table table-borderless text-white mb-0" style="font-size: 0.9rem;">
                <tbody>
                  <tr>
                    <td class="text-muted ps-0" style="width: 100px;">Email:</td>
                    <td>${user.email}</td>
                  </tr>
                  <tr>
                    <td class="text-muted ps-0">Phone:</td>
                    <td>${user.phone || '—'}</td>
                  </tr>
                  <tr>
                    <td class="text-muted ps-0">Joined:</td>
                    <td>${new Date(user.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}</td>
                  </tr>
                  <tr>
                    <td class="text-muted ps-0">Status:</td>
                    <td>
                      ${user.verified ? '<span class="text-success">✓ Verified Account</span>' : '<span class="text-warning">Pending Verification</span>'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          `;
        } else {
          detailsBody.innerHTML = `<p class="text-danger text-center mb-0">Failed to load user details.</p>`;
        }
      } catch (error) {
        detailsBody.innerHTML = `<p class="text-danger text-center mb-0">Error fetching user details.</p>`;
      }
    });
  }

  const controls = [adminSelectors.propertySearch, adminSelectors.propertyFilter, adminSelectors.propertyStatus];
  controls.forEach((control) => {
    if (!control) return;
    const eventName = control.tagName === 'SELECT' ? 'change' : 'input';
    control.addEventListener(eventName, () => refreshProperties());
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAdminPage);
} else {
  initAdminPage();
}
