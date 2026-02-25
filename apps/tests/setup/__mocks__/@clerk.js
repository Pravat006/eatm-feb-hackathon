module.exports = {
    createClerkClient: jest.fn().mockReturnValue({
        verifyToken: jest.fn().mockResolvedValue({
            sub: 'test_clerk_user_123',
        }),
        users: {
            getUser: jest.fn().mockResolvedValue({
                id: 'test_clerk_user_123',
                emailAddresses: [{ emailAddress: 'test@example.com' }],
                firstName: 'Test',
                lastName: 'User'
            }),
        }
    })
};
