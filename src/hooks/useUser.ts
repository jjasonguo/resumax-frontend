import { useState, useEffect } from 'react';
import { useUser as useClerkUser } from '@clerk/nextjs';
import { apiService, User } from '../services/api';

export const useUser = () => {
  const { user: clerkUser, isLoaded: isClerkLoaded } = useClerkUser();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch or create user when Clerk user is loaded
  useEffect(() => {
    const fetchOrCreateUser = async () => {
      if (!isClerkLoaded || !clerkUser) {
        console.log('⏳ Clerk not loaded or no user');
        setLoading(false);
        return;
      }

      console.log('🔍 Clerk user loaded:', {
        id: clerkUser.id,
        name: clerkUser.fullName,
        email: clerkUser.primaryEmailAddress?.emailAddress
      });

      try {
        setLoading(true);
        setError(null);

        console.log('🔍 Fetching user with Clerk ID:', clerkUser.id);
        // Try to fetch existing user
        const existingUser = await apiService.getUserByClerkId(clerkUser.id);
        console.log('✅ Found existing user:', existingUser);
        setUser(existingUser);
      } catch (error: any) {
        console.log('❌ Error fetching user:', error.message);
        // If user doesn't exist, create new user
        if (error.message.includes('User not found')) {
          console.log('📝 Creating new user with Clerk ID:', clerkUser.id);
          try {
            const newUser = await apiService.createUserWithClerk({
              clerkUserId: clerkUser.id,
              name: clerkUser.fullName || clerkUser.firstName || 'User',
              email: clerkUser.primaryEmailAddress?.emailAddress || '',
            });
            console.log('✅ Created new user:', newUser);
            setUser(newUser);
          } catch (createError: any) {
            console.error('❌ Error creating user:', createError.message);
            setError(createError.message);
          }
        } else {
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrCreateUser();
  }, [clerkUser, isClerkLoaded]);

  // Update user data
  const updateUser = async (userData: Partial<User>) => {
    if (!clerkUser || !user) return;

    try {
      setError(null);
      const updatedUser = await apiService.updateUserByClerkId(clerkUser.id, userData);
      setUser(updatedUser);
      return updatedUser;
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  // Project operations
  const addProject = async (project: Omit<User['projects'][0], '_id' | 'createdAt' | 'updatedAt'>) => {
    if (!user?._id) return;

    try {
      setError(null);
      const updatedUser = await apiService.addProject(user._id, project);
      setUser(updatedUser);
      return updatedUser;
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  const updateProject = async (projectId: string, project: Partial<User['projects'][0]>) => {
    if (!user?._id) return;

    try {
      setError(null);
      const updatedUser = await apiService.updateProject(user._id, projectId, project);
      setUser(updatedUser);
      return updatedUser;
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  const deleteProject = async (projectId: string) => {
    if (!user?._id) return;

    try {
      setError(null);
      const updatedUser = await apiService.deleteProject(user._id, projectId);
      setUser(updatedUser);
      return updatedUser;
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  // Work experience operations
  const addWorkExperience = async (experience: Omit<User['workExperiences'][0], '_id' | 'createdAt' | 'updatedAt'>) => {
    if (!user?._id) return;

    try {
      setError(null);
      const updatedUser = await apiService.addWorkExperience(user._id, experience);
      setUser(updatedUser);
      return updatedUser;
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  const updateWorkExperience = async (experienceId: string, experience: Partial<User['workExperiences'][0]>) => {
    if (!user?._id) return;

    try {
      setError(null);
      const updatedUser = await apiService.updateWorkExperience(user._id, experienceId, experience);
      setUser(updatedUser);
      return updatedUser;
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  const deleteWorkExperience = async (experienceId: string) => {
    if (!user?._id) return;

    try {
      setError(null);
      const updatedUser = await apiService.deleteWorkExperience(user._id, experienceId);
      setUser(updatedUser);
      return updatedUser;
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  return {
    user,
    loading,
    error,
    updateUser,
    addProject,
    updateProject,
    deleteProject,
    addWorkExperience,
    updateWorkExperience,
    deleteWorkExperience,
    isAuthenticated: !!clerkUser,
  };
}; 