import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { supabase } from "./supabase"

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
