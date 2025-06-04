import { Account, Client, ID } from "react-native-appwrite";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

const account = new Account(client);

export interface User {
  $id: string;
  name: string;
  email: string;
  emailVerification: boolean;
  prefs: any;
}

// Create a new user account
export const createUser = async (email: string, password: string, name: string) => {
  try {
    const newAccount = await account.create(ID.unique(), email, password, name);
    
    if (!newAccount) throw Error;
    
    // Sign in the user after account creation
    await signIn(email, password);
    
    const newUser = await account.get();
    return newUser;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message || "Failed to create account");
  }
};

// Sign in user
export const signIn = async (email: string, password: string) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message || "Failed to sign in");
  }
};

// Get current user
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const currentAccount = await account.get();
    return currentAccount as User;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// Sign out user
export const signOut = async () => {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message || "Failed to sign out");
  }
};

// Update user profile
export const updateProfile = async (name: string) => {
  try {
    const updatedUser = await account.updateName(name);
    return updatedUser;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message || "Failed to update profile");
  }
};

// Update password
export const updatePassword = async (newPassword: string, oldPassword: string) => {
  try {
    const result = await account.updatePassword(newPassword, oldPassword);
    return result;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message || "Failed to update password");
  }
};