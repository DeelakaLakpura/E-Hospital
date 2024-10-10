import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes, faFile } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Swal from 'sweetalert2'; 

interface IRequest {
  label: string;
  count: number;
  bgColor: string;
  textColor: string;
}

const RequestSummary = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    location: '',
    service: '',
    status: 'NEW', 
    priority: 'MEDIUM', 
    department: '',
    requestedBy: '',
    assignedTo: '',
    date: '',
    createdOn: new Date().toISOString(), 
    file: null as File | null,
    floor: '',      
    room: '',       
    block: '',      
    guestName: '',  
    phoneNumber: '',
  });

  const requests: IRequest[] = [
    { label: 'New Requests', count: 10, bgColor: 'bg-red-100', textColor: 'text-red-500' },
    { label: 'Delayed Requests', count: 5, bgColor: 'bg-green-100', textColor: 'text-green-500' },
    { label: 'Escalated Requests', count: 2, bgColor: 'bg-blue-100', textColor: 'text-blue-500' },
    { label: 'Hold Requests', count: 0, bgColor: 'bg-purple-100', textColor: 'text-purple-500' },
  ];

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();


    if (!formData.floor || !formData.room || !formData.block || !formData.guestName || !formData.phoneNumber || !formData.service || !formData.department) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Fields',
        text: 'Please fill in all required fields.',
        confirmButtonText: 'Okay',
      });
      return;
    }

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'file' && value) {
        formDataToSend.append(key, value as File);
      } else {
        formDataToSend.append(key, value as string);
      }
    });
  
    formDataToSend.append('createdOn', new Date().toISOString());
    
    setIsLoading(true); 
    try {
      const response = await axios.post('http://localhost:5001/api/requests', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: response.data.message,
        confirmButtonText: 'Okay',
      });

      setIsModalOpen(false);
      window.location.reload();
      
      setFormData({
        location: '',
        service: '',
        status: 'NEW',
        priority: 'MEDIUM',
        department: '',
        requestedBy: '',
        assignedTo: '',
        date: '',
        createdOn: new Date().toISOString(),
        file: null,
        floor: '',      
        room: '',       
        block: '',     
        guestName: '',  
        phoneNumber: '',
      });
    } catch (error) {
      console.error('Error submitting form', error);
  
      Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: 'Error submitting request. Please try again.',
        confirmButtonText: 'Okay',
      });
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setFormData((prevData) => ({ ...prevData, file }));
  };

  return (
    <div className="p-6 flex flex-col lg:flex-row justify-between items-center lg:space-x-8">
      <div className="flex flex-col sm:flex-row items-center sm:space-x-4 mb-6 lg:mb-0">
        <h1 className="text-lg sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-0">Requests</h1>
        <button
          className="flex items-center bg-red-700 text-white py-2 px-3 sm:px-4 rounded-lg hover:bg-red-800 transition duration-300 transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          onClick={() => setIsModalOpen(true)} 
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          <span className="text-sm sm:text-base">New Request</span>
        </button>
      </div>

      <div className="flex flex-wrap justify-center items-center gap-4 lg:justify-end">
        {requests.map((request, index) => (
          <div key={index} className="flex flex-col items-center mb-4 sm:mb-0">
            <div className={`flex flex-col justify-center items-center w-16 h-16 sm:w-28 sm:h-28 rounded-full ${request.bgColor} shadow-md`}>
              <span className="text-3xl sm:text-5xl font-bold text-black">
                {request.count.toString().padStart(2, '0')}
              </span>
              <span className="text-xs sm:text-sm font-medium text-gray-600 mt-1 text-center">
                {request.label.split(' ').map((word, index) => (
                  <span key={index}>
                    {word}
                    {index < request.label.split(' ').length - 1 ? <br /> : ''}
                  </span>
                ))}
              </span>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <NewRequestModal
          formData={formData}
          onInputChange={handleInputChange}
          onFileChange={handleFileChange}
          onSubmit={handleSubmit}
          onClose={() => setIsModalOpen(false)}
          isLoading={isLoading} 
        />
      )}
    </div>
  );
};

interface INewRequestModalProps {
  formData: any;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: React.FormEvent) => void;
  onClose: () => void;
  isLoading: boolean; 
}

const NewRequestModal = ({ formData, onInputChange, onFileChange, onSubmit, onClose, isLoading }: INewRequestModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-4 mx-4 sm:mx-0 max-h-min">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-left">Create New Request</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <form className="space-y-4" method='POST' encType='multipart/form-data' onSubmit={onSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-left font-medium text-gray-700">
                Floor <span className="text-red-600">*</span>
              </label>
              <select
                name="floor"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                value={formData.floor}
                onChange={onInputChange}
              >
                <option value="">Select Floor</option>
                <option value="1">Ground Floor</option>
                <option value="2">First Floor</option>
                <option value="3">Second Floor</option>
              
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-left text-gray-700">
                Room / Unit <span className="text-red-600">*</span>
              </label>
              <select
                name="room"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                value={formData.room}
                onChange={onInputChange}
              >
                <option value="">Select Room</option>
                <option value="Emergency Room (ER)">Emergency Room (ER)</option>
                <option value="ICU">ICU</option>
                <option value="Laboratory">Laboratory</option>
                <option value="Pharmacy">Pharmacy</option>
                <option value="Radiology">Radiology</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-left font-medium text-gray-700">
                Block <span className="text-red-600">*</span>
              </label>
              <select
                name="block"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                value={formData.block}
                onChange={onInputChange}
              >
                <option value="">Select Block</option>
                <option value="Pediatric Ward">Pediatric Ward</option>
                <option value="Maternity">Maternity</option>
                <option value="Surgical Ward">Surgical Ward</option>
                <option value="Outpatient">Outpatient</option>
              
              </select>
            </div>

            <div>
              <label className="block text-sm text-left font-medium text-gray-700">
                Guest Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="guestName"
                value={formData.guestName}
                onChange={onInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                placeholder="Enter Guest Name"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-left font-medium text-gray-700">
                Phone Number <span className="text-red-600">*</span>
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={onInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                placeholder="Enter Phone Number"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-left font-medium text-gray-700">
                Service <span className="text-red-600">*</span>
              </label>
              <select
                name="service"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                value={formData.service}
                onChange={onInputChange}
                required
              >
            <option value="">Select Service</option>
            <option value="general_checkup">General Check-up</option>
            <option value="pediatrics">Pediatrics</option>
            <option value="cardiology">Cardiology</option>
            <option value="orthopedics">Orthopedics</option>
            <option value="dermatology">Dermatology</option>
            <option value="neurology">Neurology</option>
            <option value="emergency_services">Emergency Services</option>
            <option value="surgery">Surgery</option>
            <option value="radiology">Radiology</option>
            <option value="physiotherapy">Physiotherapy</option>
            <option value="pharmacy">Pharmacy</option>
              
              </select>
            </div>

            <div>
              <label className="block text-sm text-left font-medium text-gray-700">
                Department <span className="text-red-600">*</span>
              </label>
              <select
                name="department"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                value={formData.department}
                onChange={onInputChange}
                required
              >
                  <option value="">Select Department</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Radiology">Radiology</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Orthopedics">Orthopedics</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Pharmacy">Pharmacy</option>
                  <option value="Dermatology">Dermatology</option>
                  <option value="Oncology">Oncology</option>
                  <option value="Anesthesiology">Anesthesiology</option>
                  <option value="Geriatrics">Geriatrics</option>
              </select>
            </div>

            
          </div>

          <div>
  <label className="block text-sm w-full font-medium text-left text-gray-700">
    Attach Document (Optional)
  </label>
  <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6">
  <input
    name="file"
    type="file"
    accept=".pdf,.doc,.docx"
    className="hidden"
    id="file-upload"
    onChange={onFileChange} 
  />
  <label
    htmlFor="file-upload"
    className="flex flex-col items-center justify-center h-full w-full text-center cursor-pointer"
  >
    <FontAwesomeIcon icon={faFile} className="text-red-600 mb-2" size="3x" />
    <span className="text-gray-500 text-sm">Drag and drop your files here</span>
    <span className="text-gray-500 text-sm">or</span>
    <span className="text-red-600 text-sm underline">Browse Document</span>
  </label>
  
</div>
</div>

          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading} 
              className={`px-4 py-2 ${isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-md transition duration-300`}
            >
              {isLoading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestSummary;
