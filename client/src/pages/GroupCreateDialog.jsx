import axios from 'axios';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { groupRoute } from '../components/constant';

const GroupModal = ({ onClose }) => {
    const [groupName, setGroupName] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);

    const handleUserSelect = (e) => {
        const { value, checked } = e.target;
        setSelectedUsers((prev) =>
            checked ? [...prev, value] : prev.filter((user) => user !== value)
        );
        console.log(selectedUsers)
    };

    const handleSave = async () => {
        try {
            const data = {
                groupMembers:selectedUsers,
                groupName:groupName
            }
            const response = await axios.post(`${groupRoute}/create-group`, data, { withCredentials: true });
            console.log(response.data)
        } catch (error) {
            console.log(error);
        }
        setGroupName('');
        setSelectedUsers([]);
        onClose();
    };

    const { contacts } = useSelector(store => store.user);
    const users = contacts;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-slate-800 p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-semibold text-white mb-6">Create a Group</h2>

                {/* Group Name Input */}
                <div className="mb-4">
                    <label htmlFor="groupName" className="block text-sm text-gray-300 mb-2">
                        Group Name
                    </label>
                    <input
                        type="text"
                        id="groupName"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        placeholder="Enter group name"
                        className="w-full p-2 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600"
                    />
                </div>

                {/* User Selection */}
                <div className="mb-6">
                    <label className="block text-sm text-gray-300 mb-2">Select Users</label>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                        {users.map((user) => (
                            <label key={user._id} className="flex items-center text-white capitalize">
                                <input
                                    type="checkbox"
                                    value={user.contactId}
                                    onChange={handleUserSelect}
                                    className="mr-3 w-5 h-5 bg-slate-700 border-gray-400 rounded focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                                />
                                {user.name}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Modal Actions */}
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
                    >
                        Save Group
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GroupModal;
