
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { Transaction, User } from '../types';
import { supabase } from '../lib/supabase';
import { toast } from '@/components/ui/sonner';
import { useAuth } from './useAuth';

interface TransactionsContextType {
  transactions: Transaction[];
  loading: boolean;
  sendMoney: (receiverId: string, amount: number, note?: string) => Promise<boolean>;
  fetchTransactions: () => Promise<void>;
}

const TransactionsContext = createContext<TransactionsContextType | undefined>(undefined);

export const TransactionsProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchTransactions = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Fetch all transactions where the current user is either sender or receiver
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          sender:users!transactions_senderId_fkey(*),
          receiver:users!transactions_receiverId_fkey(*)
        `)
        .or(`senderId.eq.${user.id},receiverId.eq.${user.id}`)
        .order('createdAt', { ascending: false });
        
      if (error) throw error;
      
      setTransactions(data as Transaction[]);
    } catch (error: any) {
      console.error('Error fetching transactions:', error.message);
      toast("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTransactions();
      
      // Set up a subscription for real-time updates
      const subscription = supabase
        .channel('public:transactions')
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'transactions',
            filter: `senderId=eq.${user.id}` 
          }, 
          () => {
            fetchTransactions();
          }
        )
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'transactions',
            filter: `receiverId=eq.${user.id}` 
          }, 
          () => {
            fetchTransactions();
          }
        )
        .subscribe();
        
      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user]);

  const sendMoney = async (receiverId: string, amount: number, note?: string): Promise<boolean> => {
    if (!user) {
      toast("You must be logged in to send money");
      return false;
    }

    try {
      setLoading(true);
      
      // Check if user has enough balance
      if (user.balance < amount) {
        toast("Insufficient balance");
        return false;
      }
      
      // First create the transaction
      const { data: transactionData, error: transactionError } = await supabase
        .from('transactions')
        .insert([
          {
            senderId: user.id,
            receiverId,
            amount,
            note
          }
        ])
        .select();
        
      if (transactionError) throw transactionError;
      
      // Update sender balance
      const { error: senderError } = await supabase
        .from('users')
        .update({ balance: user.balance - amount })
        .eq('id', user.id);
        
      if (senderError) throw senderError;
      
      // Update receiver balance
      const { data: receiverData, error: receiverFetchError } = await supabase
        .from('users')
        .select('balance')
        .eq('id', receiverId)
        .single();
        
      if (receiverFetchError) throw receiverFetchError;
      
      const { error: receiverUpdateError } = await supabase
        .from('users')
        .update({ balance: (receiverData as User).balance + amount })
        .eq('id', receiverId);
        
      if (receiverUpdateError) throw receiverUpdateError;
      
      toast("Payment sent successfully!");
      
      // Update local user state
      // Note: This will be properly updated via the auth state listener
      
      // Refresh transactions list
      fetchTransactions();
      
      return true;
    } catch (error: any) {
      console.error('Error sending money:', error.message);
      toast(`Failed to send payment: ${error.message}`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <TransactionsContext.Provider value={{ 
      transactions, 
      loading, 
      sendMoney,
      fetchTransactions
    }}>
      {children}
    </TransactionsContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionsContext);
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionsProvider');
  }
  return context;
};
