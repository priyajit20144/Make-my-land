document.addEventListener('DOMContentLoaded', () => {
  const splash = document.getElementById('splash');
  if (splash) {
    setTimeout(() => {
      splash.style.opacity = '0';
      splash.style.transition = 'opacity 0.8s ease';
      setTimeout(() => splash.remove(), 900);
    }, 1400);
  }

  if (window.AOS) {
    AOS.init({ duration: 800, once: true });
  }

  const storedTheme = localStorage.getItem('theme') || 'light';
  document.body.setAttribute('data-theme', storedTheme);

  const updateNavbar = () => {
    const navbarNav = document.querySelector('.navbar-nav');
    if (!navbarNav) return;

    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    let items = `
      <li class="nav-item"><a class="nav-link" href="index.html">Home</a></li>
    `;

    // Only show Buy/Sell if user is logged in
    if (token && user) {
      items += `
        <li class="nav-item"><a class="nav-link" href="buy.html">Buy Land</a></li>
        <li class="nav-item"><a class="nav-link" href="sell.html">Sell Land</a></li>
      `;
    }

    items += `<li class="nav-item"><a class="nav-link" href="about.html">About</a></li>`;

    if (user && user.role === 'admin') {
      items += `<li class="nav-item"><a class="nav-link text-warning" href="admin.html">Admin</a></li>`;
    }

    const currentTheme = localStorage.getItem('theme') || 'light';
    const themeIcon = currentTheme === 'dark' ? '☀️' : '🌙';
    items += `<li class="nav-item"><button class="btn btn-outline-light ms-2" id="themeToggle">${themeIcon}</button></li>`;

    if (token && user) {
      items += `
        <li class="nav-item"><span class="nav-link text-light">Hi, ${user.name}!</span></li>
        <li class="nav-item"><button class="btn btn-gold ms-2" id="logoutBtn">Logout</button></li>
      `;
    } else {
      items += `
        <li class="nav-item"><a class="btn btn-outline-light ms-2" href="login.html">Login</a></li>
        <li class="nav-item"><a class="btn btn-gold ms-2" href="register.html">Register</a></li>
      `;
    }

    navbarNav.innerHTML = items;

    const newThemeToggle = document.getElementById('themeToggle');
    if (newThemeToggle) {
      newThemeToggle.addEventListener('click', () => {
        const nextTheme = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.body.setAttribute('data-theme', nextTheme);
        localStorage.setItem('theme', nextTheme);
        newThemeToggle.textContent = nextTheme === 'dark' ? '☀️' : '🌙';
      });
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'index.html';
      });
    }
  };

  updateNavbar();

  const featuredContainer = document.getElementById('featured-properties');
  if (featuredContainer) {
    fetch('/api/properties/featured')
      .then((response) => response.json())
      .then((properties) => {
        if (!Array.isArray(properties) || !properties.length) {
          featuredContainer.innerHTML = '<div class="col-12 text-center text-muted">No properties available right now. Please check back soon.</div>';
          return;
        }

        featuredContainer.innerHTML = properties.map((property, index) => {
          const image = Array.isArray(property.images) && property.images.length
            ? property.images[0]
            : 'https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=900&q=80';
          const area = property.area ? `${property.area} ${property.areaScale || 'sq-ft'}` : 'Area not specified';

          return `
            <div class="col-lg-4" data-aos="fade-up" data-aos-delay="${index * 100}">
              <div class="card glass-card h-100 card-bounce" style="animation-delay:${index * 120}ms">
                <img src="${image}" alt="${property.title}" />
                <div class="card-body">
                  <div class="d-flex justify-content-between align-items-center">
                    <h5 class="card-title">${property.title}</h5>
                    <span class="badge bg-success">${property.verified ? 'Verified' : 'New'}</span>
                  </div>
                  <p class="text-muted">${property.description || 'Premium land offering with complete documentation.'}</p>
                  <p class="mb-1"><strong>Price:</strong> ₹${Number(property.price || 0).toLocaleString()}</p>
                  <p class="mb-1"><strong>Area:</strong> ${area}</p>
                  <p class="mb-1"><strong>Village:</strong> ${property.village || '—'}</p>
                  <p class="mb-1"><strong>District:</strong> ${property.district || '—'}</p>
                  <p class="mb-1"><strong>Owner:</strong> ${property.ownerName || '—'}</p>
                  <p class="mb-1"><strong>Type:</strong> ${property.landType || 'Residential'}</p>
                  <div class="d-flex gap-2 mt-3">
                    <a href="property.html?id=${property._id}" class="btn btn-gold">View Details</a>
                    <button class="btn btn-outline-light">❤</button>
                  </div>
                </div>
              </div>
            </div>
          `;
        }).join('');
      })
      .catch(() => {
        featuredContainer.innerHTML = '<div class="col-12 text-center text-muted">Unable to load properties right now.</div>';
      });
  }

  const propertyList = document.getElementById('property-list');
  if (propertyList) {
    propertyList.innerHTML = `
      <div class="col-lg-4"><div class="card glass-card p-4"><h4>Garden View Plot</h4><p>₹8,500,000 · 2400 sq ft</p><p>Village: Bhatia · District: Gurugram</p></div></div>
      <div class="col-lg-4"><div class="card glass-card p-4"><h4>Commercial Highway Land</h4><p>₹12,000,000 · 3600 sq ft</p><p>Village: Kheri · District: Noida</p></div></div>
      <div class="col-lg-4"><div class="card glass-card p-4"><h4>Farmland Opportunity</h4><p>₹5,200,000 · 5000 sq ft</p><p>Village: Fatehpur · District: Mohali</p></div></div>
    `;
  }

  const loginForm = document.getElementById('login-form');
  const userStorage = () => JSON.parse(localStorage.getItem('user') || 'null');
  const saveSession = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  };

  const redirectLoggedIn = () => {
    const user = userStorage();
    if (!user) return;
    if (window.location.pathname.endsWith('login.html')) {
      if (user.role === 'admin') window.location.href = 'admin.html';
      else window.location.href = 'dashboard.html';
    }
    if (window.location.pathname.endsWith('register.html')) {
      if (user.role === 'admin') window.location.href = 'admin.html';
      else window.location.href = 'dashboard.html';
    }
  };

  redirectLoggedIn();

  // Protect buy and sell pages - redirect to login if not authenticated
  const protectRoutes = () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const currentPath = window.location.pathname;

    if ((currentPath.includes('buy.html') || currentPath.includes('sell.html')) && (!token || !user)) {
      localStorage.setItem('redirectAfterLogin', currentPath.split('/').pop());
      window.location.href = 'login.html';
    }

    if (currentPath.includes('admin.html') && (!token || !user || user.role !== 'admin')) {
      window.location.href = 'index.html';
    }
  };

  protectRoutes();

  // If coming from buy/sell page, stay there after login
  const redirectAfterLogin = localStorage.getItem('redirectAfterLogin');
  if (redirectAfterLogin && (window.location.pathname.endsWith('dashboard.html'))) {
    localStorage.removeItem('redirectAfterLogin');
  }

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = Object.fromEntries(new FormData(loginForm));
      try {
        const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        const data = await res.json();
        if (res.ok) {
          saveSession(data);
          if (data.user.role === 'admin') {
            window.location.href = 'admin.html';
          } else {
            window.location.href = 'dashboard.html';
          }
        } else {
          alert(data.message || 'Login failed');
        }
      } catch (error) {
        console.error(error);
      }
    });
  }

  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = Object.fromEntries(new FormData(registerForm));
      try {
        const res = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        const data = await res.json();
        if (res.ok) {
          saveSession(data);
          window.location.href = 'dashboard.html';
        } else {
          alert(data.message || 'Registration failed');
        }
      } catch (error) {
        console.error(error);
      }
    });
  }

  const buyForm = document.getElementById('buy-form');
  if (buyForm) {
    buyForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = Object.fromEntries(new FormData(buyForm));
      try {
        const res = await fetch('/api/requests', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        const data = await res.json();
        if (res.ok) {
          alert('Your buy request was received');
          buyForm.reset();
        } else {
          alert(data.message || 'Request failed');
        }
      } catch (error) {
        console.error(error);
      }
    });
  }

  const sellForm = document.getElementById('sell-form');
  if (sellForm) {
    sellForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = Object.fromEntries(new FormData(sellForm));
      try {
        const res = await fetch('/api/properties', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        const data = await res.json();
        if (res.ok) {
          alert('Your property has been listed');
          sellForm.reset();
        } else {
          alert(data.message || 'Listing failed');
        }
      } catch (error) {
        console.error(error);
      }
    });
  }

  const stats = document.getElementById('visitors');
  if (stats) {
    fetch('/api/dashboard-stats').then(r => r.json()).then(data => {
      document.getElementById('visitors').textContent = data.visitors.toLocaleString();
      document.getElementById('properties').textContent = data.properties.toLocaleString();
      document.getElementById('enquiries').textContent = data.enquiries.toLocaleString();
      document.getElementById('revenue').textContent = `₹${data.revenue.toLocaleString()}`;
    }).catch(() => {});
  }


});
