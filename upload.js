// import { Web3Storage } from 'web3.storage'

// // Construct with token and endpoint
// const client = new Web3Storage({ token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDQ5NzRCODE1MDY5RDAxRjA1MjA0NEM3MDllNTZlNUFkQWNGZDkwMTEiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NTQ4NTE2NjEzNDAsIm5hbWUiOiJUcnUifQ.Ky_PS2t_ipm8PczVTqnlWTqivRIbQgnTeiDGNyycrM4'})

// const fileInput = document.querySelector('input[type="file"]')

// // Pack files into a CAR and send to web3.storage
// const rootCid = await client.put(fileInput.files) // Promise<CIDString>

// // Get info on the Filecoin deals that the CID is stored in
// const info = await client.status(rootCid) // Promise<Status | undefined>

// // Fetch and verify files from web3.storage
// const res = await client.get(rootCid) // Promise<Web3Response | null>
// const files = await res.files() // Promise<Web3File[]>
// for (const file of files) {
//   console.log(`${file.cid} ${file.name} ${file.size}`)
// }

const express = require('express');
const multer = require('multer');
const web3Storage = require('web3.storage');
const fs = require('fs');
const Blob = require('buffer').Blob;

const app = express();

const client = new web3Storage.Web3Storage({ token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDQ5NzRCODE1MDY5RDAxRjA1MjA0NEM3MDllNTZlNUFkQWNGZDkwMTEiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NTQ4NTE2NjEzNDAsIm5hbWUiOiJUcnUifQ.Ky_PS2t_ipm8PczVTqnlWTqivRIbQgnTeiDGNyycrM4'});

app.use(multer().single('image'))




app.post('/hello', async(req, res, next)=>{
    const imageUrl = req.file;
    console.log(imageUrl);
    const file = await fs.promises.writeFile(`./images/${imageUrl.originalname}`,imageUrl.buffer);
    const files = await web3Storage.getFilesFromPath(`./images/${imageUrl.originalname}`);
    const fileCid = await client.put(files,{name: req.file.originalname});
    console.log(fileCid);
    const info = await client.status(fileCid);
    const metadata = {
        URL: `https://ipfs.io/ipfs/${fileCid}/${imageUrl.originalname}`
    }
    await fs.promises.unlink(`./images/${imageUrl.originalname}`);
    res.status(201).json(metadata);
})



app.listen(3001,()=>{
    console.log('Listening on port 3001');
})