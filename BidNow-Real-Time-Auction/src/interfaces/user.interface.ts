export interface UserInterface{
    email: string
    username: string
    password: string
    role: 'Bidder' | 'Auctioneer' | 'Admin'
}