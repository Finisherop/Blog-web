import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy,
  limit,
  where
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from './firebase';
import { Blog, CreateBlogData, BlogTopic } from '@/types/blog';

export const uploadImage = async (file: File, path: string): Promise<string> => {
  try {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type. Only JPEG, PNG, WebP, and GIF images are allowed.');
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new Error('File size too large. Maximum size is 10MB.');
    }

    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    console.log('Image uploaded successfully:', downloadURL);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export const deleteImage = async (imageUrl: string) => {
  try {
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
  } catch (error) {
    console.error('Error deleting image:', error);
  }
};

export const createBlog = async (blogData: CreateBlogData): Promise<string> => {
  const docRef = await addDoc(collection(db, 'blogs'), {
    ...blogData,
    createdAt: new Date(),
    views: 0,
    ctrClicks: 0,
    topics: blogData.topics.map(topic => ({
      ...topic,
      id: crypto.randomUUID()
    }))
  });
  return docRef.id;
};

export const updateBlog = async (blogId: string, blogData: Partial<Blog>) => {
  const blogRef = doc(db, 'blogs', blogId);
  await updateDoc(blogRef, {
    ...blogData,
    updatedAt: new Date()
  });
};

export const deleteBlog = async (blogId: string) => {
  const blogRef = doc(db, 'blogs', blogId);
  await deleteDoc(blogRef);
};

export const getBlog = async (blogId: string): Promise<Blog | null> => {
  const blogRef = doc(db, 'blogs', blogId);
  const blogSnap = await getDoc(blogRef);
  
  if (blogSnap.exists()) {
    return {
      id: blogSnap.id,
      ...blogSnap.data(),
      createdAt: blogSnap.data().createdAt.toDate()
    } as Blog;
  }
  return null;
};

export const getBlogBySlug = async (slug: string): Promise<Blog | null> => {
  const blogsRef = collection(db, 'blogs');
  const q = query(blogsRef, where('slug', '==', slug), limit(1));
  const querySnapshot = await getDocs(q);
  
  if (!querySnapshot.empty) {
    const doc = querySnapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate()
    } as Blog;
  }
  return null;
};

export const getAllBlogs = async (): Promise<Blog[]> => {
  const blogsRef = collection(db, 'blogs');
  const q = query(blogsRef, orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt.toDate()
  })) as Blog[];
};

export const getRecentBlogs = async (limitCount: number = 16): Promise<Blog[]> => {
  const blogsRef = collection(db, 'blogs');
  const q = query(blogsRef, orderBy('createdAt', 'desc'), limit(limitCount));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt.toDate()
  })) as Blog[];
};

export const addTopicToBlog = async (blogId: string, topic: Omit<BlogTopic, 'id'>) => {
  const blog = await getBlog(blogId);
  if (blog) {
    const newTopic = { ...topic, id: crypto.randomUUID() };
    const updatedTopics = [...blog.topics, newTopic];
    await updateBlog(blogId, { topics: updatedTopics });
  }
};

export const updateTopicInBlog = async (blogId: string, topicId: string, topicData: Partial<BlogTopic>) => {
  const blog = await getBlog(blogId);
  if (blog) {
    const updatedTopics = blog.topics.map(topic => 
      topic.id === topicId ? { ...topic, ...topicData } : topic
    );
    await updateBlog(blogId, { topics: updatedTopics });
  }
};

export const deleteTopicFromBlog = async (blogId: string, topicId: string) => {
  const blog = await getBlog(blogId);
  if (blog) {
    const updatedTopics = blog.topics.filter(topic => topic.id !== topicId);
    await updateBlog(blogId, { topics: updatedTopics });
  }
};

export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};