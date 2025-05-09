
import { useState } from "react";
import { Transaction } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTransactions } from "@/hooks/useTransactions";
import { useAuth } from "@/hooks/useAuth";
import UserAvatar from "@/components/ui/UserAvatar";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TransactionFeed = () => {
  const { transactions, loading } = useTransactions();
  const { user } = useAuth();
  const [filter, setFilter] = useState<"all" | "sent" | "received">("all");
  
  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center py-8">Loading transactions...</p>
        </CardContent>
      </Card>
    );
  }
  
  if (!transactions.length) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center py-8">No transactions yet. Start by sending money!</p>
        </CardContent>
      </Card>
    );
  }
  
  // Filter transactions based on the selected tab
  const filteredTransactions = transactions.filter(transaction => {
    if (filter === "all") return true;
    if (filter === "sent") return transaction.senderId === user?.id;
    if (filter === "received") return transaction.receiverId === user?.id;
    return true;
  });
  
  // Group transactions by date
  const groupedTransactions: { [date: string]: Transaction[] } = {};
  
  filteredTransactions.forEach(transaction => {
    const date = transaction.createdAt.split('T')[0]; // Get just the date part
    if (!groupedTransactions[date]) {
      groupedTransactions[date] = [];
    }
    groupedTransactions[date].push(transaction);
  });
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-payment-primary">Transaction History</CardTitle>
        <Tabs value={filter} onValueChange={(value) => setFilter(value as "all" | "sent" | "received")}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="sent">Sent</TabsTrigger>
            <TabsTrigger value="received">Received</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(groupedTransactions).map(([date, transactionsForDate]) => (
            <div key={date} className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500 py-2 sticky top-0 bg-white">
                {format(new Date(date), "MMMM d, yyyy")}
              </h3>
              
              {transactionsForDate.map(transaction => (
                <TransactionItem 
                  key={transaction.id} 
                  transaction={transaction} 
                  currentUserId={user?.id || ""} 
                />
              ))}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const TransactionItem = ({ transaction, currentUserId }: { transaction: Transaction, currentUserId: string }) => {
  const isSender = transaction.senderId === currentUserId;
  const otherUser = isSender ? transaction.receiver : transaction.sender;
  
  if (!otherUser) return null;
  
  return (
    <div className="p-4 border rounded-lg flex items-start justify-between transition-all hover:bg-payment-light animate-slide-up">
      <div className="flex items-center gap-3">
        <UserAvatar 
          username={otherUser.username} 
          avatarUrl={otherUser.avatarUrl}
          size="sm"
        />
        <div>
          <p className="font-medium">
            {isSender ? (
              <span>You paid <span className="text-payment-primary">{otherUser.username}</span></span>
            ) : (
              <span><span className="text-payment-primary">{otherUser.username}</span> paid you</span>
            )}
          </p>
          {transaction.note && (
            <p className="text-sm text-gray-500 line-clamp-1">{transaction.note}</p>
          )}
          <p className="text-xs text-gray-400">
            {format(new Date(transaction.createdAt), "h:mm a")}
          </p>
        </div>
      </div>
      <p className={`font-medium ${isSender ? "text-payment-error" : "text-payment-success"}`}>
        {isSender ? "-" : "+"} ${transaction.amount.toFixed(2)}
      </p>
    </div>
  );
};

export default TransactionFeed;
