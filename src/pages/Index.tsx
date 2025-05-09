
import { useAuth } from "@/hooks/useAuth";
import AuthForm from "@/components/auth/AuthForm";
import AppLayout from "@/components/layout/AppLayout";
import TransactionFeed from "@/components/dashboard/TransactionFeed";
import SendMoneyForm from "@/components/dashboard/SendMoneyForm";
import { TransactionsProvider } from "@/hooks/useTransactions";

const Index = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-payment-primary mb-4">Loading...</h1>
          <p className="text-gray-500">Please wait while we load your information.</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-payment-primary mb-2">PayShare</h1>
          <p className="text-xl text-gray-600">Send and receive money with friends</p>
        </div>
        <AuthForm />
      </div>
    );
  }

  return (
    <TransactionsProvider>
      <AppLayout>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <TransactionFeed />
          </div>
          <div>
            <SendMoneyForm />
          </div>
        </div>
      </AppLayout>
    </TransactionsProvider>
  );
};

export default Index;
