import React from 'react'
import uploadToCloudinary from '../utils/uploadToCloudinary.js';

const handleFile = async(e)=>{
  const file = e.target.files[0]
    
  const data = await uploadToCloudinary(file);
  if(!data)
    {
      console.error("Error in uploading in cloudinary")
      return
    }
  console.log(data)
}

const Verify = () => {
  return (
    <div>
        degree pdf <input type="file" accept='.pdf' onChange={handleFile} />
    </div>
  )
}

export default Verify