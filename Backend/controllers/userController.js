exports.createUser = async (req, res) => {
    console.log("Request body!:", req.body)

    const { firstName, lastName, email, password } = req.body

    try {
        const hashedPassword = await bcrypt.hash(password, 10)
        const userId = uuidv4()

        const params = {
            TableName: 'Meetup-Users',
            Item: {
                userId: userId,
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: hashedPassword
            }
        };

        await dynamoDB.put(params).promise()

        res.status(201).json({
            message: 'User created successfully',
            user: email
        })

    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}
