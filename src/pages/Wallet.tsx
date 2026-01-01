"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Minus,
  TrendingUp,
  TrendingDown,
  Clock,
  Trophy,
  RefreshCw,
  CreditCard
} from "lucide-react"
import DashboardLayout from "@/components/DashboardLayout"
import {
  getUserBalance,
  depositFunds,
  withdrawFunds,
  getTransactionHistory,
  getTransactionSummary,
  type Transaction
} from "@/lib/balanceService"

const WalletPage = () => {
  const { user, loading } = useAuth()
  const { toast } = useToast()

  const [balance, setBalance] = useState(0)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [summary, setSummary] = useState<any>(null)
  const [dataLoading, setDataLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  const [depositAmount, setDepositAmount] = useState("")
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [activeTab, setActiveTab] = useState<"deposit" | "withdraw">("deposit")

  useEffect(() => {
    const fetchWalletData = async () => {
      if (!user?.user_id) return

      try {
        setDataLoading(true)
        const [currentBalance, txHistory, txSummary] = await Promise.all([
          getUserBalance(user.user_id),
          getTransactionHistory(user.user_id, 20),
          getTransactionSummary(user.user_id)
        ])

        setBalance(currentBalance)
        setTransactions(txHistory)
        setSummary(txSummary)
      } catch (error) {
        console.error("Error fetching wallet data:", error)
      } finally {
        setDataLoading(false)
      }
    }

    fetchWalletData()
  }, [user])

  const handleDeposit = async () => {
    const amount = parseFloat(depositAmount)
    if (!amount || amount <= 0 || !user?.user_id) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive"
      })
      return
    }

    setActionLoading(true)
    const result = await depositFunds(user.user_id, amount)
    setActionLoading(false)

    if (result.success) {
      toast({ title: "Success", description: result.message })
      setBalance(result.newBalance || balance + amount)
      setDepositAmount("")
      // Refresh transactions
      const txHistory = await getTransactionHistory(user.user_id, 20)
      setTransactions(txHistory)
    } else {
      toast({ title: "Error", description: result.message, variant: "destructive" })
    }
  }

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount)
    if (!amount || amount <= 0 || !user?.user_id) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive"
      })
      return
    }

    if (amount > balance) {
      toast({
        title: "Error",
        description: "Insufficient balance",
        variant: "destructive"
      })
      return
    }

    setActionLoading(true)
    const result = await withdrawFunds(user.user_id, amount)
    setActionLoading(false)

    if (result.success) {
      toast({ title: "Success", description: result.message })
      setBalance(result.newBalance || balance - amount)
      setWithdrawAmount("")
      // Refresh transactions
      const txHistory = await getTransactionHistory(user.user_id, 20)
      setTransactions(txHistory)
    } else {
      toast({ title: "Error", description: result.message, variant: "destructive" })
    }
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <ArrowDownLeft className="size-4 text-green-600" strokeWidth={2.5} />
      case "withdrawal":
        return <ArrowUpRight className="size-4 text-red-600" strokeWidth={2.5} />
      case "entry_fee":
        return <CreditCard className="size-4 text-orange-600" strokeWidth={2.5} />
      case "prize":
        return <Trophy className="size-4 text-yellow-600" strokeWidth={2.5} />
      case "refund":
        return <RefreshCw className="size-4 text-blue-600" strokeWidth={2.5} />
      default:
        return <Clock className="size-4" strokeWidth={2.5} />
    }
  }

  const getTransactionBadge = (type: string) => {
    const variants: Record<string, string> = {
      deposit: "bg-green-100 text-green-800 border-green-600",
      withdrawal: "bg-red-100 text-red-800 border-red-600",
      entry_fee: "bg-orange-100 text-orange-800 border-orange-600",
      prize: "bg-yellow-100 text-yellow-800 border-yellow-600",
      refund: "bg-blue-100 text-blue-800 border-blue-600"
    }
    return variants[type] || "bg-secondary text-foreground border-foreground"
  }

  const quickAmounts = [500, 1000, 2500, 5000, 10000]

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-2xl font-bold">Loading...</p>
      </div>
    )
  }

  return (
    <DashboardLayout title="Wallet">
      <div className="space-y-6">
        {/* Balance Card */}
        <Card className="border-2 border-foreground shadow-neo-xl bg-gradient-to-br from-primary/10 to-secondary/30">
          <CardContent className="p-6 lg:p-8">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-tight text-foreground/60 mb-2">
                  Available Balance
                </p>
                <p className="text-4xl lg:text-5xl font-black">
                  {dataLoading ? "..." : balance.toLocaleString()} DZD
                </p>
                {summary && (
                  <p className="text-sm font-medium text-foreground/60 mt-2 flex items-center gap-2">
                    {summary.netFlow >= 0 ? (
                      <TrendingUp className="size-4 text-green-600" strokeWidth={2.5} />
                    ) : (
                      <TrendingDown className="size-4 text-red-600" strokeWidth={2.5} />
                    )}
                    Net flow: {summary.netFlow >= 0 ? "+" : ""}{summary.netFlow.toLocaleString()} DZD
                  </p>
                )}
              </div>
              <div className="p-4 bg-primary rounded-xl border-2 border-foreground shadow-neo">
                <Wallet className="size-8 text-primary-foreground" strokeWidth={2.5} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        {summary && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <ArrowDownLeft className="size-4 text-green-600" strokeWidth={2.5} />
                  <span className="text-xs font-black uppercase text-foreground/60">Total Deposits</span>
                </div>
                <p className="text-xl font-black">{summary.totalDeposits.toLocaleString()} DZD</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Trophy className="size-4 text-yellow-600" strokeWidth={2.5} />
                  <span className="text-xs font-black uppercase text-foreground/60">Total Prizes</span>
                </div>
                <p className="text-xl font-black">{summary.totalPrizes.toLocaleString()} DZD</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <CreditCard className="size-4 text-orange-600" strokeWidth={2.5} />
                  <span className="text-xs font-black uppercase text-foreground/60">Entry Fees</span>
                </div>
                <p className="text-xl font-black">{summary.totalEntryFees.toLocaleString()} DZD</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <ArrowUpRight className="size-4 text-red-600" strokeWidth={2.5} />
                  <span className="text-xs font-black uppercase text-foreground/60">Withdrawals</span>
                </div>
                <p className="text-xl font-black">{summary.totalWithdrawals.toLocaleString()} DZD</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Deposit/Withdraw Section */}
        <Card className="border-2 border-foreground">
          <CardHeader className="pb-4">
            <div className="flex gap-2">
              <Button
                variant={activeTab === "deposit" ? "default" : "outline"}
                onClick={() => setActiveTab("deposit")}
                className="flex-1 gap-2"
              >
                <Plus className="size-4" strokeWidth={2.5} />
                Deposit
              </Button>
              <Button
                variant={activeTab === "withdraw" ? "default" : "outline"}
                onClick={() => setActiveTab("withdraw")}
                className="flex-1 gap-2"
              >
                <Minus className="size-4" strokeWidth={2.5} />
                Withdraw
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeTab === "deposit" ? (
              <>
                <div>
                  <label className="block text-sm font-black uppercase tracking-tight mb-2">
                    Deposit Amount (DZD)
                  </label>
                  <Input
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    placeholder="Enter amount"
                    min="100"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {quickAmounts.map((amt) => (
                    <Button
                      key={amt}
                      variant="outline"
                      size="sm"
                      onClick={() => setDepositAmount(amt.toString())}
                      className="flex-1 min-w-[80px]"
                    >
                      {amt.toLocaleString()}
                    </Button>
                  ))}
                </div>
                <Button
                  onClick={handleDeposit}
                  disabled={actionLoading || !depositAmount}
                  className="w-full gap-2"
                >
                  <Plus className="size-4" strokeWidth={2.5} />
                  {actionLoading ? "Processing..." : "Deposit Funds"}
                </Button>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-black uppercase tracking-tight mb-2">
                    Withdraw Amount (DZD)
                  </label>
                  <Input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="Enter amount"
                    min="100"
                    max={balance}
                  />
                  <p className="text-xs font-medium text-foreground/60 mt-1">
                    Available: {balance.toLocaleString()} DZD
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[500, 1000, 2500, balance].filter(a => a <= balance && a > 0).slice(0, 4).map((amt) => (
                    <Button
                      key={amt}
                      variant="outline"
                      size="sm"
                      onClick={() => setWithdrawAmount(amt.toString())}
                      className="flex-1 min-w-[80px]"
                    >
                      {amt === balance ? "All" : amt.toLocaleString()}
                    </Button>
                  ))}
                </div>
                <Button
                  onClick={handleWithdraw}
                  disabled={actionLoading || !withdrawAmount || parseFloat(withdrawAmount) > balance}
                  className="w-full gap-2"
                  variant="outline"
                >
                  <Minus className="size-4" strokeWidth={2.5} />
                  {actionLoading ? "Processing..." : "Withdraw Funds"}
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Transaction History */}
        <Card className="border-2 border-foreground">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="size-5" strokeWidth={2.5} />
              Transaction History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dataLoading ? (
              <p className="text-center py-8 font-medium text-foreground/60">Loading transactions...</p>
            ) : transactions.length > 0 ? (
              <div className="space-y-3">
                {transactions.map((tx) => (
                  <div
                    key={tx.transaction_id}
                    className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg border border-foreground/20 hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-background rounded-lg border border-foreground/20">
                        {getTransactionIcon(tx.type)}
                      </div>
                      <div>
                        <p className="font-bold text-sm">{tx.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={`text-xs border ${getTransactionBadge(tx.type)}`}>
                            {tx.type.replace("_", " ").toUpperCase()}
                          </Badge>
                          <span className="text-xs text-foreground/60">
                            {tx.created_at && new Date(tx.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-black text-lg ${tx.amount >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {tx.amount >= 0 ? "+" : ""}{tx.amount.toLocaleString()} DZD
                      </p>
                      <p className="text-xs text-foreground/60">
                        Balance: {tx.balance_after.toLocaleString()} DZD
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Wallet className="size-12 mx-auto mb-4 text-foreground/20" strokeWidth={1.5} />
                <p className="font-black uppercase mb-2">No Transactions Yet</p>
                <p className="text-sm text-foreground/60">Your transaction history will appear here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

export default WalletPage
