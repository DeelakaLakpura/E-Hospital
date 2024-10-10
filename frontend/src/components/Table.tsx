import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  faChevronLeft,
  faChevronRight,
  faEye,
  faTrash,
  faPen,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

interface IRequest {
  _id: string;
  floor: string;
  room: string;
  block: string;
  guestName: string;
  phoneNumber: string;
  service: string;
  status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'; 
  department: string;
  createdOn: string; 
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  file?: string;
}

const Table: React.FC = () => {
  const [requests, setRequests] = useState<IRequest[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const requestsPerPage = 10;
  const [selectedRequest, setSelectedRequest] = useState<IRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);


  const fetchRequests = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/capture');
      if (!response.ok) {
        throw new Error('Network response was not ok: ' + response.statusText);
      }
      const data: IRequest[] = await response.json();
      setRequests(data);
    } catch (error) {
      console.error('Error fetching requests:', error);
      Swal.fire('Error', 'Failed to fetch requests', 'error');
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);


  const indexOfLastRequest = currentPage * requestsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
  const currentRequests = requests.slice(indexOfFirstRequest, indexOfLastRequest);
  const totalPages = Math.ceil(requests.length / requestsPerPage);

  const handleRequestClick = (request: IRequest) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };


  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
    setIsUpdating(false);
  };

  const handleUpdate = async () => {
    if (!selectedRequest) return;

  
    const {
        floor,
        room,
        block,
        guestName,
        phoneNumber,
        service,
        department,
        priority,
        status,
    } = selectedRequest;

   
    if (
        !floor ||
        !room ||
        !block ||
        !guestName ||
        !phoneNumber ||
        !service ||
        !department ||
        !priority ||
        !status
    ) {
        Swal.fire('Error', 'Please fill in all required fields', 'error');
        return;
    }


    const validPriorities = ['HIGH', 'MEDIUM', 'LOW'];
    if (!validPriorities.includes(priority)) {
        Swal.fire('Error', 'Invalid priority value', 'error');
        return;
    }


    const validStatuses = ['PENDING', 'IN_PROGRESS', 'COMPLETED'];
    if (!validStatuses.includes(status)) {
        Swal.fire('Error', 'Invalid status value', 'error');
        return;
    }

   
    const updatedRequest = {
        floor,
        room,
        block,
        guestName,
        phoneNumber,
        service,
        department,
        priority,
        status,
    };

    try {
        setIsUpdating(true);

        const response = await fetch(`http://localhost:5001/api/requests/${selectedRequest._id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedRequest),
        });

        if (!response.ok) {
            throw new Error('Error updating request');
        }

        const data = await response.json();
        console.log(data);
        Swal.fire('Success', 'Request updated successfully!', 'success');
        closeModal();
        fetchRequests();
    } catch (error) {
        console.error('Error updating request:', error);
        Swal.fire('Error', 'Failed to update request', 'error');
        setIsUpdating(false);
    }
};


  const handleDelete = async () => {
    if (!selectedRequest) return;

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You won’t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`http://localhost:5001/api/requests/${selectedRequest._id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Error deleting request');
        }

        const data = await response.json();
        console.log(data);
        Swal.fire('Deleted!', 'Your request has been deleted.', 'success');
        closeModal();
        fetchRequests();
      } catch (error) {
        console.error('Error deleting request:', error);
        Swal.fire('Error', 'Failed to delete request', 'error');
      }
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="container mx-auto">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse border border-gray-200">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider">
                    SL No
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider">
                    Guest Name
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider">
                    Request ID
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider">
                    Created On
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider">
                    Phone Number
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentRequests.length > 0 ? (
                  currentRequests.map((request, index) => {
                    const dateValue = new Date(request.createdOn);
                    const formattedDate =
                      dateValue instanceof Date && !isNaN(dateValue.getTime())
                        ? dateValue.toLocaleDateString()
                        : 'Invalid Date';

                    return (
                      <tr key={request._id}>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                          {index + 1 + indexOfFirstRequest}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {request.guestName}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                          {request._id.length > 4 ? `${request._id.slice(-4)}` : request._id}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                          {formattedDate}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                          {`${request.block}-${request.room}`}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                          {request.service}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                          {request.department}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                          {request.phoneNumber}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-center">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          request.priority === 'HIGH'
                           ? 'bg-red-300 text-red-800'
                          : request.priority === 'MEDIUM'
                          ? 'bg-yellow-300 text-gray-800'
                         : request.priority === 'LOW'
                         ? 'bg-green-300 text-white'
                          : request.priority === 'NORMAL'
                       ? 'bg-gray-300 text-gray-800'
      : ''
  }`}
>
● {request.priority}
</span>

                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-center">
                <span
    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
      request.status === 'PENDING'
        ? 'bg-yellow-300 text-gray-800'
        : request.status === 'IN_PROGRESS'
        ? 'bg-green-300 text-green-600'
        : request.status === 'COMPLETED'
        ? 'bg-blue-300 text-blue-600'
        : 'bg-gray-100 text-gray-800'
    }`}
  >
    ● {request.status ? request.status.replace('_', ' ') : 'N/A'}
  </span>
</td>

                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium text-center">
                          <button
                            onClick={() => handleRequestClick(request)}
                            className="text-gray-400 hover:text-gray-600 mx-1"
                          >
                            <FontAwesomeIcon icon={faEye} />
                          </button>
                          
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={11} className="px-6 py-4 text-center text-sm text-gray-500">
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

      
          <div className="flex justify-center items-center p-4 bg-white border-t border-gray-200">
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="px-3 py-2 bg-gray-200 text-gray-600 rounded-md hover:bg-gray-300"
                disabled={currentPage === 1}
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-4 py-2 rounded-md ${
                    currentPage === index + 1
                      ? 'bg-red-700 text-white'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                className="px-3 py-2 bg-gray-200 text-gray-600 rounded-md hover:bg-gray-300"
                disabled={currentPage === totalPages}
              >
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </div>
          </div>
        </div>
      </div>

     
      {isModalOpen && selectedRequest && (
  <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
    <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center border-b pb-2">
        <h3 className="text-lg font-semibold text-gray-900">Request Details</h3>
        <button onClick={closeModal} className="text-gray-600 hover:text-gray-900">
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
 
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Request ID</label>
          <input
            type="text"
            value={selectedRequest._id}
            readOnly
            className="border border-gray-300 rounded-md p-2 w-full bg-gray-100"
          />
        </div>

   
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Guest Name</label>
          <input
            type="text"
            value={selectedRequest.guestName}
            onChange={(e) => setSelectedRequest({ ...selectedRequest, guestName: e.target.value })}
            className="border border-gray-300 rounded-md p-2 w-full"
          />
        </div>

    
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Phone Number</label>
          <input
            type="text"
            value={selectedRequest.phoneNumber}
            onChange={(e) => setSelectedRequest({ ...selectedRequest, phoneNumber: e.target.value })}
            className="border border-gray-300 rounded-md p-2 w-full"
          />
        </div>

      
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Created On</label>
          <input
            type="text"
            value={new Date(selectedRequest.createdOn).toLocaleDateString()}
            readOnly
            className="border border-gray-300 rounded-md p-2 w-full bg-gray-100"
          />
        </div>

    
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Block</label>
          <input
            type="text"
            value={selectedRequest.block}
            onChange={(e) => setSelectedRequest({ ...selectedRequest, block: e.target.value })}
            className="border border-gray-300 rounded-md p-2 w-full"
          />
        </div>


        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Room</label>
          <input
            type="text"
            value={selectedRequest.room}
            onChange={(e) => setSelectedRequest({ ...selectedRequest, room: e.target.value })}
            className="border border-gray-300 rounded-md p-2 w-full"
          />
        </div>

      
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Service</label>
          <input
            type="text"
            value={selectedRequest.service}
            onChange={(e) => setSelectedRequest({ ...selectedRequest, service: e.target.value })}
            className="border border-gray-300 rounded-md p-2 w-full"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Department</label>
          <input
            type="text"
            value={selectedRequest.department}
            onChange={(e) => setSelectedRequest({ ...selectedRequest, department: e.target.value })}
            className="border border-gray-300 rounded-md p-2 w-full"
          />
        </div>

  
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Priority</label>
          <select
            value={selectedRequest.priority}
            onChange={(e) =>
              setSelectedRequest({
                ...selectedRequest,
                priority: e.target.value as 'HIGH' | 'MEDIUM' | 'LOW',
              })
            }
            className="border border-gray-300 rounded-md p-2 w-full"
          >
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
           
          </select>
        </div>

 
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Status</label>
          <select
            value={selectedRequest.status || 'PENDING'}
            onChange={(e) =>
              setSelectedRequest({
                ...selectedRequest,
                status: e.target.value as 'PENDING' | 'IN_PROGRESS' | 'COMPLETED',
              })
            }
            className="border border-gray-300 rounded-md p-2 w-full"
          >
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

       
      </div>
      <div className="mt-6 flex justify-end space-x-4">
        <button
          onClick={handleUpdate}
          disabled={isUpdating}
          className={`flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 ${
            isUpdating ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <FontAwesomeIcon icon={faPen} className="mr-2" />
          {isUpdating ? 'Updating...' : 'Update'}
        </button>
        <button
          onClick={handleDelete}
          className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          <FontAwesomeIcon icon={faTrash} className="mr-2" />
          Delete
        </button>
        <button
          onClick={closeModal}
          className="flex items-center px-4 py-2 bg-gray-300 text-gray-600 rounded-md hover:bg-gray-400"
        >
          <FontAwesomeIcon icon={faTimes} className="mr-2" />
          Close
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default Table;
