// Admin Panel JavaScript
document.addEventListener('DOMContentLoaded', function() {
  const loginSection = document.getElementById('login-section');
  const adminPanel = document.getElementById('admin-panel');
  const loginForm = document.getElementById('login-form');
  const loginMessage = document.getElementById('login-message');
  const logoutBtn = document.getElementById('logout-btn');
  const navItems = document.querySelectorAll('.nav-item');
  const tabContents = document.querySelectorAll('.tab-content');
  const modal = document.getElementById('modal');
  const modalClose = document.getElementById('modal-close');
  const userEmail = document.getElementById('user-email');

  // Check if user is logged in
  checkAuth();

  // Login form submission
  loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!supabase) {
      showLoginMessage('Supabase not configured. Please set up Supabase first.', 'error');
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      });

      if (error) throw error;

      // Store session
      localStorage.setItem('admin_session', JSON.stringify(data.session));
      showAdminPanel();
      loadDashboard();
    } catch (error) {
      showLoginMessage(error.message || 'Login failed. Please check your credentials.', 'error');
    }
  });

  // Logout
  logoutBtn.addEventListener('click', function() {
    localStorage.removeItem('admin_session');
    if (supabase) {
      supabase.auth.signOut();
    }
    showLoginSection();
  });

  // Navigation
  navItems.forEach(item => {
    item.addEventListener('click', function() {
      const tab = this.dataset.tab;
      
      // Update active nav
      navItems.forEach(nav => nav.classList.remove('active'));
      this.classList.add('active');
      
      // Update active tab
      tabContents.forEach(content => content.classList.remove('active'));
      document.getElementById(`${tab}-tab`).classList.add('active');
      
      // Update page title
      const titles = {
        dashboard: 'Dashboard',
        subscribers: 'Newsletter Subscribers',
        contacts: 'Contact Messages',
        bookings: 'Booking Requests'
      };
      document.getElementById('page-title').textContent = titles[tab];
      
      // Load data for the tab
      if (tab === 'dashboard') loadDashboard();
      if (tab === 'subscribers') loadSubscribers();
      if (tab === 'contacts') loadContacts();
      if (tab === 'bookings') loadBookings();
    });
  });

  // Modal close
  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', function(e) {
    if (e.target === modal) closeModal();
  });

  // Export buttons
  document.getElementById('export-subscribers').addEventListener('click', () => exportToCSV('subscribers'));
  document.getElementById('export-contacts').addEventListener('click', () => exportToCSV('contacts'));
  document.getElementById('export-bookings').addEventListener('click', () => exportToCSV('bookings'));

  function checkAuth() {
    const session = localStorage.getItem('admin_session');
    if (session) {
      const parsedSession = JSON.parse(session);
      if (parsedSession.user) {
        userEmail.textContent = parsedSession.user.email;
        showAdminPanel();
        loadDashboard();
      }
    }
  }

  function showLoginSection() {
    loginSection.classList.remove('hidden');
    adminPanel.classList.add('hidden');
  }

  function showAdminPanel() {
    loginSection.classList.add('hidden');
    adminPanel.classList.remove('hidden');
  }

  function showLoginMessage(message, type) {
    loginMessage.textContent = message;
    loginMessage.className = `form-message ${type}`;
    setTimeout(() => {
      loginMessage.textContent = '';
      loginMessage.className = 'form-message';
    }, 5000);
  }

  async function loadDashboard() {
    if (!supabase) return;

    try {
      // Load stats
      const [subscribersCount, contactsCount, bookingsCount] = await Promise.all([
        supabase.from('newsletter_subscribers').select('*', { count: 'exact', head: true }),
        supabase.from('contact_submissions').select('*', { count: 'exact', head: true }),
        supabase.from('booking_requests').select('*', { count: 'exact', head: true })
      ]);

      document.getElementById('stat-subscribers').textContent = subscribersCount.count || 0;
      document.getElementById('stat-contacts').textContent = contactsCount.count || 0;
      document.getElementById('stat-bookings').textContent = bookingsCount.count || 0;

      // Load recent activity
      const { data: recentSubscribers } = await supabase
        .from('newsletter_subscribers')
        .select('email, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      const activityList = document.getElementById('recent-activity-list');
      if (recentSubscribers && recentSubscribers.length > 0) {
        activityList.innerHTML = recentSubscribers.map(sub => `
          <div class="activity-item">
            <span class="activity-text">New subscriber: ${sub.email}</span>
            <span class="activity-time">${formatDate(sub.created_at)}</span>
          </div>
        `).join('');
      } else {
        activityList.innerHTML = '<p class="activity-text">No recent activity</p>';
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    }
  }

  async function loadSubscribers() {
    if (!supabase) return;

    const tableBody = document.getElementById('subscribers-table');
    tableBody.innerHTML = '<tr><td colspan="3" class="loading">Loading subscribers...</td></tr>';

    try {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        tableBody.innerHTML = data.map(sub => `
          <tr>
            <td>${sub.email}</td>
            <td>${formatDate(sub.created_at)}</td>
            <td>
              <button class="btn btn-secondary btn-sm" onclick="deleteSubscriber('${sub.id}')">Delete</button>
            </td>
          </tr>
        `).join('');
      } else {
        tableBody.innerHTML = '<tr><td colspan="3" class="loading">No subscribers yet</td></tr>';
      }
    } catch (error) {
      tableBody.innerHTML = '<tr><td colspan="3" class="loading">Error loading subscribers</td></tr>';
      console.error('Error loading subscribers:', error);
    }
  }

  async function loadContacts() {
    if (!supabase) return;

    const tableBody = document.getElementById('contacts-table');
    tableBody.innerHTML = '<tr><td colspan="5" class="loading">Loading contacts...</td></tr>';

    try {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        tableBody.innerHTML = data.map(contact => `
          <tr>
            <td>${contact.name}</td>
            <td>${contact.email}</td>
            <td>${contact.subject}</td>
            <td>${formatDate(contact.created_at)}</td>
            <td>
              <button class="btn btn-secondary btn-sm" onclick="viewContact('${contact.id}')">View</button>
              <button class="btn btn-secondary btn-sm" onclick="deleteContact('${contact.id}')">Delete</button>
            </td>
          </tr>
        `).join('');
      } else {
        tableBody.innerHTML = '<tr><td colspan="5" class="loading">No contact messages yet</td></tr>';
      }
    } catch (error) {
      tableBody.innerHTML = '<tr><td colspan="5" class="loading">Error loading contacts</td></tr>';
      console.error('Error loading contacts:', error);
    }
  }

  async function loadBookings() {
    if (!supabase) return;

    const tableBody = document.getElementById('bookings-table');
    tableBody.innerHTML = '<tr><td colspan="6" class="loading">Loading bookings...</td></tr>';

    try {
      const { data, error } = await supabase
        .from('booking_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        tableBody.innerHTML = data.map(booking => `
          <tr>
            <td>${booking.name}</td>
            <td>${booking.email}</td>
            <td>${booking.service}</td>
            <td>${formatDate(booking.created_at)}</td>
            <td><span class="status-badge status-${booking.status}">${booking.status}</span></td>
            <td>
              <button class="btn btn-secondary btn-sm" onclick="viewBooking('${booking.id}')">View</button>
              <button class="btn btn-secondary btn-sm" onclick="updateBookingStatus('${booking.id}')">Update Status</button>
            </td>
          </tr>
        `).join('');
      } else {
        tableBody.innerHTML = '<tr><td colspan="6" class="loading">No booking requests yet</td></tr>';
      }
    } catch (error) {
      tableBody.innerHTML = '<tr><td colspan="6" class="loading">Error loading bookings</td></tr>';
      console.error('Error loading bookings:', error);
    }
  }

  function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function closeModal() {
    modal.classList.add('hidden');
  }

  function showModal(title, content) {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-body').innerHTML = content;
    modal.classList.remove('hidden');
  }

  // Global functions for onclick handlers
  window.deleteSubscriber = async function(id) {
    if (!confirm('Are you sure you want to delete this subscriber?')) return;
    
    try {
      const { error } = await supabase.from('newsletter_subscribers').delete().eq('id', id);
      if (error) throw error;
      loadSubscribers();
    } catch (error) {
      alert('Error deleting subscriber: ' + error.message);
    }
  };

  window.viewContact = async function(id) {
    try {
      const { data, error } = await supabase.from('contact_submissions').select('*').eq('id', id).single();
      if (error) throw error;

      const content = `
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Subject:</strong> ${data.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${data.message}</p>
        <p><strong>Date:</strong> ${formatDate(data.created_at)}</p>
      `;
      showModal('Contact Details', content);
    } catch (error) {
      alert('Error loading contact: ' + error.message);
    }
  };

  window.deleteContact = async function(id) {
    if (!confirm('Are you sure you want to delete this contact?')) return;
    
    try {
      const { error } = await supabase.from('contact_submissions').delete().eq('id', id);
      if (error) throw error;
      loadContacts();
    } catch (error) {
      alert('Error deleting contact: ' + error.message);
    }
  };

  window.viewBooking = async function(id) {
    try {
      const { data, error } = await supabase.from('booking_requests').select('*').eq('id', id).single();
      if (error) throw error;

      const content = `
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone || 'N/A'}</p>
        <p><strong>Service:</strong> ${data.service}</p>
        <p><strong>Date:</strong> ${data.date || 'N/A'}</p>
        <p><strong>Message:</strong></p>
        <p>${data.message || 'N/A'}</p>
        <p><strong>Status:</strong> ${data.status}</p>
        <p><strong>Submitted:</strong> ${formatDate(data.created_at)}</p>
      `;
      showModal('Booking Details', content);
    } catch (error) {
      alert('Error loading booking: ' + error.message);
    }
  };

  window.updateBookingStatus = async function(id) {
    const newStatus = prompt('Enter new status (pending, confirmed, completed, cancelled):');
    if (!newStatus) return;

    try {
      const { error } = await supabase.from('booking_requests').update({ status: newStatus }).eq('id', id);
      if (error) throw error;
      loadBookings();
    } catch (error) {
      alert('Error updating status: ' + error.message);
    }
  };

  async function exportToCSV(type) {
    if (!supabase) {
      alert('Supabase not configured');
      return;
    }

    let tableName, headers, data;
    
    if (type === 'subscribers') {
      tableName = 'newsletter_subscribers';
      headers = ['Email', 'Subscribed Date'];
      const { data: subscribers } = await supabase.from(tableName).select('*').order('created_at', { ascending: false });
      data = subscribers.map(s => [s.email, s.created_at]);
    } else if (type === 'contacts') {
      tableName = 'contact_submissions';
      headers = ['Name', 'Email', 'Subject', 'Message', 'Date'];
      const { data: contacts } = await supabase.from(tableName).select('*').order('created_at', { ascending: false });
      data = contacts.map(c => [c.name, c.email, c.subject, c.message, c.created_at]);
    } else if (type === 'bookings') {
      tableName = 'booking_requests';
      headers = ['Name', 'Email', 'Phone', 'Service', 'Date', 'Message', 'Status', 'Submitted'];
      const { data: bookings } = await supabase.from(tableName).select('*').order('created_at', { ascending: false });
      data = bookings.map(b => [b.name, b.email, b.phone, b.service, b.date, b.message, b.status, b.created_at]);
    }

    if (!data || data.length === 0) {
      alert('No data to export');
      return;
    }

    const csvContent = [
      headers.join(','),
      ...data.map(row => row.map(cell => `"${cell || ''}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }
});
