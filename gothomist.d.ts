export type LDJSONRoot = LDJSONGraphRoot | Graph

interface LDJSONGraphRoot {
    "@context": string
    "@graph": Graph[]
}

export interface Graph {
    "@type": string
    mainEntityOfPage?: string
    image?: Image
    headline?: string
    alternativeHeadline?: string[]
    description?: string
    datePublished?: string
    dateModified?: string
    author?: Author[] | Author | string
    publisher?: Publisher
    isAccessibleForFree?: boolean
    itemListElement?: ItemListElement[]
}

export interface Image {
    "@type": string
    url: string
    width: number
    height: number
    caption: string
}

export interface Author {
    "@type": string
    name: string
    email: string
    jobTitle: string
    image: Image2
    url: string
    sameAs: string
}

export interface Image2 {
    "@type": string
    url: string
    height: number
    width: number
    caption: string
}

export interface Publisher {
    "@type": string
    name: string
    logo: Logo
    sameAs: string
    url: string
    diversityPolicy: string
}

export interface Logo {
    "@type": string
    url: string
    width: string
    height: string
}

export interface ItemListElement {
    "@type": string
    position: number
    name: string
    item: string
}
