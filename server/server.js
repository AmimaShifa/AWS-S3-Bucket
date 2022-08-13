const multer  = require('multer')
const express= require("express");
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors');
const exec = require('child_process').exec; 


const corsOrigin="http://localhost:3000";
app.use(express.static(__dirname+'../..'));
app.use(cors({
  origin:[corsOrigin],
  methods:['GET','POST'],
  credentials:true
}));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

const fileUploadPath='C:/Users/amima/Documents/GitHub/aws_automation/server/uploads';
const storage= multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, fileUploadPath);
  },
  filename:function(req,file,cb){
    cb(null,file.originalname)
  }
})

const fileUpload=multer({storage:storage,fileFilter })
app.post('/file-upload',fileUpload.single("file"), (req,res)=>{
  console.log("Got a Post req");
  console.log("req.body",req.body);
  res.send('Got a Post req');
})
function fileFilter (req, file, cb) {

  if(file.mimetype.split("/")[1]==='html')
    {cb(null, true)}
else
  // You can always pass an error if something goes wrong:
 {cb(null,false)} 

}
app.get("/api", (req, res) => {
  res.json({message:"Hello!"})
});
app.get("/create-bucket", (req, res) => {
  res.json({message:"Hello!"})
});
app.get("/delete-bucket", (req, res) => {
  console.log(req.body);
  res.json({message:"Hello!"})
});
app.get("/list-bucket", (req, res) => {
  exec('aws s3api list-buckets  --query "Buckets[].Name"', (err, stdout, stderr) => {  
    if (err) {  
      console.error(err);  
      return;  
    }  
  
    res.send(stdout.toString('utf8'))
    
  });

  
});
/* 
exec('aws s3api list-buckets', (err, stdout, stderr) => {  
  if (err) {  
    console.error(err);  
    return;  
  }  
  console.log(stdout);  
}); */ 
app.listen(8080, () => console.log("listening on port 8080"))
/*
const router=express.Router()
const upload = multer({ dest: 'uploads/' })

const fs = require("fs");
const { promisify } = require("util");
const pipeline = promisify(require("stream").pipeline);
router.post("/upload", upload.single("file"), async function(req, res, next) {
  const {
    file,
    body: { name }
  } = req;

  const fileName = name + file.detectedFileExtension;
  await pipeline(
    file.stream,
    fs.createWriteStream(`${__dirname}/../public/images/${fileName}`)
  );

  res.send("File uploaded as " + fileName);
});
router.get('/', function(req,res,next)
{
  console.log("Hey");
})
module.exports=router;
/*import multer from 'multer'
import { PrismaClient } from '@prisma/client'
import { uploadFile, deleteFile, getObjectSignedUrl } from './s3.js'

const app = express()
const prisma = new PrismaClient()

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')

app.get("/api/posts", async (req, res) => {
  const posts = await prisma.posts.findMany({orderBy: [{ created: 'desc'}]})
  for (let post of posts) {
    post.imageUrl = await getObjectSignedUrl(post.imageName)
  }
  res.send(posts)
})


app.post('/api/posts', upload.single('image'), async (req, res) => {
  const file = req.file
  const caption = req.body.caption
  const imageName = generateFileName()

  const fileBuffer = await sharp(file.buffer)
    .resize({ height: 1920, width: 1080, fit: "contain" })
    .toBuffer()

  await uploadFile(fileBuffer, imageName, file.mimetype)

  const post = await prisma.posts.create({
    data: {
      imageName,
      caption,
    }
  })
  
  res.status(201).send(post)
})

app.delete("/api/posts/:id", async (req, res) => {
  const id = +req.params.id
  const post = await prisma.posts.findUnique({where: {id}}) 

  await deleteFile(post.imageName)

  await prisma.posts.delete({where: {id: post.id}})
  res.send(post)
})
*/
