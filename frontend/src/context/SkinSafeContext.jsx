import React, { createContext, useContext, useState, useEffect } from 'react'

const SkinSafeContext = createContext()

const DEFAULT_ALLERGIES = [
  'Synthetic Fragrance',
  'Tree Nut Oils'
]

export function SkinSafeProvider({ children }) {
  const [allergies, setAllergies] = useState(() => {
    const saved = localStorage.getItem('shopsync_allergies')
    return saved ? JSON.parse(saved) : DEFAULT_ALLERGIES
  })

  const [recentAnalysis, setRecentAnalysis] = useState(() => {
    const saved = localStorage.getItem('shopsync_skin_analysis')
    return saved ? JSON.parse(saved) : {
      skinType: 'Combination Sensitive',
      primaryConcerns: ['Barrier Compromise', 'Redness / Erythema', 'Mild Dehydration'],
      hydrationScore: 68,
      barrierHealthScore: 74,
      smoothnessScore: 82,
      analyzedAt: '2026-10-30T10:15:00Z',
      suggestedRoutine: [
        { step: 'Cleanse', type: 'Ultra-Gentle Amino Acid Cleanser', recommendedId: 'prod-002' },
        { step: 'Restore', type: 'Peptide Barrier Elixir', recommendedId: 'prod-002' },
        { step: 'Shield', type: 'Mineral Silk Fluid SPF 50+', recommendedId: 'prod-004' }
      ]
    }
  })

  useEffect(() => {
    localStorage.setItem('shopsync_allergies', JSON.stringify(allergies))
  }, [allergies])

  useEffect(() => {
    localStorage.setItem('shopsync_skin_analysis', JSON.stringify(recentAnalysis))
  }, [recentAnalysis])

  const addAllergy = (allergen) => {
    if (!allergies.includes(allergen)) {
      setAllergies(prev => [...prev, allergen])
    }
  }

  const removeAllergy = (allergen) => {
    setAllergies(prev => prev.filter(a => a !== allergen))
  }

  // Cross-reference a product's ingredient list and allergy tags against user allergies
  const checkProductSafety = (product) => {
    if (!allergies || allergies.length === 0) {
      return { isSafe: true, flaggedAllergens: [], safetyScore: 100 }
    }

    const flagged = []
    const ingredientsLower = (product.ingredients || '').toLowerCase()
    const tagsLower = (product.allergyTags || []).map(t => t.toLowerCase())

    allergies.forEach(allergen => {
      const aLower = allergen.toLowerCase()
      // If product explicitly is free of it, it's safe
      if (tagsLower.includes(`${aLower}-free`)) {
        return
      }

      // Check ingredient keywords
      if (aLower.includes('fragrance') && (ingredientsLower.includes('parfum') || ingredientsLower.includes('fragrance') || ingredientsLower.includes('linalool') || ingredientsLower.includes('limonene'))) {
        flagged.push({ allergen, matchedIngredient: 'Parfum / Fragrance compounds' })
      } else if (aLower.includes('nut') && (ingredientsLower.includes('almond') || ingredientsLower.includes('macadamia') || ingredientsLower.includes('walnut') || ingredientsLower.includes('hazelnut'))) {
        flagged.push({ allergen, matchedIngredient: 'Prunus Amygdalus / Nut oil extracts' })
      } else if (aLower.includes('sulfate') && (ingredientsLower.includes('sulfate') || ingredientsLower.includes('sls') || ingredientsLower.includes('sles'))) {
        flagged.push({ allergen, matchedIngredient: 'Sulfate surfactants' })
      } else if (aLower.includes('paraben') && ingredientsLower.includes('paraben')) {
        flagged.push({ allergen, matchedIngredient: 'Paraben preservatives' })
      }
    })

    const isSafe = flagged.length === 0
    const safetyScore = isSafe ? 100 : Math.max(20, 100 - (flagged.length * 35))

    return {
      isSafe,
      flaggedAllergens: flagged,
      safetyScore
    }
  }

  const clearRecentAnalysis = () => {
    setRecentAnalysis(null)
    localStorage.removeItem('shopsync_skin_analysis')
  }

  return (
    <SkinSafeContext.Provider
      value={{
        allergies,
        addAllergy,
        removeAllergy,
        checkProductSafety,
        recentAnalysis,
        setRecentAnalysis,
        clearRecentAnalysis
      }}
    >
      {children}
    </SkinSafeContext.Provider>
  )
}

export function useSkinSafe() {
  const context = useContext(SkinSafeContext)
  if (!context) {
    throw new Error('useSkinSafe must be used within a SkinSafeProvider')
  }
  return context
}

export default SkinSafeContext
