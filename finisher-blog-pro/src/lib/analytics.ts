import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  increment,
  query,
  getDocs,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from './firebase';

export interface BlogAnalytics {
  blogId: string;
  views: number;
  ctrClicks: number;
  uniqueVisitors: number;
  lastViewed: Date;
}

export const trackPageView = async (blogId: string, isUnique: boolean = false) => {
  try {
    const analyticsRef = doc(db, 'analytics', blogId);
    const analyticsDoc = await getDoc(analyticsRef);

    if (analyticsDoc.exists()) {
      const updateData: any = {
        views: increment(1),
        lastViewed: new Date()
      };
      
      if (isUnique) {
        updateData.uniqueVisitors = increment(1);
      }
      
      await updateDoc(analyticsRef, updateData);
    } else {
      await setDoc(analyticsRef, {
        blogId,
        views: 1,
        ctrClicks: 0,
        uniqueVisitors: isUnique ? 1 : 0,
        lastViewed: new Date()
      });
    }
  } catch (error) {
    console.error('Error tracking page view:', error);
  }
};

export const trackCTRClick = async (blogId: string) => {
  try {
    const analyticsRef = doc(db, 'analytics', blogId);
    await updateDoc(analyticsRef, {
      ctrClicks: increment(1)
    });
  } catch (error) {
    console.error('Error tracking CTR click:', error);
  }
};

export const getAnalytics = async (blogId: string): Promise<BlogAnalytics | null> => {
  try {
    const analyticsRef = doc(db, 'analytics', blogId);
    const analyticsDoc = await getDoc(analyticsRef);
    
    if (analyticsDoc.exists()) {
      return analyticsDoc.data() as BlogAnalytics;
    }
    return null;
  } catch (error) {
    console.error('Error getting analytics:', error);
    return null;
  }
};

export const getAllAnalytics = async () => {
  try {
    const analyticsRef = collection(db, 'analytics');
    const q = query(analyticsRef, orderBy('views', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting all analytics:', error);
    return [];
  }
};

export const getTotalStats = async () => {
  try {
    const analyticsRef = collection(db, 'analytics');
    const querySnapshot = await getDocs(analyticsRef);
    
    let totalViews = 0;
    let totalCTRClicks = 0;
    let totalUniqueVisitors = 0;
    let topBlog = { id: '', views: 0, title: '' };
    
    querySnapshot.docs.forEach(doc => {
      const data = doc.data();
      totalViews += data.views || 0;
      totalCTRClicks += data.ctrClicks || 0;
      totalUniqueVisitors += data.uniqueVisitors || 0;
      
      if (data.views > topBlog.views) {
        topBlog = {
          id: doc.id,
          views: data.views,
          title: data.title || 'Untitled'
        };
      }
    });
    
    return {
      totalViews,
      totalCTRClicks,
      totalUniqueVisitors,
      totalBlogs: querySnapshot.size,
      topBlog
    };
  } catch (error) {
    console.error('Error getting total stats:', error);
    return {
      totalViews: 0,
      totalCTRClicks: 0,
      totalUniqueVisitors: 0,
      totalBlogs: 0,
      topBlog: { id: '', views: 0, title: '' }
    };
  }
};