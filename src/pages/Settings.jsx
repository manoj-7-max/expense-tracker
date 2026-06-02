import { useEffect, useState } from 'react';
import { Bell, Download, FileText, Moon, Shield, Sun, Trash2, User } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import Modal from '../components/Modal.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useFinance } from '../context/FinanceContext.jsx';
import { exportTransactionsCsv } from '../lib/csv.js';

export default function Settings() {
  const { deleteAccount, user } = useAuth();
  const { transactions } = useFinance();
  
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');
  const [pushEnabled, setPushEnabled] = useState(() => localStorage.getItem('pushEnabled') === 'true');
  
  const [profileModal, setProfileModal] = useState(false);
  const [privacyModal, setPrivacyModal] = useState(false);
  const [termsModal, setTermsModal] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  useEffect(() => {
    localStorage.setItem('pushEnabled', pushEnabled ? 'true' : 'false');
  }, [pushEnabled]);

  const removeAccount = async () => {
    if (window.confirm('Delete this account and all finance data?')) {
      await deleteAccount();
    }
  };

  return (
    <>
      <PageHeader title="Settings" subtitle="Manage your preferences" />
      <div className="space-y-4 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        
        {/* Profile Settings */}
        <section className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-bold flex items-center gap-2"><User size={18} className="text-neon-cyan" /> Profile Settings</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Manage your account details and email.</p>
          </div>
          <button className="btn-secondary" type="button" onClick={() => setProfileModal(true)}>
            View Profile
          </button>
        </section>

        {/* Push Notifications */}
        <section className="card flex items-center justify-between gap-4 p-4">
          <div>
            <h2 className="font-bold flex items-center gap-2"><Bell size={18} className="text-neon-purple" /> Push Notifications</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Receive alerts for budget limits and reminders.</p>
          </div>
          <button 
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${pushEnabled ? 'bg-neon-cyan' : 'bg-slate-700'}`}
            type="button" 
            onClick={() => setPushEnabled(!pushEnabled)}
            aria-label="Toggle push notifications"
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${pushEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </section>

        {/* Theme Settings */}
        <section className="card flex items-center justify-between gap-4 p-4">
          <div>
            <h2 className="font-bold flex items-center gap-2">
              {dark ? <Moon size={18} className="text-blue-400" /> : <Sun size={18} className="text-amber-400" />} Theme Mode
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Switch between dark and light mode.</p>
          </div>
          <button 
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${dark ? 'bg-blue-500' : 'bg-slate-700'}`}
            type="button" 
            onClick={() => setDark(!dark)}
            aria-label="Toggle dark mode"
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${dark ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </section>

        {/* Export Data */}
        <section className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-bold flex items-center gap-2"><Download size={18} className="text-neon-mint" /> Export Data</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Download your transaction history as CSV.</p>
          </div>
          <button className="btn-secondary" type="button" onClick={() => exportTransactionsCsv(transactions)}>
            Export CSV
          </button>
        </section>

        {/* Legal & About */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <section className="card p-4 flex flex-col items-start gap-3 justify-center text-center sm:text-left hover:border-white/10 transition-colors cursor-pointer group" onClick={() => setPrivacyModal(true)}>
            <div className="flex items-center gap-2 mx-auto sm:mx-0">
              <Shield size={20} className="text-neon-cyan group-hover:scale-110 transition-transform" />
              <h2 className="font-bold">Privacy Policy</h2>
            </div>
            <p className="text-sm text-slate-400 w-full">Learn how we handle your data.</p>
          </section>
          
          <section className="card p-4 flex flex-col items-start gap-3 justify-center text-center sm:text-left hover:border-white/10 transition-colors cursor-pointer group" onClick={() => setTermsModal(true)}>
            <div className="flex items-center gap-2 mx-auto sm:mx-0">
              <FileText size={20} className="text-neon-purple group-hover:scale-110 transition-transform" />
              <h2 className="font-bold">Terms & Conditions</h2>
            </div>
            <p className="text-sm text-slate-400 w-full">Read our terms of service.</p>
          </section>
        </div>

        {/* Danger Zone */}
        <section className="card flex flex-col gap-4 border-rose-500/20 bg-rose-500/5 p-4 sm:flex-row sm:items-center sm:justify-between mt-8">
          <div>
            <h2 className="font-bold text-rose-400 flex items-center gap-2"><Trash2 size={18} /> Danger Zone</h2>
            <p className="text-sm text-rose-300/70">Permanently delete your account and all finance data.</p>
          </div>
          <button className="btn-secondary border-rose-500/30 text-rose-400 hover:bg-rose-500/20" type="button" onClick={removeAccount}>
            Delete Account
          </button>
        </section>
      </div>

      {/* Modals */}
      <Modal open={profileModal} onClose={() => setProfileModal(false)} title="Profile Settings">
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-sm text-slate-400 mb-1">Email Address</p>
            <p className="font-medium text-white">{user?.email}</p>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-sm text-slate-400 mb-1">Account Status</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="h-2 w-2 rounded-full bg-neon-mint"></span>
              <span className="font-medium text-neon-mint">Active</span>
            </div>
          </div>
          <button className="btn-primary w-full mt-6" onClick={() => setProfileModal(false)}>Close</button>
        </div>
      </Modal>

      <Modal open={privacyModal} onClose={() => setPrivacyModal(false)} title="Privacy Policy">
        <div className="space-y-4 text-sm text-slate-300 leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
          <h3 className="text-white font-bold text-base">Data Collection</h3>
          <p>We collect information you provide directly to us when you create an account, update your profile, and input your financial data into Kaasu Kanakku.</p>
          
          <h3 className="text-white font-bold text-base mt-4">Use of Information</h3>
          <p>We use the information we collect to provide, maintain, and improve our services. Your financial data is stored securely and used solely for providing you with budget analytics and insights.</p>
          
          <h3 className="text-white font-bold text-base mt-4">Data Security</h3>
          <p>We implement appropriate technical and organizational measures designed to protect your personal information against accidental or unlawful destruction, loss, alteration, and unauthorized disclosure or access.</p>

          <h3 className="text-white font-bold text-base mt-4">Contact Us</h3>
          <p>If you have any questions about this Privacy Policy, please contact us through the support channel in the app.</p>
        </div>
      </Modal>

      <Modal open={termsModal} onClose={() => setTermsModal(false)} title="Terms & Conditions">
        <div className="space-y-4 text-sm text-slate-300 leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
          <h3 className="text-white font-bold text-base">Acceptance of Terms</h3>
          <p>By accessing and using Kaasu Kanakku, you agree to be bound by these Terms & Conditions. If you disagree with any part of the terms, you may not access the service.</p>
          
          <h3 className="text-white font-bold text-base mt-4">User Accounts</h3>
          <p>You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password. You agree not to disclose your password to any third party.</p>
          
          <h3 className="text-white font-bold text-base mt-4">Termination</h3>
          <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
          
          <h3 className="text-white font-bold text-base mt-4">Changes</h3>
          <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will try to provide at least 30 days' notice prior to any new terms taking effect.</p>
        </div>
      </Modal>
    </>
  );
}
