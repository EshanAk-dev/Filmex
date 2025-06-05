import { getSavedMovies, removeSavedMovie, SavedMovie, saveMovie } from "@/services/savedMovies";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

interface SavedMoviesContextType {
  savedMovies: SavedMovie[];
  isLoading: boolean;
  saveMovieHandler: (movie: Movie | MovieDetails) => Promise<void>;
  removeSavedMovieHandler: (movieId: number) => Promise<void>;
  isMovieSavedHandler: (movieId: number) => boolean;
  refreshSavedMovies: () => Promise<void>;
}

const SavedMoviesContext = createContext<SavedMoviesContextType | undefined>(undefined);

export const useSavedMovies = (): SavedMoviesContextType => {
  const context = useContext(SavedMoviesContext);
  if (context === undefined) {
    throw new Error("useSavedMovies must be used within a SavedMoviesProvider");
  }
  return context;
};

interface SavedMoviesProviderProps {
  children: React.ReactNode;
}

export const SavedMoviesProvider: React.FC<SavedMoviesProviderProps> = ({ children }) => {
  const { user, isLoggedIn } = useAuth();
  const [savedMovies, setSavedMovies] = useState<SavedMovie[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch saved movies when user logs in
  const fetchSavedMovies = async () => {
    if (!user || !isLoggedIn) return;
    
    setIsLoading(true);
    try {
      const movies = await getSavedMovies(user.$id);
      setSavedMovies(movies);
    } catch (error) {
      console.log("Error fetching saved movies:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Save a movie
  const saveMovieHandler = async (movie: Movie | MovieDetails) => {
    if (!user || !isLoggedIn) {
      throw new Error("User must be logged in to save movies");
    }

    try {
      await saveMovie(user.$id, movie);
      await fetchSavedMovies(); // Refresh the list
    } catch (error) {
      throw error;
    }
  };

  // Remove a saved movie
  const removeSavedMovieHandler = async (movieId: number) => {
    if (!user || !isLoggedIn) {
      throw new Error("User must be logged in to remove saved movies");
    }

    try {
      await removeSavedMovie(user.$id, movieId);
      setSavedMovies(prev => prev.filter(movie => movie.movieId !== movieId));
    } catch (error) {
      throw error;
    }
  };

  // Check if a movie is saved (local check for better performance)
  const isMovieSavedHandler = (movieId: number): boolean => {
    return savedMovies.some(movie => movie.movieId === movieId);
  };

  // Refresh saved movies
  const refreshSavedMovies = async () => {
    await fetchSavedMovies();
  };

  useEffect(() => {
    if (isLoggedIn && user) {
      fetchSavedMovies();
    } else {
      setSavedMovies([]);
    }
  }, [isLoggedIn, user]);

  return (
    <SavedMoviesContext.Provider
      value={{
        savedMovies,
        isLoading,
        saveMovieHandler,
        removeSavedMovieHandler,
        isMovieSavedHandler,
        refreshSavedMovies,
      }}
    >
      {children}
    </SavedMoviesContext.Provider>
  );
};