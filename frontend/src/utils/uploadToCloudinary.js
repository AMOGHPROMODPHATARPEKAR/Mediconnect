const upload_preset = import.meta.env.VITE_UPLOAD_PRESET;
const cloud_name = import.meta.env.VITE_CLOUD_NAME;



const uploadToCloudinary = async (file,type='image') =>{

   
    const uploadData = new FormData();

    uploadData.append('file',file)
    uploadData.append('upload_preset',upload_preset)
    uploadData.append('cloud_name',cloud_name)

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/${type}/upload`,{
        method:'post',
        body:uploadData
    })

    const data = await res.json();

    

    return data;

}

export default uploadToCloudinary;

const generatePdfPreviewUrl = (publicId) => {
    return `https://res.cloudinary.com/${cloud_name}/image/upload/${publicId}.jpg`;
  };