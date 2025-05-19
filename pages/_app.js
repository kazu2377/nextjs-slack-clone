import { jwtDecode } from "jwt-decode";
import { supabase } from "lib/Store";
import UserContext from "lib/UserContext";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import "~/styles/style.scss";

export default function SupabaseSlackClone({ Component, pageProps }) {
  const [userLoaded, setUserLoaded] = useState(false);
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const router = useRouter();

  useEffect(() => {
    function saveSession(
      /** @type {Awaited<ReturnType<typeof supabase.auth.getSession>>['data']['session']} */
      session
    ) {
      setSession(session);
      const currentUser = session?.user;
      if (session) {
        const jwt = jwtDecode(session.access_token);
        currentUser.appRole = jwt.user_role;
      }
      setUser(currentUser ?? null);
      setUserLoaded(!!currentUser);
      if (currentUser) {
        router.push("/channels/[id]", "/channels/1");
      }
    }

    supabase.auth.getSession().then(({ data: { session } }) => saveSession(session));

    //修正内容data: { subscription: authListener },
    // const { subscription: authListener } = supabase.auth.onAuthStateChange(
    //   async (event, session) => {
    //     console.log(session);
    //     saveSession(session);
    //   }
    // );

    const {
      data: { subscription: authListener },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(session);
      saveSession(session);
    });

    return () => {
      authListener.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      router.push("/");
    }
  };

  return (
    <UserContext.Provider
      value={{
        userLoaded,
        user,
        signOut,
      }}
    >
      <Component {...pageProps} />
    </UserContext.Provider>
  );
}
