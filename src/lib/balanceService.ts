// Balance Management Service with Transaction Handling
import { supabase } from "./supabase"

export type TransactionType = "deposit" | "withdrawal" | "entry_fee" | "prize" | "refund"

export interface Transaction {
  transaction_id?: number
  user_id: number
  type: TransactionType
  amount: number
  description: string
  created_at?: string
  balance_after: number
}

export interface BalanceResult {
  success: boolean
  message: string
  newBalance?: number
  transaction?: Transaction
}

// Get user's current balance
export const getUserBalance = async (userId: number): Promise<number> => {
  const { data, error } = await supabase.from("users").select("wallet_balance").eq("user_id", userId).single()

  if (error || !data) {
    console.error("Error fetching balance:", error)
    return 0
  }

  return data.wallet_balance || 0
}

// Add funds to wallet (deposit)
export const depositFunds = async (
  userId: number,
  amount: number,
  description = "Wallet deposit",
): Promise<BalanceResult> => {
  if (amount <= 0) {
    return { success: false, message: "Amount must be positive" }
  }

  try {
    // Get current balance
    const currentBalance = await getUserBalance(userId)
    const newBalance = currentBalance + amount

    // Update user balance
    const { error: updateError } = await supabase
      .from("users")
      .update({ wallet_balance: newBalance })
      .eq("user_id", userId)

    if (updateError) throw updateError

    // Create transaction record
    const transaction: Transaction = {
      user_id: userId,
      type: "deposit",
      amount: amount,
      description,
      balance_after: newBalance,
    }

    const { data: txData, error: txError } = await supabase.from("transactions").insert(transaction).select().single()

    if (txError) {
      console.error("Transaction record error:", txError)
      // Balance already updated, log but don't fail
    }

    return {
      success: true,
      message: `Successfully deposited ${amount} DZD`,
      newBalance,
      transaction: txData || transaction,
    }
  } catch (error) {
    console.error("Deposit error:", error)
    return { success: false, message: "Failed to deposit funds" }
  }
}

// Withdraw funds from wallet
export const withdrawFunds = async (
  userId: number,
  amount: number,
  description = "Wallet withdrawal",
): Promise<BalanceResult> => {
  if (amount <= 0) {
    return { success: false, message: "Amount must be positive" }
  }

  try {
    const currentBalance = await getUserBalance(userId)

    if (currentBalance < amount) {
      return { success: false, message: "Insufficient balance" }
    }

    const newBalance = currentBalance - amount

    // Update user balance
    const { error: updateError } = await supabase
      .from("users")
      .update({ wallet_balance: newBalance })
      .eq("user_id", userId)

    if (updateError) throw updateError

    // Create transaction record
    const transaction: Transaction = {
      user_id: userId,
      type: "withdrawal",
      amount: -amount, // Negative for withdrawals
      description,
      balance_after: newBalance,
    }

    const { data: txData, error: txError } = await supabase.from("transactions").insert(transaction).select().single()

    if (txError) {
      console.error("Transaction record error:", txError)
    }

    return {
      success: true,
      message: `Successfully withdrew ${amount} DZD`,
      newBalance,
      transaction: txData || transaction,
    }
  } catch (error) {
    console.error("Withdrawal error:", error)
    return { success: false, message: "Failed to withdraw funds" }
  }
}

// Pay match entry fee
export const payEntryFee = async (
  userId: number,
  matchId: number,
  teamName: string,
  entryFee: number,
): Promise<BalanceResult> => {
  if (entryFee <= 0) {
    return { success: false, message: "Invalid entry fee" }
  }

  try {
    const currentBalance = await getUserBalance(userId)

    if (currentBalance < entryFee) {
      return {
        success: false,
        message: `Insufficient balance. You need ${entryFee} DZD but only have ${currentBalance} DZD`,
      }
    }

    const newBalance = currentBalance - entryFee

    // Update user balance
    const { error: updateError } = await supabase
      .from("users")
      .update({ wallet_balance: newBalance })
      .eq("user_id", userId)

    if (updateError) throw updateError

    // Create transaction record
    const transaction: Transaction = {
      user_id: userId,
      type: "entry_fee",
      amount: -entryFee,
      description: `Match entry fee - ${teamName}`,
      balance_after: newBalance,
    }

    const { data: txData, error: txError } = await supabase.from("transactions").insert(transaction).select().single()

    if (txError) {
      console.error("Transaction record error:", txError)
    }

    return {
      success: true,
      message: `Entry fee of ${entryFee} DZD paid successfully`,
      newBalance,
      transaction: txData || transaction,
    }
  } catch (error) {
    console.error("Entry fee payment error:", error)
    return { success: false, message: "Failed to pay entry fee" }
  }
}

// Award prize money
export const awardPrize = async (
  userId: number,
  matchId: number,
  prizeAmount: number,
  description = "Match prize",
): Promise<BalanceResult> => {
  if (prizeAmount <= 0) {
    return { success: false, message: "Invalid prize amount" }
  }

  try {
    const currentBalance = await getUserBalance(userId)
    const newBalance = currentBalance + prizeAmount

    // Update user balance
    const { error: updateError } = await supabase
      .from("users")
      .update({ wallet_balance: newBalance })
      .eq("user_id", userId)

    if (updateError) throw updateError

    // Create transaction record
    const transaction: Transaction = {
      user_id: userId,
      type: "prize",
      amount: prizeAmount,
      description,
      balance_after: newBalance,
    }

    const { data: txData, error: txError } = await supabase.from("transactions").insert(transaction).select().single()

    if (txError) {
      console.error("Transaction record error:", txError)
    }

    return {
      success: true,
      message: `Prize of ${prizeAmount} DZD awarded!`,
      newBalance,
      transaction: txData || transaction,
    }
  } catch (error) {
    console.error("Prize award error:", error)
    return { success: false, message: "Failed to award prize" }
  }
}

// Issue refund
export const issueRefund = async (userId: number, amount: number, reason: string): Promise<BalanceResult> => {
  if (amount <= 0) {
    return { success: false, message: "Invalid refund amount" }
  }

  try {
    const currentBalance = await getUserBalance(userId)
    const newBalance = currentBalance + amount

    // Update user balance
    const { error: updateError } = await supabase
      .from("users")
      .update({ wallet_balance: newBalance })
      .eq("user_id", userId)

    if (updateError) throw updateError

    // Create transaction record
    const transaction: Transaction = {
      user_id: userId,
      type: "refund",
      amount: amount,
      description: `Refund: ${reason}`,
      balance_after: newBalance,
    }

    const { data: txData, error: txError } = await supabase.from("transactions").insert(transaction).select().single()

    if (txError) {
      console.error("Transaction record error:", txError)
    }

    return {
      success: true,
      message: `Refund of ${amount} DZD processed`,
      newBalance,
      transaction: txData || transaction,
    }
  } catch (error) {
    console.error("Refund error:", error)
    return { success: false, message: "Failed to process refund" }
  }
}

// Get transaction history
export const getTransactionHistory = async (userId: number, limit = 20, offset = 0): Promise<Transaction[]> => {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error("Error fetching transactions:", error)
    return []
  }

  return data || []
}

// Get transaction summary
export const getTransactionSummary = async (userId: number) => {
  const transactions = await getTransactionHistory(userId, 100)

  const summary = {
    totalDeposits: 0,
    totalWithdrawals: 0,
    totalEntryFees: 0,
    totalPrizes: 0,
    totalRefunds: 0,
    netFlow: 0,
  }

  transactions.forEach((tx) => {
    switch (tx.type) {
      case "deposit":
        summary.totalDeposits += tx.amount
        break
      case "withdrawal":
        summary.totalWithdrawals += Math.abs(tx.amount)
        break
      case "entry_fee":
        summary.totalEntryFees += Math.abs(tx.amount)
        break
      case "prize":
        summary.totalPrizes += tx.amount
        break
      case "refund":
        summary.totalRefunds += tx.amount
        break
    }
  })

  summary.netFlow =
    summary.totalDeposits +
    summary.totalPrizes +
    summary.totalRefunds -
    summary.totalWithdrawals -
    summary.totalEntryFees

  return summary
}

export const calculateTeamBalanceMetrics = async (teamId: number) => {
  const { data, error } = await supabase
    .from("teams")
    .select(
      `
      team_id,
      team_name,
      avg_skill,
      avg_age,
      player_count,
      team_members (
        user_id,
        assigned_position,
        users (skill_level, age)
      )
    `,
    )
    .eq("team_id", teamId)
    .single()

  if (error) {
    console.error("[v0] Error fetching team for balance:", error)
    return null
  }

  const members = data.team_members || []
  const skillLevels = members.map((m: any) => m.users?.skill_level || 5)

  // Calculate skill variance
  const avgSkill = skillLevels.reduce((a, b) => a + b, 0) / skillLevels.length
  const variance = skillLevels.reduce((sum, skill) => sum + Math.pow(skill - avgSkill, 2), 0) / skillLevels.length
  const skillVariance = Math.sqrt(variance)

  // Calculate position balance (ideal formation: 1 GK, 4 DEF, 4 MID, 2 FWD)
  const positionCounts: Record<string, number> = {}
  members.forEach((m: any) => {
    const pos = m.assigned_position || "Unknown"
    positionCounts[pos] = (positionCounts[pos] || 0) + 1
  })

  const idealFormation = { GK: 1, DEF: 4, MID: 4, FWD: 2 }
  let positionBalance = 0
  let totalPositions = 0

  Object.entries(positionCounts).forEach(([pos, count]) => {
    const ideal = idealFormation[pos as keyof typeof idealFormation] || 0
    positionBalance += Math.abs(count - ideal)
    totalPositions += ideal
  })

  const positionBalanceScore = Math.max(0, 100 - (positionBalance / totalPositions) * 100)

  // Overall balance score: 40% skill variance + 35% position balance + 25% team completeness
  const completenessScore = (data.player_count / 11) * 100
  const overallScore = (skillVariance / 10) * 40 + (positionBalanceScore / 100) * 35 + (completenessScore / 100) * 25

  return {
    team_id: teamId,
    team_name: data.team_name,
    avg_skill: data.avg_skill,
    avg_age: data.avg_age,
    player_count: data.player_count,
    skill_variance: skillVariance,
    position_balance: positionBalanceScore,
    overall_balance_score: Math.round(overallScore),
    positions: positionCounts,
  }
}
