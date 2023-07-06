export const mockRepository = () => ({
  save: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
  delete: jest.fn(),
  update: jest.fn(),

  createQueryBuilder: jest.fn().mockReturnValue({
    select: jest.fn().mockReturnThis(),
    leftJoin: jest.fn().mockReturnThis(),
    subQuery: jest.fn().mockReturnThis(),
    groupBy: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getQuery: jest.fn().mockReturnThis(),
    getRawMany: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
  }),
});
