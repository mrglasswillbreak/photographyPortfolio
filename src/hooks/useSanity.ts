import { useState, useEffect } from 'react';
import {
  getHomepageContent,
  getAboutContent,
  getContactContent,
  getGalleryImages,
  getServices,
} from '../lib/queries';
import type {
  HomepageContent,
  AboutContent,
  ContactContent,
  GalleryImage,
  Service,
} from '../types/sanity';
import {
  fallbackHomepage,
  fallbackAbout,
  fallbackContact,
  fallbackGallery,
  fallbackServices,
} from '../data/fallback';

interface UseSanityResult<T> {
  data: T;
  isLoading: boolean;
  error: Error | null;
}

// Hook for homepage content
export function useHomepageContent(): UseSanityResult<HomepageContent> {
  const [data, setData] = useState<HomepageContent>(fallbackHomepage);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    
    async function fetchData() {
      try {
        const result = await getHomepageContent();
        if (mounted && result) {
          setData(result);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch homepage content'));
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    fetchData();
    return () => { mounted = false; };
  }, []);

  return { data, isLoading, error };
}

// Hook for about page content
export function useAboutContent(): UseSanityResult<AboutContent> {
  const [data, setData] = useState<AboutContent>(fallbackAbout);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    
    async function fetchData() {
      try {
        const result = await getAboutContent();
        if (mounted && result) {
          setData(result);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch about content'));
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    fetchData();
    return () => { mounted = false; };
  }, []);

  return { data, isLoading, error };
}

// Hook for contact content
export function useContactContent(): UseSanityResult<ContactContent> {
  const [data, setData] = useState<ContactContent>(fallbackContact);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    
    async function fetchData() {
      try {
        const result = await getContactContent();
        if (mounted && result) {
          setData(result);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch contact content'));
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    fetchData();
    return () => { mounted = false; };
  }, []);

  return { data, isLoading, error };
}

// Hook for gallery images
export function useGalleryImages(): UseSanityResult<GalleryImage[]> {
  const [data, setData] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    
    async function fetchData() {
      try {
        const result = await getGalleryImages();
        if (mounted) {
          // Use fallback if no CMS images
          setData(result.length > 0 ? result : fallbackGallery);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch gallery images'));
          setData(fallbackGallery);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    fetchData();
    return () => { mounted = false; };
  }, []);

  return { data, isLoading, error };
}

// Hook for services
export function useServices(): UseSanityResult<Service[]> {
  const [data, setData] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    
    async function fetchData() {
      try {
        const result = await getServices();
        if (mounted) {
          // Use fallback if no CMS services
          setData(result.length > 0 ? result : fallbackServices);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch services'));
          setData(fallbackServices);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    fetchData();
    return () => { mounted = false; };
  }, []);

  return { data, isLoading, error };
}
