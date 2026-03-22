import { useEffect, useState } from 'react';
import { Button } from '../ui/button';

export default function ChangePassword() {
  const [formData, setFormData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    
    try {
   
      setMessage('Password changed successfully');
      setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setMessage('Failed to change password');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div>
        <label className="block text-sm font-medium">Current Password</label>
        <input
          type="password"
          value={formData.oldPassword}
          onChange={(e) => setFormData({ ...formData, oldPassword: e.target.value })}
          className="w-full border rounded p-2"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium">New Password</label>
        <input
          type="password"
          value={formData.newPassword}
          onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
          className="w-full border rounded p-2"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Confirm Password</label>
        <input
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          className="w-full border rounded p-2"
          required
        />
      </div>
      {message && <p className="text-sm text-green-600">{message}</p>}
      <Button type="submit">Change Password</Button>
    </form>
  );
}
