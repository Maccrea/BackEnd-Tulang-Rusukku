package objects

type user struct{
	id int
	token int

	// Info Pribadi
	nama string
	umur int

}

type like struct{
	likedUserId int
	likedFromUserId int
}

type chat struct{
	fromUserId int
	toUserId int
	message string
}