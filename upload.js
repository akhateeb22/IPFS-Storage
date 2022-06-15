const express = require('express');
const multer = require('multer');
const web3Storage = require('web3.storage');
const fs = require('fs');

const app = express();

const client = new web3Storage.Web3Storage({ token: ''});

app.use(multer().single('image'))




app.post('/hello', async(req, res, next)=>{
    const imageUrl = req.file;
    console.log(imageUrl);
    await fs.promises.writeFile(`./images/${imageUrl.originalname}`,imageUrl.buffer);
    const images = await web3Storage.getFilesFromPath(`./images/${imageUrl.originalname}`);
    const imageCid = await client.put(images,{name: req.file.originalname});
    console.log(imageCid);
    //const info = await client.status(fileCid);
    await fs.promises.unlink(`./images/${imageUrl.originalname}`);
    let data = {
        description: '',
        name: `${imageUrl.originalname}`,
        attributes: [],
        image: `https://ipfs.io/ipfs/${imageCid}/${imageUrl.originalname}`,
        animation_url: '',
        background_color: '',
        youtube_url: '',
        external_url: ''
      }
    data = JSON.stringify(data);
    await fs.promises.writeFile(`./images/${imageUrl.originalname}-metadata.json`, data);
    const files = await web3Storage.getFilesFromPath(`./images/${imageUrl.originalname}-metadata.json`);
    const metadataCid = await client.put(files,{name: `${req.file.originalname}-metadata`});
    const metadata = {
        metaDataURL: `https://ipfs.io/ipfs/${metadataCid}/${imageUrl.originalname}-metadata.json`
    }
    //const info = await client.status(fileCid);
    await fs.promises.unlink(`./images/${imageUrl.originalname}-metadata.json`);
    res.status(201).json(metadata);
})



app.listen(3001,()=>{
    console.log('Listening on port 3001');
})