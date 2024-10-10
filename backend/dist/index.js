"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importStar(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const multer_1 = __importDefault(require("multer"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use((0, cors_1.default)({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
}));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, 'uploads')));
const requestSchema = new mongoose_1.Schema({
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
const RequestModel = mongoose_1.default.model('Request', requestSchema);
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://deelakagalpaya:MzjEXFQsNCZtZb8Y@cluster0.hstsl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster';
mongoose_1.default.connect(MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('MongoDB connection error:', error));
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = (0, multer_1.default)({ storage });
const Request = mongoose_1.default.model('Request', requestSchema);
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.post('/api/requests', upload.single('file'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { floor, room, block, guestName, phoneNumber, service, department } = req.body;
    if (!floor || !room || !block || !guestName || !phoneNumber || !service || !department) {
        res.status(400).json({ message: 'Missing required fields' });
    }
    try {
        const newRequest = new Request(Object.assign(Object.assign({}, req.body), { file: req.file ? req.file.path : null }));
        yield newRequest.save();
        res.status(201).json({ message: 'Request created successfully!', request: newRequest });
    }
    catch (error) {
        console.error('Error creating request', error);
        res.status(500).json({ message: 'Error creating request' });
    }
}));
/**
 * @route   GET /api/capture
 * @desc    Retrieve all requests
 * @access  Public
 */
app.get('/api/capture', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const requests = yield RequestModel.find();
        console.log('Fetched Requests:', requests);
        res.status(200).json(requests);
    }
    catch (error) {
        console.error('Error fetching requests:', error);
        res.status(500).json({ message: 'Error fetching requests' });
    }
}));
app.patch('/api/requests/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const updatedData = req.body;
    const allowedUpdates = ['floor', 'room', 'block', 'guestName', 'phoneNumber', 'service', 'department', 'priority', 'status', 'file'];
    const actualUpdates = Object.keys(updatedData);
    const isValidOperation = actualUpdates.every(field => allowedUpdates.includes(field));
    if (!isValidOperation) {
        res.status(400).json({ message: 'Invalid updates' });
    }
    if (updatedData.priority && !['HIGH', 'MEDIUM', 'LOW'].includes(updatedData.priority)) {
        res.status(400).json({ message: 'Invalid priority' });
    }
    if (updatedData.status && !['PENDING', 'IN_PROGRESS', 'COMPLETED'].includes(updatedData.status)) {
        res.status(400).json({ message: 'Invalid status' });
    }
    try {
        const updatedRequest = yield RequestModel.findByIdAndUpdate(id, updatedData, { new: true, runValidators: true });
        if (!updatedRequest) {
            res.status(404).json({ message: 'Request not found' });
        }
        res.status(200).json({ message: 'Request updated successfully!', updatedRequest });
    }
    catch (error) {
        console.error('Error updating request:', error);
        res.status(500).json({ message: 'Error updating request' });
    }
}));
app.delete('/api/requests/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: 'Invalid request ID' });
        console.log('Invalid request ID');
    }
    try {
        const deletedRequest = yield RequestModel.findByIdAndDelete(id);
        if (!deletedRequest) {
            res.status(404).json({ message: 'Request not found' });
        }
        res.status(200).json({ message: 'Request deleted successfully!' });
    }
    catch (error) {
        console.error('Error deleting request:', error);
        res.status(500).json({ message: 'Error deleting request' });
    }
}));
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
