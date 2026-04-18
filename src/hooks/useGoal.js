import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useGoal(userId) {
  const [goal, setGoal] = useState(undefined)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    async function fetchGoal() {
      const { data } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .maybeSingle()

      setGoal(data ?? null)
      setLoading(false)
    }

    fetchGoal()
  }, [userId])

  async function createGoal(identity, goalText) {
    const { data, error } = await supabase
      .from('goals')
      .insert({ user_id: userId, identity, goal_text: goalText })
      .select()
      .single()

    if (!error) setGoal(data)
    return { data, error }
  }

  async function completeGoal() {
    if (!goal) return { error: new Error('No active goal') }
    const { data, error } = await supabase
      .from('goals')
      .update({ status: 'complete', completed_at: new Date().toISOString() })
      .eq('id', goal.id)
      .select()
      .single()

    if (!error) setGoal(null)
    return { data, error }
  }

  return { goal, loading, createGoal, completeGoal }
}
