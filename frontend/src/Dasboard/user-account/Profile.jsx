import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import uploadToCloudinary from '../../utils/uploadToCloudinary.js'
import { toast } from 'react-toastify'
import HashLoader from 'react-spinners/HashLoader.js'
import {token} from '../../config.js'

const Profile = ({user}) => {
  const [loading, setLoading] = useState(false)
  const [uploadingRecord, setUploadingRecord] = useState(false)
  const navigate = useNavigate()
  const [newAllergy, setNewAllergy] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    photo: null,
    gender: 'male',
    bloodType: '',
    allergies: [],
    records: [],
    role: 'patient'
  })

  useEffect(() => {
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      photo: user.photo,
      gender: user.gender,
      bloodType: user.bloodType,
      allergies: user.allergies || [],
      records: user.records || [],
      role: user.role
    })
  }, [user])

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value})
  }

  const addAllergy = () => {
    if (newAllergy.trim()) {
      setFormData({...formData, allergies: [...formData.allergies, newAllergy.trim()]})
      setNewAllergy('')
    }
  }

  const removeAllergy = (index) => {
    const updatedAllergies = formData.allergies.filter((_, i) => i !== index)
    setFormData({...formData, allergies: updatedAllergies})
  }

  const handleRecordUpload = async(e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploadingRecord(true)
    try {
      const data = await uploadToCloudinary(file)
      if (!data) throw new Error("Upload failed")
      
      setFormData(prev => ({
        ...prev,
        records: [...prev.records, {
          url: data.url,
          name: file.name
        }]
      }))
    } catch (error) {
      toast.error("Error uploading record")
    } finally {
      setUploadingRecord(false)
    }
  }

  const removeRecord = (index) => {
    const updatedRecords = formData.records.filter((_, i) => i !== index)
    setFormData({...formData, records: updatedRecords})
  }

  const handleFileInput = async(e) => {
    const file = e.target.files[0]
    if (!file) return

    try {
      const data = await uploadToCloudinary(file)
      if (!data) throw new Error("Upload failed")
      setFormData({...formData, photo: data.url})
    } catch (error) {
      toast.error("Error uploading photo")
    }
  }

  const submitHandler = async(e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch(`/api/v1/user/${user._id}`, {
        method: 'put',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      const {message} = await res.json()
      if(!res.ok) throw new Error(message)
      
      toast.success(message)
      navigate('/')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='mt-10'>
      <form onSubmit={submitHandler}>
        <div className='mb-5'>
          <input 
            type="text"
            placeholder='Enter your Full Name'
            name='name'
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
          />
        </div>

        <div className='mb-5'>
          <input 
            type="email"
            placeholder='Enter your Email'
            name='email'
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
          />
        </div>

        <div className='mb-5'>
          <input 
            type="tel"
            placeholder='Phone Number'
            name='phone'
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
          />
        </div>

        <div className='mb-5'>
          <input 
            type="text"
            placeholder='Blood Type'
            name='bloodType'
            value={formData.bloodType}
            onChange={handleChange}
            className="w-full px-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
          />
        </div>

        <div className='mb-5'>
          <div className='flex gap-2 mb-2'>
            <input 
              type="text"
              placeholder='Add allergy'
              value={newAllergy}
              onChange={(e) => setNewAllergy(e.target.value)}
              className="flex-1 px-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16px]"
            />
            <button 
              type="button" 
              onClick={addAllergy}
              className="px-4 py-2 bg-primaryColor text-white rounded-lg"
            >
              Add
            </button>
          </div>
          <div className='flex flex-wrap gap-2'>
            {formData.allergies.map((allergy, index) => (
              <div key={index} className='flex items-center bg-[#0066ff46] px-3 py-1 rounded-full'>
                <span>{allergy}</span>
                <button 
                  type="button"
                  onClick={() => removeAllergy(index)}
                  className="ml-2 text-red-500"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-5 flex items-center justify-between">
          <label className="text-headingColor font-bold text-[16px] leading-7">
            Gender:
            <select 
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="text-textColor font-semibold text-[15px] leading-7 px-4 py-3 rounded-md ml-2 focus:outline-none"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </label>
        </div>

        <div className='mb-5'>
          <div className='relative w-full'>
            <input 
              type="file"
              id="recordUpload"
              onChange={handleRecordUpload}
              className="hidden"
              accept='.jpg, .png, .pdf'
            />
            <label 
              htmlFor="recordUpload"
              className='block w-full py-3 px-4 bg-[#0066ff46] text-headingColor font-semibold rounded-lg text-center cursor-pointer'
            >
              {uploadingRecord ? 'Uploading...' : 'Upload Medical Record'}
            </label>
          </div>
          <div className='mt-4 space-y-2'>
            {formData.records.map((record, index) => (
              <div key={index} className='flex items-center justify-between bg-[#0066ff46] px-4 py-2 rounded-lg'>
                <a 
                  href={record.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-primaryColor hover:underline"
                >
                  {record.name || `Record ${index + 1}`}
                </a>
                <button 
                  type="button"
                  onClick={() => removeRecord(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className='mb-5 flex items-center gap-3'>
          {formData.photo && (
            <figure className='w-[60px] h-[60px] rounded-full border-2 border-solid border-primaryColor flex items-center justify-center'>
              <img src={formData.photo} alt="" className='w-full rounded-full' />
            </figure>
          )}

          <div className='relative w-[130px] h-[50px]'>
            <input 
              type="file"
              name='photo'
              id='customFile'
              onChange={handleFileInput}
              accept='.jpg, .png'
              className='absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer'
            />
            <label 
              htmlFor="customFile" 
              className='absolute top-0 left-0 w-full h-full flex items-center px-[0.75rem] text-[15px] leading-6 overflow-hidden bg-[#0066ff46] text-headingColor font-semibold rounded-lg truncate cursor-pointer'
            >
              Upload Photo
            </label>
          </div>
        </div>

        <div className='mt-7'>
          <button 
            type='submit'
            disabled={loading || uploadingRecord}
            className='w-full bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg px-4 py-3'
          >
            {loading ? <HashLoader size={25} color='#ffffff' /> : 'Update'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default Profile