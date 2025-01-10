import { encryptFile } from '../utils/encryption.js';
import { generateEncryptionKey } from '../utils/generateKey.js';
import User from "../models/UserSchema.js"
import pinataSDK from '@pinata/sdk';
import {  PINATA_APIKEY, PINATA_SECRETKEY } from '../index.js';



export async function uploadImageController(req,res,next){
    try {
        const id = req.userId;
       
        const user=await User.findOne({_id:id})
        if(!user){
            throw new Error("User does not exist")
        }
        if(user.encryptionKey===null){
            const encryptionKey=generateEncryptionKey(32);
            user.encryptionKey=encryptionKey;
            await user.save()
        }
        const { encryptedData, iv } = encryptFile(req.file.buffer,user.encryptionKey);

        
        const pinata = new pinataSDK({ pinataApiKey: PINATA_APIKEY, pinataSecretApiKey: PINATA_SECRETKEY });
        const resPinata = await pinata.pinJSONToIPFS({encryptedData,iv})
        console.log(resPinata)
        res.status(200).json({ipfsHash:resPinata.IpfsHash,message:"Image Uploaded"})
    } catch (error) {
        console.error(error)
        res.status(500).json({message:"Internal Server Error"})
    }
  
}

import axios from 'axios';
import { decryptData } from '../utils/decryption.js';
const PINATA_GATEWAY_URL="https://gateway.pinata.cloud/ipfs/"

async function returnIpfsResponse(ipfsHash){
    const res = await axios(`${PINATA_GATEWAY_URL}${ipfsHash}`)
    return res.data
}

export async function getImageController(req,res,next){
    try {
        const {userId}= req.query;
       console.log("sds",userId)
        const user=await User.findOne({_id:userId})
        if(!user){
            throw new Error("User does not exist")
        }
        

        const {ipfsHash} = req.body;

        const encryptedDataIpfs = await returnIpfsResponse(ipfsHash)
         
        
        const decryptedImgData = decryptData(encryptedDataIpfs.encryptedData, encryptedDataIpfs.iv,user.encryptionKey)
        const depcryptedImage = decryptedImgData.toString('base64')
            
        // console.log(depcryptedImage)

        res.status(200).json({message:"Image Sent",depcryptedImage})
    } catch (error) {
        console.error(error)
        res.status(500).json({message:"Internal Server Error"})
    }
  
}