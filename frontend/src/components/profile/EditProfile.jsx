import { useForm } from 'react-hook-form';
import { updateProfile } from '../../services/user.service';
import { Button } from '../ui/button';
import { useState } from 'react';

export default function EditProfile({ user }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      fullName: user.fullName,
      village: user.village || '',
      district: user.district || '',
      state: user.state || '',
      cropsGrown: user.cropsGrown?.join(', ') || ''
    }
  });
  const [message, setMessage] = useState('');

  const onSubmit = async (data) => {
    try {
      const cropsArray = data.cropsGrown.split(',').map(s => s.trim()).filter(Boolean);
      await updateProfile({ ...data, cropsGrown: cropsArray });
      setMessage('Profile updated successfully');
    } catch (error) {
      setMessage('Update failed');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
      <div>
        <label className="block text-sm font-medium">Full Name</label>
        <input {...register('fullName', { required: true })} className="w-full border rounded p-2" />
      </div>
      <div>
        <label className="block text-sm font-medium">Village</label>
        <input {...register('village')} className="w-full border rounded p-2" />
      </div>
      <div>
        <label className="block text-sm font-medium">District</label>
        <input {...register('district')} className="w-full border rounded p-2" />
      </div>
      <div>
        <label className="block text-sm font-medium">State</label>
        <input {...register('state')} className="w-full border rounded p-2" />
      </div>
      <div>
        <label className="block text-sm font-medium">Crops Grown (comma separated)</label>
        <input {...register('cropsGrown')} className="w-full border rounded p-2" />
      </div>
      {message && <p className="text-sm text-green-600">{message}</p>}
      <Button type="submit">Save Changes</Button>
    </form>
  );
}