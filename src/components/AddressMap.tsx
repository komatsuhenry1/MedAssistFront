"use client"

import { useMemo } from "react"

type AddressMapProps = {
    address: string
    className?: string
    height?: number
}

export default function AddressMap({ address, className, height = 250 }: AddressMapProps) {
    const src = useMemo(() => {
        const encoded = encodeURIComponent(address)
        return `https://www.google.com/maps?q=${encoded}&output=embed`
    }, [address])

    return (
        <div className={className} style={{ width: "100%" }}>
            <iframe
                title="Mapa do endereço"
                src={src}
                width="100%"
                height={height}
                style={{ border: 0, borderRadius: 8 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
            />
        </div>
    )
}


