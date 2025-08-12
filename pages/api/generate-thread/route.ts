import { NextRequest, NextResponse } from 'next/server'
import { openai } from '@/lib/openai'
import { THREAD_GENERATION_PROMPT } from '@/constants/index'
import { processTweets } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const { topic, writingStyle, threadLength, username } = await request.json()

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      )
    }

    // Create the user prompt with their specific requirements
    const userPrompt = `
Topic: ${topic}
Writing Style: ${writingStyle || 'informative'}
Number of Content Items/Tips: ${threadLength || 7}
User Handle: @${username || 'yourhandle'}

Generate a Twitter thread about this topic following the format specified in the system prompt.
The thread should have ${threadLength || 7} numbered content items/tips, plus intro and summary tweets.
In the final call-to-action tweet, use "@${username || 'yourhandle'}" instead of "@yourhandle".
`

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: THREAD_GENERATION_PROMPT
        },
        {
          role: "user", 
          content: userPrompt
        }
      ],
      temperature: 0.8,
      max_tokens: 2000,
    })

    const response = completion.choices[0]?.message?.content

    if (!response) {
      throw new Error('No response from OpenAI')
    }

    try {
      // Parse the JSON response from OpenAI
      const tweets = JSON.parse(response)
      
      if (!Array.isArray(tweets)) {
        throw new Error('Invalid response format from AI')
      }

      // Process and validate tweets
      const processedTweets = processTweets(tweets, threadLength || 7)

      return NextResponse.json({
        success: true,
        tweets: processedTweets,
        originalCount: tweets.length,
        processedCount: processedTweets.length
      })

    } catch (parseError) {
      console.error('Error parsing AI response:', parseError)
      return NextResponse.json(
        { error: 'Failed to parse AI response. Please try again.' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Error generating thread:', error)
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to generate thread. Please try again.' 
      },
      { status: 500 }
    )
  }
} 