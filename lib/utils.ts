import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { supabase } from "./supabase"
import { Thread } from "@/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export async function getUser() {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return []
    }

    const { data, error } = await supabase
      .from('users')
      .select('name, screen_name, profile_image_url')
      .eq('twitter_id', user.id)
      .single()

    if (error) {
      console.error('Error fetching user data:', error)
      return []
    }

    // Transform to display format
    const userData = {
      name: data.name,
      screen_name: data.screen_name,
      profile_image_url: data.profile_image_url
    }

    return userData
  } catch (error) {
    console.error('Error in getUserThreads:', error)
    return []
  }
}

// Thread database utilities
export async function saveThread(threadData: Partial<Thread>): Promise<Thread | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('User not authenticated')
    }

    const thread = {
      user_id: user.id,
      name: threadData.name || '',
      topic: threadData.topic || '',
      writing_style: threadData.writing_style || 'informative',
      thread_length: threadData.thread_length || 7,
      tweets: threadData.tweets || [],
      status: threadData.status || 'Not Scheduled' as const
    }

    const { data, error } = await supabase
      .from('threads')
      .insert([thread])
      .select()
      .single()

    if (error) {
      console.error('Error saving thread:', error)
      throw error
    }

    // Dispatch custom event to notify other components
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('threadAdded'))
    }

    return data
  } catch (error) {
    console.error('Error in saveThread:', error)
    return null
  }
}

export function validateTweet(tweet: string): string {
  // Remove extra whitespace and ensure proper formatting
  const cleaned = tweet.trim()
  
  // Ensure tweet doesn't exceed 280 characters
  if (cleaned.length > 280) {
    return cleaned.substring(0, 277) + "..."
  }
  
  return cleaned
}

export function processTweets(tweets: string[], length: number): string[] {
  // length = number of content items/tips
  // Expected structure: 1 intro + X content + 1 summary + 1 CTA = X + 3 total tweets
  const expectedTotalTweets = length + 3
  
  return tweets
    .filter((tweet: string) => tweet && tweet.length > 0)
    .slice(0, expectedTotalTweets)
    .map((tweet: string) => validateTweet(tweet))
}


export async function getThreadById(id: string): Promise<Thread | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return null
    }

    const { data, error } = await supabase
      .from('threads')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (error) {
      console.error('Error fetching thread:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error in getThreadById:', error)
    return null
  }
}

export async function updateThread(id: string, updates: Partial<Thread>): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return false
    }

    const { error } = await supabase
      .from('threads')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error updating thread:', error)
      return false
    }

    // Dispatch custom event to notify other components
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('threadUpdated'))
    }

    return true
  } catch (error) {
    console.error('Error in updateThread:', error)
    return false
  }
}

export async function updateThreadStatus(id: string, status: Thread['status']): Promise<boolean> {
  return updateThread(id, { status })
}

export async function deleteThread(id: string): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return false
    }

    const { error } = await supabase
      .from('threads')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error deleting thread:', error)
      return false
    }

    // Dispatch custom event to notify other components
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('threadDeleted'))
    }

    return true
  } catch (error) {
    console.error('Error in deleteThread:', error)
    return false
  }
}