// server.ts

import express, { Request, Response } from 'express';
import mongoose, { Schema, Document } from 'mongoose';

import cors from 'cors';
import multer from 'multer';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from 'path';
import { Console } from 'console';

dotenv.config();

const app = express();


app.use(cors({
  origin: 'http://localhost:3000', 
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true,
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mongoose Interface
interface IRequest extends Document {
  floor: string;
  room: string;
  block: string;
  guestName: string;
  phoneNumber: string;
  service: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  department: string;
  createdOn: Date;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  file?: string;
}

// Mongoose Schema
const requestSchema: Schema = new Schema({
  floor: { type: String, required: true },
  room: { type: String, required: true },
  block: { type: String, required: true },
  guestName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  service: { type: String, required: true },
  status: { type: String, enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED'], default: 'PENDING' },
  department: { type: String, required: true },
  createdOn: { type: Date, required: true, default: Date.now },
  priority: { type: String, enum: ['HIGH', 'MEDIUM', 'LOW'], default: 'MEDIUM' },
  file: { type: String },
});

const RequestModel = mongoose.model<IRequest>('Request', requestSchema);

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://deelakagalpaya:MzjEXFQsNCZtZb8Y@cluster0.hstsl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster';

mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error: Error) => console.error('MongoDB connection error:', error));


// Multer Configuration for File Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Helper Function to Generate Document ID (Optional)
function generateDocumentId(): string {
  const prefix = 'small'; // Customize as needed
  const uniqueNumber = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}${uniqueNumber}`;
}

// Routes

/**
 * @route   POST /api/requests
 * @desc    Create a new request
 * @access  Public
 */
app.post('/api/requests', upload.single('file'), async (req: Request, res: Response) => {
  const { floor, room, block, guestName, phoneNumber, service, department, priority } = req.body;
  const file = req.file ? req.file.filename : undefined;

  // Validate Required Fields
  if (!floor || !room || !block || !guestName || !phoneNumber || !service || !department) {
     res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const newRequest = new RequestModel({
      floor,
      room,
      block,
      guestName,
      phoneNumber,
      service,
      department,
      priority: priority || 'MEDIUM',
      status: 'PENDING',
      file,
      createdOn: new Date(),
    });

    await newRequest.save();
    res.status(201).json({ message: 'Request submitted successfully!', requestId: newRequest._id });
  } catch (error) {
    console.error('Error saving request:', error);
    res.status(500).json({ message: 'Error submitting request' });
  }
});

/**
 * @route   GET /api/capture
 * @desc    Retrieve all requests
 * @access  Public
 */
app.get('/api/capture', async (req: Request, res: Response) => {
  try {
    const requests = await RequestModel.find();
    console.log('Fetched Requests:', requests);
    res.status(200).json(requests);
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({ message: 'Error fetching requests' });
  }
});


app.patch('/api/requests/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const updatedData = req.body;

  // Define Allowed Fields for Update
  const allowedUpdates = ['floor', 'room', 'block', 'guestName', 'phoneNumber', 'service', 'department', 'priority', 'status', 'file'];
  const actualUpdates = Object.keys(updatedData);
  const isValidOperation = actualUpdates.every(field => allowedUpdates.includes(field));

  if (!isValidOperation) {
     res.status(400).json({ message: 'Invalid updates' });
  }

  // Validate priority field
  if (updatedData.priority && !['HIGH', 'MEDIUM', 'LOW'].includes(updatedData.priority)) {
     res.status(400).json({ message: 'Invalid priority' });
  }

  try {
    const updatedRequest = await RequestModel.findByIdAndUpdate(id, updatedData, { new: true, runValidators: true });
    if (!updatedRequest) {
       res.status(404).json({ message: 'Request not found' });
    }

    // Validate status field
    if (updatedData.status && !['PENDING', 'IN_PROGRESS', 'COMPLETED'].includes(updatedData.status)) {
       res.status(400).json({ message: 'Invalid status' });
    }

    res.status(200).json({ message: 'Request updated successfully!', updatedRequest });
  } catch (error) {
    console.error('Error updating request:', error);
    res.status(500).json({ message: 'Error updating request' });
  }
});


app.delete('/api/requests/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
     res.status(400).json({ message: 'Invalid request ID' });
     console.log('Invalid request ID')
  }

  try {
    const deletedRequest = await RequestModel.findByIdAndDelete(id);
    if (!deletedRequest) {
       res.status(404).json({ message: 'Request not found' });
    }
    res.status(200).json({ message: 'Request deleted successfully!' });
  } catch (error) {
    console.error('Error deleting request:', error);
    res.status(500).json({ message: 'Error deleting request' });
  }
});
// Start the Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

