import { useEffect } from "react";
import Router from "next/router";
import useSWR from "swr";

// dont return any user data - just check if user is logged in and log out if not
export default function useUser({ redirectTo="", redirectIfFound = false } = {}){
    const { data: user } = useSWR('/api/auth/user')

    useEffect(() => {
        if(!redirectTo || !user) return

        if(
            // If redirectTo is set, redirect if the user was not found.
            (redirectTo && !redirectIfFound && !user?.isLoggedIn) ||
            // If redirectIfFound is also set, redirect if the user was found
            (redirectIfFound && user?.isLoggedIn)
        ){
            Router.push(redirectTo)
        }
    }, [user, redirectIfFound, redirectTo])
}