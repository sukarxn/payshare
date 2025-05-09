
import { useState, useEffect } from "react";
import { User } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTransactions } from "@/hooks/useTransactions";
import { supabase } from "@/lib/supabase";
import UserAvatar from "@/components/ui/UserAvatar";
import { toast } from "@/components/ui/sonner";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

const SendMoneyForm = () => {
  const [amount, setAmount] = useState<number | "">("");
  const [note, setNote] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { sendMoney } = useTransactions();

  import { useEffect } from "react";

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('users')
          .select('id, username, avatar_url')
          .limit(100); // adjust limit as needed
  
        if (error) throw error;
  
        const formattedUsers = data.map((user: any) => ({
          id: user.id,
          username: user.username,
          avatarUrl: user.avatar_url,
          email: "",
          balance: 0
        }));
  
        setUsers(formattedUsers);
      } catch (error: any) {
        console.error('Error fetching users:', error.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchUsers();
  }, []);
  
  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    setOpen(false);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUser) {
      toast("Please select a recipient");
      return;
    }
    
    if (!amount || amount <= 0) {
      toast("Please enter a valid amount");
      return;
    }
    
    const success = await sendMoney(selectedUser.id, Number(amount), note);
    
    if (success) {
      setAmount("");
      setNote("");
      setSelectedUser(null);
      setSearchTerm("");
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-payment-primary">Send Money</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient</Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
                >
                  {selectedUser ? selectedUser.username : "Search for a user..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
              <Command>
                {/* You can remove this if you don't want filtering at all */}
                {/* <CommandInput placeholder="Search for a user..." disabled /> */}
                <CommandList>
                  <CommandEmpty>{loading ? "Loading..." : "No users found"}</CommandEmpty>
                  <CommandGroup>
                    {users.map((user) => (
                      <CommandItem
                        key={user.id}
                        value={user.username}
                        onSelect={() => handleSelectUser(user)}
                        className="flex items-center gap-2"
                      >
                        <UserAvatar username={user.username} avatarUrl={user.avatarUrl} size="sm" />
                        <span>{user.username}</span>
                        {selectedUser?.id === user.id && (
                          <Check className="ml-auto h-4 w-4 text-payment-accent" />
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                className="pl-7"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.valueAsNumber || "")}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="note">Note (Optional)</Label>
            <Textarea
              id="note"
              placeholder="What's this payment for?"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-payment-accent hover:bg-payment-accent/90 text-white"
          >
            Send Payment
          </Button>
        </form>
      </CardContent>
      {selectedUser && (
        <CardFooter className="border-t pt-4 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <span>Sending to:</span>
            <UserAvatar username={selectedUser.username} avatarUrl={selectedUser.avatarUrl} size="sm" />
            <span className="font-medium">{selectedUser.username}</span>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default SendMoneyForm;
