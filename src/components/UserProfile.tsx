'use client';

import { useState } from 'react';
import { useUser } from '../hooks/useUser';

export const UserProfile = () => {
  const { 
    user, 
    loading, 
    error, 
    updateUser, 
    addProject, 
    addWorkExperience 
  } = useUser();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    university: '',
    major: '',
    gpa: ''
  });

  if (loading) {
    return <div>Loading user data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <div>No user data available</div>;
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUser({
        name: formData.name,
        university: formData.university,
        major: formData.major,
        gpa: parseFloat(formData.gpa) || undefined
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleAddProject = async () => {
    try {
      await addProject({
        projectName: 'Sample Project',
        skills: ['React', 'TypeScript'],
        sampleBullets: ['Implemented feature X', 'Improved performance by Y%']
      });
    } catch (error) {
      console.error('Failed to add project:', error);
    }
  };

  const handleAddWorkExperience = async () => {
    try {
      await addWorkExperience({
        company: 'Sample Company',
        position: 'Software Engineer',
        startDate: '2023-01-01',
        endDate: '2023-12-31',
        skills: ['JavaScript', 'Node.js'],
        sampleBullets: ['Developed feature X', 'Led team of Y developers']
      });
    } catch (error) {
      console.error('Failed to add work experience:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">User Profile</h1>
      
      {/* Basic Info */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Basic Information</h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleUpdateProfile}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-2 border rounded"
                  placeholder={user.name}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full p-2 border rounded bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">University</label>
                <input
                  type="text"
                  value={formData.university}
                  onChange={(e) => setFormData({...formData, university: e.target.value})}
                  className="w-full p-2 border rounded"
                  placeholder={user.university || 'Enter university'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Major</label>
                <input
                  type="text"
                  value={formData.major}
                  onChange={(e) => setFormData({...formData, major: e.target.value})}
                  className="w-full p-2 border rounded"
                  placeholder={user.major || 'Enter major'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">GPA</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="4"
                  value={formData.gpa}
                  onChange={(e) => setFormData({...formData, gpa: e.target.value})}
                  className="w-full p-2 border rounded"
                  placeholder={user.gpa?.toString() || 'Enter GPA'}
                />
              </div>
            </div>
            <button
              type="submit"
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Save Changes
            </button>
          </form>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">Name</label>
              <p className="text-lg">{user.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Email</label>
              <p className="text-lg">{user.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">University</label>
              <p className="text-lg">{user.university || 'Not specified'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Major</label>
              <p className="text-lg">{user.major || 'Not specified'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">GPA</label>
              <p className="text-lg">{user.gpa || 'Not specified'}</p>
            </div>
          </div>
        )}
      </div>

      {/* Projects */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Projects ({user.projects?.length || 0})</h2>
          <button
            onClick={handleAddProject}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add Project
          </button>
        </div>
        
        {user.projects && user.projects.length > 0 ? (
          <div className="space-y-4">
            {user.projects.map((project, index) => (
              <div key={project._id || index} className="border rounded p-4">
                <h3 className="font-semibold">{project.projectName}</h3>
                <p className="text-sm text-gray-600">Skills: {project.skills.join(', ')}</p>
                <ul className="mt-2 text-sm">
                  {project.sampleBullets.map((bullet, i) => (
                    <li key={i} className="list-disc list-inside">{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No projects added yet.</p>
        )}
      </div>

      {/* Work Experience */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Work Experience ({user.workExperiences?.length || 0})</h2>
          <button
            onClick={handleAddWorkExperience}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add Experience
          </button>
        </div>
        
        {user.workExperiences && user.workExperiences.length > 0 ? (
          <div className="space-y-4">
            {user.workExperiences.map((experience, index) => (
              <div key={experience._id || index} className="border rounded p-4">
                <h3 className="font-semibold">{experience.company}</h3>
                <p className="text-sm text-gray-600">{experience.position}</p>
                <p className="text-sm text-gray-600">
                  {experience.startDate} - {experience.endDate || 'Present'}
                </p>
                <p className="text-sm text-gray-600">Skills: {experience.skills.join(', ')}</p>
                <ul className="mt-2 text-sm">
                  {experience.sampleBullets.map((bullet, i) => (
                    <li key={i} className="list-disc list-inside">{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No work experience added yet.</p>
        )}
      </div>
    </div>
  );
}; 