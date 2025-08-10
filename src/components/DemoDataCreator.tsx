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

      // Create sample connections between all users
      await createSampleConnections();
    } catch (error) {
      console.error('Error in demo data creation:', error);
    }
  };

  const createSampleConnections = async () => {
    try {
      // Get all users from the database
      const { data: allUsers, error: usersError } = await supabase
        .from('profiles')
        .select('id');

      if (usersError || !allUsers || allUsers.length < 2) {
        console.log('Not enough users to create connections');
        return;
      }

      // Create connections between users
      const connections = [];
      const userIds = allUsers.map(u => u.id);
      
      // Create bidirectional connections between first few users
      for (let i = 0; i < Math.min(userIds.length - 1, 5); i++) {
        for (let j = i + 1; j < Math.min(userIds.length, i + 4); j++) {
          connections.push({
            follower_id: userIds[i],
            following_id: userIds[j],
            status: 'accepted'
          });
          // Add reverse connection for bidirectional relationship
          connections.push({
            follower_id: userIds[j],
            following_id: userIds[i],
            status: 'accepted'
          });
        }
      }

      if (connections.length > 0) {
        // Check which connections already exist
        const { data: existingConnections } = await supabase
          .from('user_connections')
          .select('follower_id, following_id');

        // Filter out existing connections
        const newConnections = connections.filter(conn => 
          !existingConnections?.some(existing => 
            existing.follower_id === conn.follower_id && 
            existing.following_id === conn.following_id
          )
        );

        if (newConnections.length > 0) {
          const { error: connectionsError } = await supabase
            .from('user_connections')
            .insert(newConnections);

          if (connectionsError) {
            console.error('Error creating sample connections:', connectionsError);
          } else {
            console.log(`Created ${newConnections.length} sample connections`);
          }
        }
      }
    } catch (error) {
      console.error('Error creating sample connections:', error);
    }
  };

  // This component doesn't render anything
  return null;
};

export default DemoDataCreator;