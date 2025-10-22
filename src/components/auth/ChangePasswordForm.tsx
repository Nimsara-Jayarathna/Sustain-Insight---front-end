import React, { useState } from 'react';
import AuthLoadingOverlay from '../ui/AuthLoadingOverlay';
// Import BOTH API functions
import { verifyPassword, changePassword } from '../../api/user';

export default function ChangePasswordForm({
  onSuccess,
  onCancel,
}: {
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [step, setStep] = useState<'verify' | 'update'>('verify');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Handler for the first step NOW PERFORMS A REAL API CALL
  const handleVerifyStep = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!currentPassword) {
      setError('Please enter your current password.');
      return;
    }

    setLoading(true);
    try {
      // API call to verify the password
      await verifyPassword({ currentPassword });
      // If the call succeeds, we move to the next step
      setStep('update');
    } catch (err: any) {
      // If the call fails, we show the error and stay on the current step
      setError(err.message || 'Incorrect password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handler for the final step remains largely the same
  const handleChangePasswordStep = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }
    if (newPassword.length < 8) {
        setError('New password must be at least 8 characters long.');
        return;
    }

    setLoading(true);
    setSuccess(false);

    try {
      await changePassword({ currentPassword, newPassword });
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (err: any) {
      // Should be rare, but if it fails here, show the error
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <form onSubmit={step === 'verify' ? handleVerifyStep : handleChangePasswordStep} className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-slate-100">Change Password</h3>
        
        {/* STEP 1: VERIFY CURRENT PASSWORD */}
        {step === 'verify' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Current Password</label>
              <p className="mb-2 text-xs text-gray-500 dark:text-slate-400">To continue, please confirm your current password.</p>
              <input type="password" required autoFocus value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} disabled={loading} placeholder="Enter your current password" className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" />
            </div>
            <div className="flex items-center justify-end gap-3 pt-4">
              <button type="button" onClick={onCancel} disabled={loading} className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">Cancel</button>
              <button type="submit" disabled={loading} className="flex h-10 w-32 items-center justify-center rounded-lg bg-gradient-to-r from-emerald-600 to-cyan-500 px-4 py-2 text-sm font-medium text-white shadow-md transition hover:shadow-lg disabled:opacity-60">
                {loading ? 'Verifying...' : 'Continue'}
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: ENTER NEW PASSWORD */}
        {step === 'update' && (
          <div className="space-y-6">
            {/* ... New password fields (no changes here) ... */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">New Password</label>
              <input type="password" required autoFocus value={newPassword} onChange={(e) => setNewPassword(e.target.value)} disabled={loading} placeholder="Enter your new password" className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Confirm New Password</label>
              <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={loading} placeholder="Confirm your new password" className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" />
            </div>
            <div className="flex items-center justify-end gap-3 pt-4">
              <button type="button" onClick={() => { setStep('verify'); setError(''); }} disabled={loading} className="text-sm font-medium text-gray-700 transition hover:text-gray-900 dark:text-slate-300 dark:hover:text-slate-100">
                Back
              </button>
              <button type="submit" disabled={loading || success} className="flex h-10 w-40 items-center justify-center rounded-lg bg-gradient-to-r from-emerald-600 to-cyan-500 px-4 py-2 text-sm font-medium text-white shadow-md transition hover:shadow-lg disabled:opacity-50">
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </div>
        )}
      </form>

      {(error || loading || success) && (
        <AuthLoadingOverlay
          loading={loading && !success} // Only show spinner if not also showing success
          success={success}
          error={error}
          message={success ? "Password updated successfully!" : error}
          onClose={() => setError('')}
        />
      )}
    </div>
  );
}
