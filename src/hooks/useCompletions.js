import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useCompletions(goalId, userId) {
  const [completions, setCompletions] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchCompletions = useCallback(async () => {
    if (!goalId) {
      setLoading(false)
      return
    }

    const { data } = await supabase
      .from('completions')
      .select('*')
      .eq('goal_id', goalId)
      .order('day_number', { ascending: true })

    setCompletions(data ?? [])
    setLoading(false)
  }, [goalId])

  useEffect(() => {
    fetchCompletions()
  }, [fetchCompletions])

  async function logCompletion(dayNumber, completed) {
    const { data, error } = await supabase
      .from('completions')
      .upsert(
        { goal_id: goalId, user_id: userId, day_number: dayNumber, completed },
        { onConflict: 'goal_id,day_number' }
      )
      .select()
      .single()

    if (!error) {
      setCompletions(prev => {
        const filtered = prev.filter(c => c.day_number !== dayNumber)
        return [...filtered, data].sort((a, b) => a.day_number - b.day_number)
      })
    }

    return { data, error }
  }

  return { completions, loading, logCompletion }
}
