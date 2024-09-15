import { getAuth, onAuthStateChanged } from 'firebase/auth';

import { useState,useEffect } from 'react'

export function useAuthStats() {
    const [loggedIn, setloggedIn] = useState(false);
    const [checkingStatus, setcheckingStatus] = useState(true);
    useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setloggedIn(true)
            }
            setcheckingStatus(false)
        })


    }, [])

    return { loggedIn, checkingStatus }
}


