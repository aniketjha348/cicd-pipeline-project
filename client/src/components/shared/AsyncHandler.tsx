import { ReactNode, useEffect, useState } from "react";

interface CompAsyncHandlerProps{
    children?:ReactNode,
    loadingChildren?:ReactNode,
}
export const CompAsyncHandler=({children,loadingChildren}:CompAsyncHandlerProps)=>{
    const [active,setActive]=useState(false);
    useEffect(()=>{

        const time=setTimeout(() => {
            setActive(true)
        }, 500);

        return ()=>clearTimeout(time)
    },[])
    if(active)
    return children
    else return loadingChildren
}