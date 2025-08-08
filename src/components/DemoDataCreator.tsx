import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

// Demo users data
const demoUsers = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    first_name: 'Demo',
    last_name: 'User1',
    username: 'demouser1',
    email: 'demo1@example.com'
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    first_name: 'Demo',
    last_name: 'User2',
    username: 'demouser2',
    email: 'demo2@example.com'
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    first_name: 'Dr. Sarah',
    last_name: 'Johnson',
    username: 'healthexpert',
    email: 'expert@hemapp.com'
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    first_name: 'Support',
    last_name: 'Team',
    username: 'hemsupport',
    email: 'hemapp@gmail.com'
  },
  {
    id: '99999999-9999-9999-9999-999999999999',
    first_name: 'HemBot',
    last_name: 'AI',
    username: 'hembot',
    email: 'hembot@hemapp.ai'
  }
];

const DemoDataCreator = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      createDemoUsers();
    }
  }, [user]);

  const createDemoUsers = async () => {
    try {
      // Check if demo users already exist
      const { data: existingUsers } = await supabase
        .from('profiles')
        .select('id')
        .in('id', demoUsers.map(u => u.id));

      const existingIds = existingUsers?.map(u => u.id) || [];
      const usersToCreate = demoUsers.filter(u => !existingIds.includes(u.id));

      if (usersToCreate.length > 0) {
        const { error } = await supabase
          .from('profiles')
          .insert(usersToCreate);

        if (error) {
          console.error('Error creating demo users:', error);
        } else {
          console.log(`Created ${usersToCreate.length} demo users`);
        }
      }
    } catch (error) {
      console.error('Error in demo data creation:', error);
    }
  };

  // This component doesn't render anything
  return null;
};

export default DemoDataCreator;