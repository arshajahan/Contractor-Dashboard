/* Demo sign-in for the Buzzin Work Permit app. Accounts and data are fictional. */
window.BUZZIN_ACCOUNTS = [
  { email: 'alex@samplecontracting.ae', password: 'Contractor@123', role: 'contractor', userId: 'p1', name: 'Alex Morgan', label: 'Contractor', sub: 'Sample Contracting', home: 'contractor/index.html' },
  { email: 'maya.khan@buzzin-community.example', password: 'Admin@123', role: 'admin', userId: 'u1', name: 'Maya Khan', label: 'Community admin', sub: 'Full access', home: 'community/index.html' },
  { email: 'omar.siddiqui@buzzin-community.example', password: 'Approver@123', role: 'approver', userId: 'u2', name: 'Omar Siddiqui', label: 'Community approver', sub: 'Security · Level 1', home: 'community/index.html' },
  { email: 'daniel.okoro@buzzin-community.example', password: 'Approver@123', role: 'approver', userId: 'u3', name: 'Daniel Okoro', label: 'Community approver', sub: 'Security · Level 2 · access logs', home: 'community/index.html' },
  { email: 'noor.hassan@buzzin-community.example', password: 'Reviewer@123', role: 'reviewer', userId: 'u7', name: 'Noor Hassan', label: 'Community reviewer', sub: 'View-only · logs, issue passes, check-out', home: 'community/index.html' },
  { email: 'imran.qureshi@buzzin-community.example', password: 'Reviewer@123', role: 'reviewer', userId: 'u8', name: 'Imran Qureshi', label: 'Community reviewer', sub: 'View-only · invite contractors, mark completed', home: 'community/index.html' },
  { email: 'priya.rao@buzzin-community.example', password: 'Approver@123', role: 'approver', userId: 'u4', name: 'Priya Rao', label: 'Community approver', sub: 'Operations · Level 1', home: 'community/index.html' },
];
window.BuzzinSession = {
  key: 'buzzin-session-v1',
  get() { try { const s = JSON.parse(localStorage.getItem(this.key)); return s && s.email ? s : null; } catch (e) { return null; } },
  set(a) { try { localStorage.setItem(this.key, JSON.stringify({ email: a.email, role: a.role, userId: a.userId, name: a.name })); } catch (e) { /* storage blocked */ } },
  clear() { try { localStorage.removeItem(this.key); } catch (e) { /* ignore */ } },
  /* Send people to the sign-in page if they are not signed in with the right kind of account. */
  require(kind) { const s = this.get(); const ok = s && (kind === 'contractor' ? s.role === 'contractor' : ['admin', 'approver', 'reviewer'].includes(s.role)); if (!ok) { location.replace('../index.html'); return null; } return s; },
};
