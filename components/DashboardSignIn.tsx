"use client"

import React from 'react'
import Button from './Button'

interface DashboardSignInProps {
  isOpen: boolean
  onClose: () => void
}

const DashboardSignIn = ({ isOpen, onClose }: DashboardSignInProps) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="text-center">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
            aria-label="Close modal"
          >
            ×
          </button>
          
          {/* Icon */}
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
            </svg>
          </div>
          
          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Sign in to continue
          </h2>
          
          {/* Description */}
          <p className="text-gray-600 mb-6">
            You need to sign in with your X (Twitter) account to access the dashboard.
          </p>
          
          {/* Sign in button */}
          <div className="flex justify-center">
            <Button />
          </div>
          
          {/* Additional info */}
          <p className="text-sm text-gray-500 mt-4">
            Don't have an account? Sign in to create one automatically.
          </p>
        </div>
      </div>
    </div>
  )
}

export default DashboardSignIn 