import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import HashLoader from 'react-spinners/HashLoader';
import { toast } from 'react-toastify';

const ChangePassword = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });

  const navigate = useNavigate();
  const {id} = useParams()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    console.log(id)
    try {
      setLoading(true);
      const response = await fetch(`/api/v1/user/changePassword/${id}`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: formData.password })
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }

      toast.success('Password changed successfully');
      navigate('/login');
    } catch (error) {
      console.log("Error in changing password", error);
      toast.error('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Change Password
          </h1>
          <p className="mb-4">Enter your new password</p>
        </div>

        <form className='py-4 md:py-0' onSubmit={submitHandler}>
          <div className='mb-5'>
            <input
              type="password"
              placeholder='Enter New Password'
              value={formData.password}
              name='password'
              onChange={handleChange}
              className="w-full py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
              required
            />
          </div>
          <div className='mb-5'>
            <input
              type="password"
              placeholder='Confirm New Password'
              value={formData.confirmPassword}
              name='confirmPassword'
              onChange={handleChange}
              className="w-full py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
              required
            />
          </div>
          <div className='mt-7'>
            <button
              type='submit'
              disabled={loading}
              className='w-full bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg px-4 py-3'
            >
              {loading ? <HashLoader size={35} color='#ffffff' /> : 'Change Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
