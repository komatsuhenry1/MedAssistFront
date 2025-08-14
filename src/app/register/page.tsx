import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import Link from "next/link";



export default function QualquerUm({buttonText} : {buttonText : string}) {
    return (
        <>
        <Header />
            <Button > {buttonText} </Button>

            <Link href="/">Back</Link>
            <p>
                ola
            </p>
            <p>
                ola
            </p>
        </>
    )
}