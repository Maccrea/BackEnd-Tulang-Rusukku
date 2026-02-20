package objects

type User struct{
	ID int
	Token int

	// Info Pribadi
	Nama string
	Umur int

}

type like struct{
	LikedUserId int
	LikedFromUserId int
}

type chat struct{
	FromUserId int
	ToUserId int
	Message string
}