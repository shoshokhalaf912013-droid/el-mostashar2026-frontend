import { useEffect } from "react";
import Home from "./Home";

export default function MostasharHome(){

  useEffect(()=>{

    document.body.classList.add("mostashar-theme");

    return ()=>{

      document.body.classList.remove("mostashar-theme");

    };

  },[]);

  return <Home platformSlug="elmostashar" />;

}